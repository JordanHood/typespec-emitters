import { createPackage } from '@alloy-js/typescript';

export const typebox = createPackage({
  name: 'typebox',
  version: '^1.0.0',
  descriptor: {
    '.': {
      named: ['Type', 'Static'],
    },
  },
});
