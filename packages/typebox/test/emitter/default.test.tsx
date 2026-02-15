import { expect, it } from 'vitest';
import { createEmitterTestRunner } from '../utils.jsx';

it('emits scalar declarations', async () => {
  const runner = await createEmitterTestRunner();
  await runner.compile(`
    scalar MyScalar extends string;
  `);

  const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');

  expect(text.trim()).toMatchSnapshot();
});
