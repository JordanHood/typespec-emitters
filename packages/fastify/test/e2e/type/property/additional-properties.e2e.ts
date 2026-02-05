import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../../generated/type/property/additional-properties/router.js';
import { startServer } from '../../helpers.js';
import { runScenario } from '../../spector.js';
import type { ExtendsUnknown } from '../../generated/type/property/additional-properties/operations/extendsunknown.js';
import type { ExtendsUnknownDerived } from '../../generated/type/property/additional-properties/operations/extendsunknownderived.js';
import type { ExtendsUnknownDiscriminated } from '../../generated/type/property/additional-properties/operations/extendsunknowndiscriminated.js';
import type { IsUnknown } from '../../generated/type/property/additional-properties/operations/isunknown.js';
import type { IsUnknownDerived } from '../../generated/type/property/additional-properties/operations/isunknownderived.js';
import type { IsUnknownDiscriminated } from '../../generated/type/property/additional-properties/operations/isunknowndiscriminated.js';
import type { ExtendsString } from '../../generated/type/property/additional-properties/operations/extendsstring.js';
import type { IsString } from '../../generated/type/property/additional-properties/operations/isstring.js';
import type { SpreadString } from '../../generated/type/property/additional-properties/operations/spreadstring.js';
import type { ExtendsFloat } from '../../generated/type/property/additional-properties/operations/extendsfloat.js';
import type { IsFloat } from '../../generated/type/property/additional-properties/operations/isfloat.js';
import type { SpreadFloat } from '../../generated/type/property/additional-properties/operations/spreadfloat.js';
import type { ExtendsModel } from '../../generated/type/property/additional-properties/operations/extendsmodel.js';
import type { IsModel } from '../../generated/type/property/additional-properties/operations/ismodel.js';
import type { SpreadModel } from '../../generated/type/property/additional-properties/operations/spreadmodel.js';
import type { ExtendsModelArray } from '../../generated/type/property/additional-properties/operations/extendsmodelarray.js';
import type { IsModelArray } from '../../generated/type/property/additional-properties/operations/ismodelarray.js';
import type { SpreadModelArray } from '../../generated/type/property/additional-properties/operations/spreadmodelarray.js';
import type { SpreadDifferentString } from '../../generated/type/property/additional-properties/operations/spreaddifferentstring.js';
import type { SpreadDifferentFloat } from '../../generated/type/property/additional-properties/operations/spreaddifferentfloat.js';
import type { SpreadDifferentModel } from '../../generated/type/property/additional-properties/operations/spreaddifferentmodel.js';
import type { SpreadDifferentModelArray } from '../../generated/type/property/additional-properties/operations/spreaddifferentmodelarray.js';
import type { ExtendsDifferentSpreadString } from '../../generated/type/property/additional-properties/operations/extendsdifferentspreadstring.js';
import type { ExtendsDifferentSpreadFloat } from '../../generated/type/property/additional-properties/operations/extendsdifferentspreadfloat.js';
import type { ExtendsDifferentSpreadModel } from '../../generated/type/property/additional-properties/operations/extendsdifferentspreadmodel.js';
import type { ExtendsDifferentSpreadModelArray } from '../../generated/type/property/additional-properties/operations/extendsdifferentspreadmodelarray.js';
import type { MultipleSpread } from '../../generated/type/property/additional-properties/operations/multiplespread.js';
import type { SpreadRecordUnion } from '../../generated/type/property/additional-properties/operations/spreadrecordunion.js';
import type { SpreadRecordNonDiscriminatedUnion } from '../../generated/type/property/additional-properties/operations/spreadrecordnondiscriminatedunion.js';
import type { SpreadRecordNonDiscriminatedUnion2 } from '../../generated/type/property/additional-properties/operations/spreadrecordnondiscriminatedunion2.js';
import type { SpreadRecordNonDiscriminatedUnion3 } from '../../generated/type/property/additional-properties/operations/spreadrecordnondiscriminatedunion3.js';

describe('Type.Property.Additional-properties', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const extendsUnknownOps: ExtendsUnknown = {
      get: async function () {
        return {
          name: 'ExtendsUnknownAdditionalProperties',
          prop1: 32,
          prop2: true,
          prop3: 'abc',
        };
      },
      put: async function (body) {},
    };

    const extendsUnknownDerivedOps: ExtendsUnknownDerived = {
      get: async function () {
        return {
          name: 'ExtendsUnknownAdditionalProperties',
          index: 314,
          age: 2.71875,
          prop1: 32,
          prop2: true,
          prop3: 'abc',
        };
      },
      put: async function (body) {},
    };

    const extendsUnknownDiscriminatedOps: ExtendsUnknownDiscriminated = {
      get: async function () {
        return {
          kind: 'derived',
          name: 'Derived',
          index: 314,
          age: 2.71875,
          prop1: 32,
          prop2: true,
          prop3: 'abc',
        };
      },
      put: async function (body) {},
    };

    const isUnknownOps: IsUnknown = {
      get: async function () {
        return {
          name: 'IsUnknownAdditionalProperties',
          prop1: 32,
          prop2: true,
          prop3: 'abc',
        };
      },
      put: async function (body) {},
    };

    const isUnknownDerivedOps: IsUnknownDerived = {
      get: async function () {
        return {
          name: 'IsUnknownAdditionalProperties',
          index: 314,
          age: 2.71875,
          prop1: 32,
          prop2: true,
          prop3: 'abc',
        };
      },
      put: async function (body) {},
    };

    const isUnknownDiscriminatedOps: IsUnknownDiscriminated = {
      get: async function () {
        return {
          kind: 'derived',
          name: 'Derived',
          index: 314,
          age: 2.71875,
          prop1: 32,
          prop2: true,
          prop3: 'abc',
        };
      },
      put: async function (body) {},
    };

    const extendsStringOps: ExtendsString = {
      get: async function () {
        return { name: 'ExtendsStringAdditionalProperties', prop: 'abc' };
      },
      put: async function (body) {},
    };

    const isStringOps: IsString = {
      get: async function () {
        return { name: 'IsStringAdditionalProperties', prop: 'abc' };
      },
      put: async function (body) {},
    };

    const spreadStringOps: SpreadString = {
      get: async function () {
        return { name: 'SpreadSpringRecord', prop: 'abc' };
      },
      put: async function (body) {},
    };

    const extendsFloatOps: ExtendsFloat = {
      get: async function () {
        return { id: 43.125, prop: 43.125 };
      },
      put: async function (body) {},
    };

    const isFloatOps: IsFloat = {
      get: async function () {
        return { id: 43.125, prop: 43.125 };
      },
      put: async function (body) {},
    };

    const spreadFloatOps: SpreadFloat = {
      get: async function () {
        return { id: 43.125, prop: 43.125 };
      },
      put: async function (body) {},
    };

    const extendsModelOps: ExtendsModel = {
      get: async function () {
        return { knownProp: { state: 'ok' }, prop: { state: 'ok' } };
      },
      put: async function (body) {},
    };

    const isModelOps: IsModel = {
      get: async function () {
        return { knownProp: { state: 'ok' }, prop: { state: 'ok' } };
      },
      put: async function (body) {},
    };

    const spreadModelOps: SpreadModel = {
      get: async function () {
        return { knownProp: { state: 'ok' }, prop: { state: 'ok' } };
      },
      put: async function (body) {},
    };

    const extendsModelArrayOps: ExtendsModelArray = {
      get: async function () {
        return {
          knownProp: [{ state: 'ok' }, { state: 'ok' }],
          prop: [{ state: 'ok' }, { state: 'ok' }],
        };
      },
      put: async function (body) {},
    };

    const isModelArrayOps: IsModelArray = {
      get: async function () {
        return {
          knownProp: [{ state: 'ok' }, { state: 'ok' }],
          prop: [{ state: 'ok' }, { state: 'ok' }],
        };
      },
      put: async function (body) {},
    };

    const spreadModelArrayOps: SpreadModelArray = {
      get: async function () {
        return {
          knownProp: [{ state: 'ok' }, { state: 'ok' }],
          prop: [{ state: 'ok' }, { state: 'ok' }],
        };
      },
      put: async function (body) {},
    };

    const spreadDifferentStringOps: SpreadDifferentString = {
      get: async function () {
        return { id: 43.125, prop: 'abc' };
      },
      put: async function (body) {},
    };

    const spreadDifferentFloatOps: SpreadDifferentFloat = {
      get: async function () {
        return { name: 'abc', prop: 43.125 };
      },
      put: async function (body) {},
    };

    const spreadDifferentModelOps: SpreadDifferentModel = {
      get: async function () {
        return { knownProp: 'abc', prop: { state: 'ok' } };
      },
      put: async function (body) {},
    };

    const spreadDifferentModelArrayOps: SpreadDifferentModelArray = {
      get: async function () {
        return { knownProp: 'abc', prop: [{ state: 'ok' }, { state: 'ok' }] };
      },
      put: async function (body) {},
    };

    const extendsDifferentSpreadStringOps: ExtendsDifferentSpreadString = {
      get: async function () {
        return { id: 43.125, prop: 'abc', derivedProp: 'abc' };
      },
      put: async function (body) {},
    };

    const extendsDifferentSpreadFloatOps: ExtendsDifferentSpreadFloat = {
      get: async function () {
        return { name: 'abc', prop: 43.125, derivedProp: 43.125 };
      },
      put: async function (body) {},
    };

    const extendsDifferentSpreadModelOps: ExtendsDifferentSpreadModel = {
      get: async function () {
        return {
          knownProp: 'abc',
          prop: { state: 'ok' },
          derivedProp: { state: 'ok' },
        };
      },
      put: async function (body) {},
    };

    const extendsDifferentSpreadModelArrayOps: ExtendsDifferentSpreadModelArray = {
      get: async function () {
        return {
          knownProp: 'abc',
          prop: [{ state: 'ok' }, { state: 'ok' }],
          derivedProp: [{ state: 'ok' }, { state: 'ok' }],
        };
      },
      put: async function (body) {},
    };

    const multipleSpreadOps: MultipleSpread = {
      get: async function () {
        return { flag: true, prop1: 'abc', prop2: 43.125 };
      },
      put: async function (body) {},
    };

    const spreadRecordUnionOps: SpreadRecordUnion = {
      get: async function () {
        return { flag: true, prop1: 'abc', prop2: 43.125 };
      },
      put: async function (body) {},
    };

    const spreadRecordNonDiscriminatedUnionOps: SpreadRecordNonDiscriminatedUnion = {
      get: async function () {
        return {
          name: 'abc',
          prop1: { kind: 'kind0', fooProp: 'abc' },
          prop2: {
            kind: 'kind1',
            start: new Date('2021-01-01T00:00:00Z'),
            end: new Date('2021-01-02T00:00:00Z'),
          },
        };
      },
      put: async function (body) {},
    };

    const spreadRecordNonDiscriminatedUnion2Ops: SpreadRecordNonDiscriminatedUnion2 = {
      get: async function () {
        return {
          name: 'abc',
          prop1: { kind: 'kind1', start: '2021-01-01T00:00:00Z' },
          prop2: {
            kind: 'kind1',
            start: new Date('2021-01-01T00:00:00Z'),
            end: new Date('2021-01-02T00:00:00Z'),
          },
        };
      },
      put: async function (body) {},
    };

    const spreadRecordNonDiscriminatedUnion3Ops: SpreadRecordNonDiscriminatedUnion3 = {
      get: async function () {
        return {
          name: 'abc',
          prop1: [
            { kind: 'kind1', start: '2021-01-01T00:00:00Z' },
            { kind: 'kind1', start: '2021-01-01T00:00:00Z' },
          ],
          prop2: {
            kind: 'kind1',
            start: new Date('2021-01-01T00:00:00Z'),
            end: new Date('2021-01-02T00:00:00Z'),
          },
        };
      },
      put: async function (body) {},
    };

    const operations = {
      extendsunknown: extendsUnknownOps,
      extendsunknownderived: extendsUnknownDerivedOps,
      extendsunknowndiscriminated: extendsUnknownDiscriminatedOps,
      isunknown: isUnknownOps,
      isunknownderived: isUnknownDerivedOps,
      isunknowndiscriminated: isUnknownDiscriminatedOps,
      extendsstring: extendsStringOps,
      isstring: isStringOps,
      spreadstring: spreadStringOps,
      extendsfloat: extendsFloatOps,
      isfloat: isFloatOps,
      spreadfloat: spreadFloatOps,
      extendsmodel: extendsModelOps,
      ismodel: isModelOps,
      spreadmodel: spreadModelOps,
      extendsmodelarray: extendsModelArrayOps,
      ismodelarray: isModelArrayOps,
      spreadmodelarray: spreadModelArrayOps,
      spreaddifferentstring: spreadDifferentStringOps,
      spreaddifferentfloat: spreadDifferentFloatOps,
      spreaddifferentmodel: spreadDifferentModelOps,
      spreaddifferentmodelarray: spreadDifferentModelArrayOps,
      extendsdifferentspreadstring: extendsDifferentSpreadStringOps,
      extendsdifferentspreadfloat: extendsDifferentSpreadFloatOps,
      extendsdifferentspreadmodel: extendsDifferentSpreadModelOps,
      extendsdifferentspreadmodelarray: extendsDifferentSpreadModelArrayOps,
      multiplespread: multipleSpreadOps,
      spreadrecordunion: spreadRecordUnionOps,
      spreadrecordnondiscriminatedunion: spreadRecordNonDiscriminatedUnionOps,
      spreadrecordnondiscriminatedunion2: spreadRecordNonDiscriminatedUnion2Ops,
      spreadrecordnondiscriminatedunion3: spreadRecordNonDiscriminatedUnion3Ops,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('type/property/additional-properties', baseUrl);
    expect(status).toBe('pass');
  });
});
