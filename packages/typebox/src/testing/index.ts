import {
  createTestLibrary,
  findTestPackageRoot,
  type TypeSpecTestLibrary,
} from '@typespec/compiler/testing';

export const TypeSpecTypeBoxTestLibrary: TypeSpecTestLibrary = createTestLibrary({
  name: '@typespec-dev/emitter-typebox',
  packageRoot: await findTestPackageRoot(import.meta.url),
});
