// jest.config.js
export default {
    testEnvironment: 'node',
    moduleFileExtensions: ['js'],
    transform: {"\\.[jt]sx?$": ["babel-jest", { "excludeJestPreset": true }],},
    moduleNameMapper: {},
    collectCoverage: true,
    coverageDirectory: 'coverage',
  };
