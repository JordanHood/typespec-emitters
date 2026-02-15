import { ModelProperty } from '@typespec/compiler';
import { it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

it('works with literals', async () => {
  const runner = await createTestRunner();
  const { stringProp, numberProp, booleanProp } = (await runner.compile(`
    model Test {
      @test
      stringProp: "hello",

      @test
      numberProp: 123,

      @test
      booleanProp: true,
    }
  `)) as Record<string, ModelProperty>;

  expectRender(runner.program, <TypeBoxSchema type={stringProp.type} />, 'Type.Literal("hello")');
  expectRender(runner.program, <TypeBoxSchema type={numberProp.type} />, 'Type.Literal(123)');
  expectRender(runner.program, <TypeBoxSchema type={booleanProp.type} />, 'Type.Literal(true)');
});
