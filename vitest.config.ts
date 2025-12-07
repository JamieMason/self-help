import { defineConfig } from "vitest/config";

export default defineConfig({
				test: {
								include: ["src/**/*.spec.ts"],
								coverage: {
												enabled: true,
												include: ["src/**/*.ts"],
												exclude: ["src/**/typings.ts", "src/**/bin*.ts"],
												reporter: ["html", "lcov"],
												thresholds: {
																autoUpdate: true,
																branches: 68.96,
																functions: 73.38,
																lines: 68.83,
																statements: 68.88,
												},
								},
				},
});