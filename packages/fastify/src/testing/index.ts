import {
  createTestLibrary,
  findTestPackageRoot,
  type TypeSpecTestLibrary,
} from '@typespec/compiler/testing';

export const TypespecFastifyTestLibrary: TypeSpecTestLibrary = createTestLibrary({
  name: '@typespec-dev/emitter-fastify',
  packageRoot: await findTestPackageRoot(import.meta.url),
});
