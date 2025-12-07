module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/typings.ts', '!src/**/bin*.ts'],
  coverageReporters: ['html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['<rootDir>/src/**/*.spec.(ts|tsx|js)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
