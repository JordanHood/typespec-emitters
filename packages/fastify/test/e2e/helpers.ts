import type { FastifyInstance } from 'fastify';
import fastify from 'fastify';

export async function startServer(app: FastifyInstance, signal: AbortSignal): Promise<string> {
  const port = await getAvailablePort();
  await app.listen({ port, host: '127.0.0.1' });

  signal.addEventListener('abort', () => {
    app.close();
  });

  return `http://127.0.0.1:${port}`;
}

async function getAvailablePort(): Promise<number> {
  const testServer = fastify();
  await testServer.listen({ port: 0, host: '127.0.0.1' });
  const address = testServer.server.address();
  const port = address && typeof address === 'object' ? address.port : undefined;
  await testServer.close();
  return port || 3000;
}
