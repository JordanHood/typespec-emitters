import { describe, expect, it } from 'vitest';
import { createEmitterTestRunner } from '../utils.jsx';

describe('recursive type emitter output', () => {
  it('emits self-referencing tree node', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      model TreeNode {
        value: string;
        children: TreeNode[];
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });

  it('emits recursive model with non-recursive sibling', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      model Category {
        name: string;
        subcategories: Category[];
      }

      model Product {
        title: string;
        category: Category;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });
});
