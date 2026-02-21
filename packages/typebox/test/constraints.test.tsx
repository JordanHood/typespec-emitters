import { ModelProperty } from '@typespec/compiler';
import { describe, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

describe('string constraints', () => {
  it('applies minLength and maxLength', async () => {
    const runner = await createTestRunner();
    const { nameProp } = (await runner.compile(`
      model Test {
        @test @minLength(1) @maxLength(100) nameProp: string;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={nameProp} />,
      'Type.String({\n  minLength: 1,\n  maxLength: 100\n})'
    );
  });

  it('applies pattern', async () => {
    const runner = await createTestRunner();
    const { codeProp } = (await runner.compile(`
      model Test {
        @test @pattern("^[a-z]+$") codeProp: string;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={codeProp} />,
      'Type.String({\n  pattern: "^[a-z]+$"\n})'
    );
  });

  it('applies format', async () => {
    const runner = await createTestRunner();
    const { emailProp } = (await runner.compile(`
      model Test {
        @test @format("email") emailProp: string;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={emailProp} />,
      'Type.String({\n  format: "email"\n})'
    );
  });

  it('applies minLength only', async () => {
    const runner = await createTestRunner();
    const { tagProp } = (await runner.compile(`
      model Test {
        @test @minLength(1) tagProp: string;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={tagProp} />,
      'Type.String({\n  minLength: 1\n})'
    );
  });
});

describe('numeric constraints', () => {
  it('applies minValue and maxValue', async () => {
    const runner = await createTestRunner();
    const { scoreProp } = (await runner.compile(`
      model Test {
        @test @minValue(0) @maxValue(100) scoreProp: int32;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={scoreProp} />,
      'Type.Integer({\n  minimum: 0,\n  maximum: 100\n})'
    );
  });

  it('applies exclusive bounds', async () => {
    const runner = await createTestRunner();
    const { priceProp } = (await runner.compile(`
      model Test {
        @test @minValueExclusive(0) priceProp: float64;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={priceProp} />,
      'Type.Number({\n  exclusiveMinimum: 0\n})'
    );
  });

  it('applies maxValueExclusive', async () => {
    const runner = await createTestRunner();
    const { rateProp } = (await runner.compile(`
      model Test {
        @test @maxValueExclusive(1) rateProp: float64;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={rateProp} />,
      'Type.Number({\n  exclusiveMaximum: 1\n})'
    );
  });

  it('narrows intrinsic bounds with user constraints', async () => {
    const runner = await createTestRunner();
    const { ageProp } = (await runner.compile(`
      model Test {
        @test @minValue(0) @maxValue(150) ageProp: int32;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={ageProp} />,
      'Type.Integer({\n  minimum: 0,\n  maximum: 150\n})'
    );
  });
});

describe('intrinsic numeric bounds', () => {
  it('applies int8 bounds', async () => {
    const runner = await createTestRunner();
    const { val } = (await runner.compile(`
      model Test {
        @test val: int8;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={val.type} />,
      'Type.Integer({\n  minimum: -128,\n  maximum: 127\n})'
    );
  });

  it('applies uint8 bounds', async () => {
    const runner = await createTestRunner();
    const { val } = (await runner.compile(`
      model Test {
        @test val: uint8;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={val.type} />,
      'Type.Integer({\n  minimum: 0,\n  maximum: 255\n})'
    );
  });

  it('applies int16 bounds', async () => {
    const runner = await createTestRunner();
    const { val } = (await runner.compile(`
      model Test {
        @test val: int16;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={val.type} />,
      'Type.Integer({\n  minimum: -32768,\n  maximum: 32767\n})'
    );
  });

  it('applies uint16 bounds', async () => {
    const runner = await createTestRunner();
    const { val } = (await runner.compile(`
      model Test {
        @test val: uint16;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={val.type} />,
      'Type.Integer({\n  minimum: 0,\n  maximum: 65535\n})'
    );
  });

  it('applies int32 bounds', async () => {
    const runner = await createTestRunner();
    const { val } = (await runner.compile(`
      model Test {
        @test val: int32;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={val.type} />,
      'Type.Integer({\n  minimum: -2147483648,\n  maximum: 2147483647\n})'
    );
  });

  it('applies uint32 bounds', async () => {
    const runner = await createTestRunner();
    const { val } = (await runner.compile(`
      model Test {
        @test val: uint32;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={val.type} />,
      'Type.Integer({\n  minimum: 0,\n  maximum: 4294967295\n})'
    );
  });

  it('applies safeint bounds', async () => {
    const runner = await createTestRunner();
    const { val } = (await runner.compile(`
      model Test {
        @test val: safeint;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={val.type} />,
      'Type.Integer({\n  minimum: -9007199254740991,\n  maximum: 9007199254740991\n})'
    );
  });

  it('applies float32 bounds', async () => {
    const runner = await createTestRunner();
    const { val } = (await runner.compile(`
      model Test {
        @test val: float32;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={val.type} />,
      'Type.Number({\n  minimum: -3.4028235e+38,\n  maximum: 3.4028235e+38\n})'
    );
  });

  it('does not apply bounds to float64', async () => {
    const runner = await createTestRunner();
    const { val } = (await runner.compile(`
      model Test {
        @test val: float64;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(runner.program, <TypeBoxSchema type={val.type} />, 'Type.Number()');
  });
});

describe('array constraints', () => {
  it('applies minItems and maxItems', async () => {
    const runner = await createTestRunner();
    const { itemsProp } = (await runner.compile(`
      model Test {
        @test @minItems(1) @maxItems(10) itemsProp: string[];
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={itemsProp} />,
      'Type.Array(\n  Type.String(),\n  {\n    minItems: 1,\n    maxItems: 10\n  }\n)'
    );
  });

  it('applies minItems only', async () => {
    const runner = await createTestRunner();
    const { tagsProp } = (await runner.compile(`
      model Test {
        @test @minItems(1) tagsProp: string[];
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={tagsProp} />,
      'Type.Array(\n  Type.String(),\n  {\n    minItems: 1\n  }\n)'
    );
  });
});

describe('description', () => {
  it('applies @doc to string property', async () => {
    const runner = await createTestRunner();
    const { nameProp } = (await runner.compile(`
      model Test {
        @test @doc("A person's name") nameProp: string;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={nameProp} />,
      'Type.String({\n  description: "A person\'s name"\n})'
    );
  });

  it('applies @doc to numeric property', async () => {
    const runner = await createTestRunner();
    const { ageProp } = (await runner.compile(`
      model Test {
        @test @doc("Age in years") ageProp: float64;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={ageProp} />,
      'Type.Number({\n  description: "Age in years"\n})'
    );
  });
});

describe('defaults', () => {
  it('applies string default', async () => {
    const runner = await createTestRunner();
    const { greetingProp } = (await runner.compile(`
      model Test {
        @test greetingProp?: string = "hello";
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={greetingProp} />,
      'Type.String({\n  default: "hello"\n})'
    );
  });

  it('applies numeric default', async () => {
    const runner = await createTestRunner();
    const { limitProp } = (await runner.compile(`
      model Test {
        @test limitProp?: float64 = 10;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={limitProp} />,
      'Type.Number({\n  default: 10\n})'
    );
  });

  it('applies boolean default', async () => {
    const runner = await createTestRunner();
    const { activeProp } = (await runner.compile(`
      model Test {
        @test activeProp?: boolean = true;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={activeProp} />,
      'Type.Boolean({\n  default: true\n})'
    );
  });
});

describe('combined constraints', () => {
  it('combines string constraints with description', async () => {
    const runner = await createTestRunner();
    const { nameProp } = (await runner.compile(`
      model Test {
        @test @minLength(1) @maxLength(50) @doc("User name") nameProp: string;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={nameProp} />,
      'Type.String({\n  minLength: 1,\n  maxLength: 50,\n  description: "User name"\n})'
    );
  });

  it('combines numeric constraints with default', async () => {
    const runner = await createTestRunner();
    const { limitProp } = (await runner.compile(`
      model Test {
        @test @minValue(1) @maxValue(100) limitProp?: float64 = 10;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={limitProp} />,
      'Type.Number({\n  minimum: 1,\n  maximum: 100,\n  default: 10\n})'
    );
  });

  it('combines format with description', async () => {
    const runner = await createTestRunner();
    const { emailProp } = (await runner.compile(`
      model Test {
        @test @format("email") @doc("Email address") emailProp: string;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={emailProp} />,
      'Type.String({\n  format: "email",\n  description: "Email address"\n})'
    );
  });
});
