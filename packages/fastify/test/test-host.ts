import { Diagnostic, resolvePath } from '@typespec/compiler';
import {
  createTestHost,
  createTestWrapper,
  expectDiagnosticEmpty,
} from '@typespec/compiler/testing';
import { HttpTestLibrary } from '@typespec/http/testing';
import { TypespecFastifyTestLibrary } from '../src/testing/index.js';

export async function createTypespecFastifyTestHost() {
  return createTestHost({
    libraries: [HttpTestLibrary, TypespecFastifyTestLibrary],
  });
}

export async function createTypespecFastifyTestRunner() {
  const host = await createTypespecFastifyTestHost();

  return createTestWrapper(host, {
    compilerOptions: {
      noEmit: false,
      emit: ['@typespec-dev/emitter-fastify'],
    },
  });
}

export async function emitWithDiagnostics(
  code: string
): Promise<[Record<string, string>, readonly Diagnostic[]]> {
  const runner = await createTypespecFastifyTestRunner();
  await runner.compileAndDiagnose(code, {
    outputDir: 'tsp-output',
  });
  const emitterOutputDir = './tsp-output/@typespec-dev/emitter-fastify';

  const result: Record<string, string> = {};

  async function readFilesRecursive(dir: string, relativePath: string = '') {
    const entries = await runner.program.host.readDir(dir);

    for (const entry of entries) {
      const fullPath = resolvePath(dir, entry);
      const relPath = relativePath ? `${relativePath}/${entry}` : entry;

      try {
        const stat = await runner.program.host.stat(fullPath);
        if (stat.isDirectory()) {
          await readFilesRecursive(fullPath, relPath);
        } else if (stat.isFile()) {
          const content = await runner.program.host.readFile(fullPath);
          result[relPath] = content.text;
        }
      } catch (error) {
        if (error) {
          continue;
        }
      }
    }
  }

  await readFilesRecursive(emitterOutputDir);

  return [result, runner.program.diagnostics];
}

export async function emit(code: string): Promise<Record<string, string>> {
  const [result, diagnostics] = await emitWithDiagnostics(code);
  expectDiagnosticEmpty(diagnostics);
  return result;
}
