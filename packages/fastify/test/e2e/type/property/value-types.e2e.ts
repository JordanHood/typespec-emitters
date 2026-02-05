import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../../generated/type/property/value-types/router.js';
import { startServer } from '../../helpers.js';
import { runScenario } from '../../spector.js';
import type { Boolean } from '../../generated/type/property/value-types/operations/boolean.js';
import type { String } from '../../generated/type/property/value-types/operations/string.js';
import type { Bytes } from '../../generated/type/property/value-types/operations/bytes.js';
import type { Int } from '../../generated/type/property/value-types/operations/int.js';
import type { Float } from '../../generated/type/property/value-types/operations/float.js';
import type { Decimal } from '../../generated/type/property/value-types/operations/decimal.js';
import type { Decimal128 } from '../../generated/type/property/value-types/operations/decimal128.js';
import type { Datetime } from '../../generated/type/property/value-types/operations/datetime.js';
import type { Duration } from '../../generated/type/property/value-types/operations/duration.js';
import type { Enum } from '../../generated/type/property/value-types/operations/enum.js';
import type { ExtensibleEnum } from '../../generated/type/property/value-types/operations/extensibleenum.js';
import type { Model } from '../../generated/type/property/value-types/operations/model.js';
import type { CollectionsString } from '../../generated/type/property/value-types/operations/collectionsstring.js';
import type { CollectionsInt } from '../../generated/type/property/value-types/operations/collectionsint.js';
import type { CollectionsModel } from '../../generated/type/property/value-types/operations/collectionsmodel.js';
import type { DictionaryString } from '../../generated/type/property/value-types/operations/dictionarystring.js';
import type { Never } from '../../generated/type/property/value-types/operations/never.js';
import type { UnknownString } from '../../generated/type/property/value-types/operations/unknownstring.js';
import type { UnknownInt } from '../../generated/type/property/value-types/operations/unknownint.js';
import type { UnknownDict } from '../../generated/type/property/value-types/operations/unknowndict.js';
import type { UnknownArray } from '../../generated/type/property/value-types/operations/unknownarray.js';
import type { StringLiteral } from '../../generated/type/property/value-types/operations/stringliteral.js';
import type { IntLiteral } from '../../generated/type/property/value-types/operations/intliteral.js';
import type { FloatLiteral } from '../../generated/type/property/value-types/operations/floatliteral.js';
import type { BooleanLiteral } from '../../generated/type/property/value-types/operations/booleanliteral.js';
import type { UnionStringLiteral } from '../../generated/type/property/value-types/operations/unionstringliteral.js';
import type { UnionIntLiteral } from '../../generated/type/property/value-types/operations/unionintliteral.js';
import type { UnionFloatLiteral } from '../../generated/type/property/value-types/operations/unionfloatliteral.js';
import type { UnionEnumValue } from '../../generated/type/property/value-types/operations/unionenumvalue.js';
import { FixedInnerEnum } from '../../generated/type/property/value-types/models/valuetypes.js';

describe('Type.Property.Value-types', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const booleanOps: Boolean = {
      get: async function () {
        return { property: true };
      },
      put: async function (body) {},
    };

    const stringOps: String = {
      get: async function () {
        return { property: 'hello' };
      },
      put: async function (body) {},
    };

    const bytesOps: Bytes = {
      get: async function () {
        return {
          property: new Uint8Array(Buffer.from('aGVsbG8sIHdvcmxkIQ==', 'base64')),
        };
      },
      put: async function (body) {},
    };

    const intOps: Int = {
      get: async function () {
        return { property: 42 };
      },
      put: async function (body) {},
    };

    const floatOps: Float = {
      get: async function () {
        return { property: 43.125 };
      },
      put: async function (body) {},
    };

    const decimalOps: Decimal = {
      get: async function () {
        return { property: 0.33333 };
      },
      put: async function (body) {},
    };

    const decimal128Ops: Decimal128 = {
      get: async function () {
        return { property: 0.33333 };
      },
      put: async function (body) {},
    };

    const datetimeOps: Datetime = {
      get: async function () {
        return { property: new Date('2022-08-26T18:38:00Z') };
      },
      put: async function (body) {},
    };

    const durationOps: Duration = {
      get: async function () {
        return { property: 'P123DT22H14M12.011S' };
      },
      put: async function (body) {},
    };

    const enumOps: Enum = {
      get: async function () {
        return { property: FixedInnerEnum.ValueOne };
      },
      put: async function (body) {},
    };

    const extensibleEnumOps: ExtensibleEnum = {
      get: async function () {
        return { property: 'UnknownValue' };
      },
      put: async function (body) {},
    };

    const modelOps: Model = {
      get: async function () {
        return { property: { property: 'hello' } };
      },
      put: async function (body) {},
    };

    const collectionsStringOps: CollectionsString = {
      get: async function () {
        return { property: ['hello', 'world'] };
      },
      put: async function (body) {},
    };

    const collectionsIntOps: CollectionsInt = {
      get: async function () {
        return { property: [1, 2] };
      },
      put: async function (body) {},
    };

    const collectionsModelOps: CollectionsModel = {
      get: async function () {
        return { property: [{ property: 'hello' }, { property: 'world' }] };
      },
      put: async function (body) {},
    };

    const dictionaryStringOps: DictionaryString = {
      get: async function () {
        return { property: { k1: 'hello', k2: 'world' } };
      },
      put: async function (body) {},
    };

    const neverOps: Never = {
      get: async function () {
        return {};
      },
      put: async function (body) {},
    };

    const unknownStringOps: UnknownString = {
      get: async function () {
        return { property: 'hello' };
      },
      put: async function (body) {},
    };

    const unknownIntOps: UnknownInt = {
      get: async function () {
        return { property: 42 };
      },
      put: async function (body) {},
    };

    const unknownDictOps: UnknownDict = {
      get: async function () {
        return { property: { k1: 'hello', k2: 42 } };
      },
      put: async function (body) {},
    };

    const unknownArrayOps: UnknownArray = {
      get: async function () {
        return { property: ['hello', 'world'] };
      },
      put: async function (body) {},
    };

    const stringLiteralOps: StringLiteral = {
      get: async function () {
        return { property: 'hello' };
      },
      put: async function (body) {},
    };

    const intLiteralOps: IntLiteral = {
      get: async function () {
        return { property: 42 };
      },
      put: async function (body) {},
    };

    const floatLiteralOps: FloatLiteral = {
      get: async function () {
        return { property: 43.125 };
      },
      put: async function (body) {},
    };

    const booleanLiteralOps: BooleanLiteral = {
      get: async function () {
        return { property: true };
      },
      put: async function (body) {},
    };

    const unionStringLiteralOps: UnionStringLiteral = {
      get: async function () {
        return { property: 'world' };
      },
      put: async function (body) {},
    };

    const unionIntLiteralOps: UnionIntLiteral = {
      get: async function () {
        return { property: 42 };
      },
      put: async function (body) {},
    };

    const unionFloatLiteralOps: UnionFloatLiteral = {
      get: async function () {
        return { property: 46.875 };
      },
      put: async function (body) {},
    };

    const unionEnumValueOps: UnionEnumValue = {
      get: async function () {
        return { property: 'value2' };
      },
      put: async function (body) {},
    };

    const operations = {
      boolean: booleanOps,
      string: stringOps,
      bytes: bytesOps,
      int: intOps,
      float: floatOps,
      decimal: decimalOps,
      decimal128: decimal128Ops,
      datetime: datetimeOps,
      duration: durationOps,
      enum_: enumOps,
      extensibleenum: extensibleEnumOps,
      model: modelOps,
      collectionsstring: collectionsStringOps,
      collectionsint: collectionsIntOps,
      collectionsmodel: collectionsModelOps,
      dictionarystring: dictionaryStringOps,
      never: neverOps,
      unknownstring: unknownStringOps,
      unknownint: unknownIntOps,
      unknowndict: unknownDictOps,
      unknownarray: unknownArrayOps,
      stringliteral: stringLiteralOps,
      intliteral: intLiteralOps,
      floatliteral: floatLiteralOps,
      booleanliteral: booleanLiteralOps,
      unionstringliteral: unionStringLiteralOps,
      unionintliteral: unionIntLiteralOps,
      unionfloatliteral: unionFloatLiteralOps,
      unionenumvalue: unionEnumValueOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('type/property/value-types', baseUrl);
    expect(status).toBe('pass');
  });
});
