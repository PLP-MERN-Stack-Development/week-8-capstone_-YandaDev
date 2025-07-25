export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },
  extensionsToTreatAsEsm: ['.js', '.mjs'],
  testMatch: [
    '**/?(*.)+(spec|test).[jt]s?(x)',
    '**/?(*.)+(spec|test).mjs'
  ],
  moduleNameMapper: {
    '^(\.{1,2}/.*)\\.[jt]s$': '$1',
    '^(\.{1,2}/.*)\\.mjs$': '$1',
  },
  verbose: true,
};
