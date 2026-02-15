import { ModelProperty } from '@typespec/compiler';
import { describe, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

it('works with boolean', async () => {
  const runner = await createTestRunner();
  const { booleanProp } = (await runner.compile(`
      model Test {
        @test
        booleanProp: boolean,
      }
    `)) as Record<string, ModelProperty>;

  expectRender(runner.program, <TypeBoxSchema type={booleanProp.type} />, 'Type.Boolean()');
});

it('works with string', async () => {
  const runner = await createTestRunner();
  const { stringProp, urlProp } = (await runner.compile(`
      model Test {
        @test stringProp: string,
        @test urlProp: url
      }
    `)) as Record<string, ModelProperty>;

  expectRender(runner.program, <TypeBoxSchema type={stringProp.type} />, 'Type.String()');
  expectRender(
    runner.program,
    <TypeBoxSchema type={urlProp.type} />,
    'Type.String({\n  format: "uri"\n})'
  );
});

describe('numerics', () => {
  it('works with integers', async () => {
    const runner = await createTestRunner();
    const { int8Prop, int16Prop, int32Prop, int64Prop } = (await runner.compile(`
        model Test {
          @test int8Prop: int8,
          @test int16Prop: int16,
          @test int32Prop: int32,
          @test int64Prop: int64,
        }
      `)) as Record<string, ModelProperty>;

    expectRender(runner.program, <TypeBoxSchema type={int8Prop.type} />, 'Type.Integer()');
    expectRender(runner.program, <TypeBoxSchema type={int16Prop.type} />, 'Type.Integer()');
    expectRender(runner.program, <TypeBoxSchema type={int32Prop.type} />, 'Type.Integer()');
    expectRender(runner.program, <TypeBoxSchema type={int64Prop.type} />, 'Type.BigInt()');
  });

  it('works with unsigned integers', async () => {
    const runner = await createTestRunner();
    const { uint8Prop, uint16Prop, uint32Prop, uint64Prop, safeintProp } = (await runner.compile(`
      model Test {
        @test uint8Prop: uint8,
        @test uint16Prop: uint16,
        @test uint32Prop: uint32,
        @test uint64Prop: uint64,
        @test safeintProp: safeint,
      }
    `)) as Record<string, ModelProperty>;

    expectRender(runner.program, <TypeBoxSchema type={uint8Prop.type} />, 'Type.Integer()');
    expectRender(runner.program, <TypeBoxSchema type={uint16Prop.type} />, 'Type.Integer()');
    expectRender(runner.program, <TypeBoxSchema type={uint32Prop.type} />, 'Type.Integer()');
    expectRender(runner.program, <TypeBoxSchema type={uint64Prop.type} />, 'Type.BigInt()');
    expectRender(runner.program, <TypeBoxSchema type={safeintProp.type} />, 'Type.Integer()');
  });

  it('works with floats', async () => {
    const runner = await createTestRunner();
    const { float32Prop, float64Prop, floatProp } = (await runner.compile(`
        model Test {
          @test float32Prop: float32,
          @test float64Prop: float64,
          @test floatProp: float,
        }
      `)) as Record<string, ModelProperty>;

    expectRender(runner.program, <TypeBoxSchema type={float32Prop.type} />, 'Type.Number()');
    expectRender(runner.program, <TypeBoxSchema type={float64Prop.type} />, 'Type.Number()');
    expectRender(runner.program, <TypeBoxSchema type={floatProp.type} />, 'Type.Number()');
  });

  it('works with decimals', async () => {
    const runner = await createTestRunner();
    const { decimalProp, decimal128Prop } = (await runner.compile(`
        model Test {
          @test decimalProp: decimal,
          @test decimal128Prop: decimal128,
        }
      `)) as Record<string, ModelProperty>;

    expectRender(runner.program, <TypeBoxSchema type={decimalProp.type} />, 'Type.Number()');
    expectRender(runner.program, <TypeBoxSchema type={decimal128Prop.type} />, 'Type.Number()');
  });
});

it('works with bytes', async () => {
  const runner = await createTestRunner();
  const { bytesProp } = (await runner.compile(`
      model Test {
        @test bytesProp: bytes,
      }
    `)) as Record<string, ModelProperty>;

  expectRender(runner.program, <TypeBoxSchema type={bytesProp.type} />, 'Type.Any()');
});

it('works with date things', async () => {
  const runner = await createTestRunner();
  const { plainDateProp, plainTimeProp, utcDateTimeProp, offsetDateTimeProp } =
    (await runner.compile(`
      model Test {
        @test plainDateProp: plainDate,
        @test plainTimeProp: plainTime,
        @test utcDateTimeProp: utcDateTime,
        @test offsetDateTimeProp: offsetDateTime
      }
    `)) as Record<string, ModelProperty>;

  expectRender(runner.program, <TypeBoxSchema type={plainDateProp.type} />, 'Type.Date()');
  expectRender(
    runner.program,
    <TypeBoxSchema type={plainTimeProp.type} />,
    'Type.String({\n  format: "time"\n})'
  );
  expectRender(runner.program, <TypeBoxSchema type={utcDateTimeProp.type} />, 'Type.Date()');
  expectRender(runner.program, <TypeBoxSchema type={offsetDateTimeProp.type} />, 'Type.Date()');
});

it('works with dates and encodings', async () => {
  const runner = await createTestRunner();
  const {
    int32Date,
    int64Date,
    rfc3339DateUtc,
    rfc3339DateOffset,
    rfc7231DateUtc,
    rfc7231DateOffset,
  } = await runner.compile(`
      @test
      @encode(DateTimeKnownEncoding.unixTimestamp, int32)
      scalar int32Date extends utcDateTime;

      @test
      @encode(DateTimeKnownEncoding.unixTimestamp, int64)
      scalar int64Date extends utcDateTime;

      @test
      @encode(DateTimeKnownEncoding.rfc3339)
      scalar rfc3339DateUtc extends utcDateTime;

      @test
      @encode(DateTimeKnownEncoding.rfc3339)
      scalar rfc3339DateOffset extends offsetDateTime;

      @test
      @encode(DateTimeKnownEncoding.rfc7231)
      scalar rfc7231DateUtc extends utcDateTime;

      @test
      @encode(DateTimeKnownEncoding.rfc7231)
      scalar rfc7231DateOffset extends offsetDateTime;
    `);

  expectRender(runner.program, <TypeBoxSchema type={int32Date} />, 'Type.Integer()');
  expectRender(runner.program, <TypeBoxSchema type={int64Date} />, 'Type.BigInt()');
  expectRender(
    runner.program,
    <TypeBoxSchema type={rfc3339DateUtc} />,
    'Type.String({\n  format: "date-time"\n})'
  );
  expectRender(
    runner.program,
    <TypeBoxSchema type={rfc3339DateOffset} />,
    'Type.String({\n  format: "date-time"\n})'
  );
  expectRender(runner.program, <TypeBoxSchema type={rfc7231DateUtc} />, 'Type.String()');
  expectRender(runner.program, <TypeBoxSchema type={rfc7231DateOffset} />, 'Type.String()');
});

it('works with durations and encodings', async () => {
  const runner = await createTestRunner();
  const { myDuration, isoDuration, secondsDuration, int64SecondsDuration } = await runner.compile(`
      @test
      @encode(DurationKnownEncoding.ISO8601)
      scalar isoDuration extends duration;

      @test
      @encode(DurationKnownEncoding.seconds, int32)
      scalar secondsDuration extends duration;

      @test
      @encode(DurationKnownEncoding.seconds, int64)
      scalar int64SecondsDuration extends duration;

      @test
      scalar myDuration extends duration;
    `);

  expectRender(
    runner.program,
    <TypeBoxSchema type={myDuration} />,
    'Type.String({\n  format: "duration"\n})'
  );
  expectRender(
    runner.program,
    <TypeBoxSchema type={isoDuration} />,
    'Type.String({\n  format: "duration"\n})'
  );
  expectRender(runner.program, <TypeBoxSchema type={secondsDuration} />, 'Type.Integer()');
  expectRender(runner.program, <TypeBoxSchema type={int64SecondsDuration} />, 'Type.BigInt()');
});

it('works with unknown scalars', async () => {
  const runner = await createTestRunner();
  const { unknownScalar } = (await runner.compile(`
      @test scalar unknownScalar;
    `)) as Record<string, ModelProperty>;

  expectRender(runner.program, <TypeBoxSchema type={unknownScalar} />, 'Type.Any()');
});
