import { ModelProperty } from '@typespec/compiler';
import { it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

it('works with intrinsics', async () => {
  const runner = await createTestRunner();
  const { nullProp, neverProp, unknownProp, voidProp } = (await runner.compile(`
    model Test {
      @test
      nullProp: null,

      @test
      neverProp: never,

      @test
      unknownProp: unknown,

      @test
      voidProp: void,
    }
  `)) as Record<string, ModelProperty>;

  expectRender(runner.program, <TypeBoxSchema type={nullProp.type} />, 'Type.Null()');
  expectRender(runner.program, <TypeBoxSchema type={neverProp.type} />, 'Type.Never()');
  expectRender(runner.program, <TypeBoxSchema type={unknownProp.type} />, 'Type.Unknown()');
  expectRender(runner.program, <TypeBoxSchema type={voidProp.type} />, 'Type.Void()');
});
