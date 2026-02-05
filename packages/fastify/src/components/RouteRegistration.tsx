import { code, For, List, refkey, type Refkey, type Children } from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';
import { useTSNamePolicy } from '@alloy-js/typescript';
import type { HttpOperation } from '@typespec/http';
import { isVoidType } from '@typespec/compiler';
import { getHttpVerb } from '../utils/http-helpers.js';
import { fastifyLib } from '../external-packages/fastify.js';
import { fastifyTypeProviderZod } from '../external-packages/fastify-type-provider-zod.js';
import { getOperationInterfaceRef } from './OperationInterface.js';
import { ZodSchema, zod } from 'typespec-zod';

export interface RouteRegistrationProps {
  containerName: string;
  operations: HttpOperation[];
}

/**
 * Creates a refkey for a route registration function.
 * This allows the loadRoutes function to reference it with automatic imports.
 */
export function getRouteRegistrationRef(containerName: string): Refkey {
  return refkey(containerName, 'route-registration');
}

/**
 * Generates Fastify route registration functions with Zod schema validation.
 * Uses fastify-type-provider-zod for automatic type inference and runtime validation.
 */
export function RouteRegistration(props: RouteRegistrationProps) {
  const { containerName, operations } = props;
  const namePolicy = useTSNamePolicy();
  const functionName = namePolicy.getName(`register_${containerName}_routes`, 'function');
  const interfaceRef = getOperationInterfaceRef(containerName);
  const routeRegRef = getRouteRegistrationRef(containerName);

  return (
    <ts.FunctionDeclaration
      name={functionName}
      export
      refkey={routeRegRef}
      async
      parameters={[
        { name: 'fastify', type: fastifyLib.FastifyInstance },
        { name: 'operations', type: interfaceRef },
      ]}
      returnType="void"
    >
      <List>
        <ts.VarDeclaration name="server" const>
          fastify.withTypeProvider{'<'}
          {fastifyTypeProviderZod.ZodTypeProvider}
          {'>'}()
        </ts.VarDeclaration>
        <For each={operations} hardline>
          {(operation) => {
            const verb = getHttpVerb(operation);
            const rawPath = operation.uriTemplate || operation.path;

            const queryStartIndex = rawPath.indexOf('{?');
            const pathWithoutQuery =
              queryStartIndex >= 0 ? rawPath.substring(0, queryStartIndex) : rawPath;

            const optionalParams = new Set();
            for (const param of operation.parameters.parameters) {
              if (param.type === 'path' && param.param.optional) {
                optionalParams.add(param.param.name);
              }
            }

            const path = pathWithoutQuery.replace(/\{([^}]+)\}/g, function (_match, p1) {
              const paramName = p1.startsWith('/') ? p1.slice(1) : p1;
              const prefix = p1.startsWith('/') ? '/:' : ':';
              const suffix = optionalParams.has(paramName) ? '?' : '';
              return prefix + paramName + suffix;
            });

            const opName = namePolicy.getName(operation.operation.name, 'function');

            const routeSchema = generateZodRouteSchema(operation);

            return (
              <>
                {code`server.${verb}('${path}', ${routeSchema}, ${generateRouteHandler(operation, opName, namePolicy)});`}
              </>
            );
          }}
        </For>
      </List>
    </ts.FunctionDeclaration>
  );
}

function generateZodRouteSchema(operation: HttpOperation): Children {
  const schemaProps: Children[] = [];

  const pathParams = operation.parameters.parameters.filter(function (p) {
    return p.type === 'path';
  });

  if (pathParams.length > 0) {
    const pathProperties: Children[] = [];
    for (let i = 0; i < pathParams.length; i++) {
      const param = pathParams[i];
      const paramName = param.param.name;
      const isOptional = param.param.optional;
      if (i > 0) pathProperties.push(<>, </>);
      if (isOptional) {
        pathProperties.push(
          <>
            {paramName}: <ZodSchema type={param.param.type} />
            .optional()
          </>
        );
      } else {
        pathProperties.push(
          <>
            {paramName}: <ZodSchema type={param.param.type} />
          </>
        );
      }
    }
    schemaProps.push(
      <>
        params: {zod.z}.object({'{'}
        {pathProperties}
        {'}'})
      </>
    );
  }

  const queryParams = operation.parameters.parameters.filter(function (p) {
    return p.type === 'query';
  });

  if (queryParams.length > 0) {
    if (schemaProps.length > 0) schemaProps.push(<>, </>);
    const queryProperties: Children[] = [];
    for (let i = 0; i < queryParams.length; i++) {
      const param = queryParams[i];
      const paramName = param.param.name;
      const isOptional = param.param.optional;
      if (i > 0) queryProperties.push(<>, </>);
      const paramType = param.param.type;
      const needsNumberCoercion =
        paramType.kind === 'Scalar' &&
        (paramType.name === 'numeric' ||
          paramType.name === 'integer' ||
          paramType.name === 'float' ||
          paramType.name === 'decimal' ||
          paramType.name === 'decimal128' ||
          paramType.name === 'int8' ||
          paramType.name === 'int16' ||
          paramType.name === 'int32' ||
          paramType.name === 'int64' ||
          paramType.name === 'uint8' ||
          paramType.name === 'uint16' ||
          paramType.name === 'uint32' ||
          paramType.name === 'uint64' ||
          paramType.name === 'safeint' ||
          paramType.name === 'float32' ||
          paramType.name === 'float64');

      if (needsNumberCoercion) {
        if (isOptional) {
          queryProperties.push(
            <>
              {paramName}: {zod.z}.coerce.number().optional()
            </>
          );
        } else {
          queryProperties.push(
            <>
              {paramName}: {zod.z}.coerce.number()
            </>
          );
        }
      } else {
        const baseSchema = <ZodSchema type={param.param.type} />;
        if (isOptional) {
          queryProperties.push(
            <>
              {paramName}: {baseSchema}.optional()
            </>
          );
        } else {
          queryProperties.push(
            <>
              {paramName}: {baseSchema}
            </>
          );
        }
      }
    }
    schemaProps.push(
      <>
        querystring: {zod.z}.object({'{'}
        {queryProperties}
        {'}'})
      </>
    );
  }

  if (operation.parameters.body) {
    const bodyParam = operation.parameters.body;
    const isOptional = bodyParam.property?.optional ?? false;

    if (!isOptional) {
      if (schemaProps.length > 0) schemaProps.push(<>, </>);
      schemaProps.push(
        <>
          body: <ZodSchema type={bodyParam.type} />
        </>
      );
    }
  }

  if (schemaProps.length === 0) {
    return <ts.ObjectExpression />;
  }

  return (
    <ts.ObjectExpression>
      schema: {'{'}
      {schemaProps}
      {'}'}
    </ts.ObjectExpression>
  );
}

function generateRouteHandler(
  operation: HttpOperation,
  opName: string,
  namePolicy: ReturnType<typeof useTSNamePolicy>
) {
  const callArgs: Children[] = [];

  for (const param of operation.parameters.parameters) {
    if (param.type === 'path') {
      const paramName = namePolicy.getName(param.param.name, 'parameter');
      callArgs.push(<>request.params.{paramName}</>);
    }
  }

  if (operation.parameters.body) {
    const bodyParam = operation.parameters.body;
    const isOptional = bodyParam.property?.optional ?? false;

    if (isOptional) {
      callArgs.push(<>request.body as any</>);
    } else {
      callArgs.push(<>request.body</>);
    }
  }

  for (const param of operation.parameters.parameters) {
    if (param.type === 'header') {
      const headerKey = param.name.toLowerCase();
      const headerAccess = <>request.headers['{headerKey}']</>;
      callArgs.push(
        <>
          (Array.isArray({headerAccess}) ? {headerAccess}[0] : {headerAccess}) as string
        </>
      );
    }
  }

  const queryParams = operation.parameters.parameters.filter((p) => p.type === 'query');

  if (queryParams.length > 0) {
    const optionsObj = (
      <ts.ObjectExpression>
        {queryParams
          .map(function (param, index) {
            const paramName = namePolicy.getName(param.param.name, 'object-member-data');
            const separator = index > 0 ? ', ' : '';
            return `${separator}${paramName}: request.query.${paramName}`;
          })
          .join('')}
      </ts.ObjectExpression>
    );
    callArgs.push(optionsObj);
  }

  const isVoid = isVoidType(operation.operation.returnType);
  const is204Response = operation.responses.some(function (r) {
    return r.statusCodes === 204;
  });
  const isNoContent = isVoid || is204Response;

  const contentType = operation.responses
    .find(function (r) {
      return r.responses.some(function (rc) {
        return rc.body?.contentTypes && rc.body.contentTypes.length > 0;
      });
    })
    ?.responses.find(function (rc) {
      return rc.body?.contentTypes && rc.body.contentTypes.length > 0;
    })?.body?.contentTypes[0];

  return (
    <ts.FunctionExpression async parameters={[{ name: 'request' }, { name: 'reply' }]}>
      <List>
        <>try {'{'}</>
        <List>
          <ts.VarDeclaration name="result">
            await <ts.FunctionCallExpression target={<>operations.{opName}</>} args={callArgs} />
          </ts.VarDeclaration>
          {isNoContent ? (
            <>reply.code(result.statusCode).send();</>
          ) : contentType === 'application/json' ? (
            <>
              reply.type('application/json').code(result.statusCode).send(
              JSON.stringify(result.body) );
            </>
          ) : contentType ? (
            <>
              reply.type('{contentType}
              ').code(result.statusCode).send(result.body);
            </>
          ) : (
            <>reply.code(result.statusCode).send(result.body);</>
          )}
        </List>
        <>
          {'}'} catch (error) {'{'}
        </>
        <List>
          <>
            reply.code(500).send({'{'} error: error instanceof Error ? error.message : 'Internal
            server error' {'}'});
          </>
        </List>
        <>{'}'}</>
      </List>
    </ts.FunctionExpression>
  );
}
