import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts'],
    coverage: {
      enabled: true,
      include: ['src/**/*.ts'],
      exclude: ['src/**/typings.ts', 'src/**/bin*.ts'],
      reporter: ['html', 'lcov'],
      thresholds: {
        autoUpdate: true,
        branches: 41.93,
        functions: 47.05,
        lines: 29.87,
        statements: 31.14,
      },
    },
  },
});
