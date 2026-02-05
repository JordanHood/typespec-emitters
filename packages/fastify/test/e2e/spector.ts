import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '../..');

export async function runScenario(
  scenario: string,
  baseUrl: string
): Promise<{ status: 'pass' | 'fail' }> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      [
        'tsp-spector',
        'knock',
        './node_modules/@typespec/http-specs/specs',
        '--filter',
        `${scenario}/**/*`,
        '--baseUrl',
        baseUrl,
      ],
      {
        cwd: packageRoot,
        stdio: 'inherit',
      }
    );

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ status: 'pass' });
      } else {
        resolve({ status: 'fail' });
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}
