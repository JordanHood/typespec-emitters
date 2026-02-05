import { refkey, type Refkey } from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';

export function getNoContentResponseRef(): Refkey {
  return refkey('NoContentResponse', 'response-types');
}

export function getResponseWithBodyRef(): Refkey {
  return refkey('ResponseWithBody', 'response-types');
}

export function ResponseTypes() {
  const noContentRef = getNoContentResponseRef();

  return (
    <>
      <ts.InterfaceDeclaration name="NoContentResponse" export refkey={noContentRef}>
        <>statusCode: number</>
      </ts.InterfaceDeclaration>
      {'\n\n'}
      <>
        export interface ResponseWithBody{'<'}TBody{'>'} {'{'}
        {'\n'}
        {'  '}statusCode: number;
        {'\n'}
        {'  '}body: TBody;
        {'\n'}
        {'}'}
      </>
    </>
  );
}
