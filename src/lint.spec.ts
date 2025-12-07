import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { lint } from "./lint.js";

const TEST_DIR = join(process.cwd(), ".test-lint");

const createTestFile = (relativePath: string, content: string) => {
	const fullPath = join(TEST_DIR, relativePath);
	const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
	writeFileSync(fullPath, content, "utf8");
};

describe("lint", () => {
	beforeEach(() => {
		if (existsSync(TEST_DIR)) {
			rmSync(TEST_DIR, { recursive: true });
		}
		mkdirSync(TEST_DIR, { recursive: true });
	});

	afterEach(() => {
		if (existsSync(TEST_DIR)) {
			rmSync(TEST_DIR, { recursive: true });
		}
	});

	describe("valid structures", () => {
		it("returns success for valid single-level structure", () => {
			createTestFile(
				"README.md",
				`# Root

- [Leaf One](./leaf.md)
`,
			);
			createTestFile("leaf.md", "Leaf content");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("returns success for nested branch structure", () => {
			createTestFile(
				"README.md",
				`# Root

- [Branch](./branch/)
`,
			);
			createTestFile(
				"branch/README.md",
				`# Branch

- [Leaf](./leaf.md)
`,
			);
			createTestFile("branch/leaf.md", "Nested leaf");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("returns success for deeply nested structure", () => {
			createTestFile(
				"README.md",
				`# Level 0

- [Level 1](./level1/)
`,
			);
			createTestFile(
				"level1/README.md",
				`# Level 1

- [Level 2](./level2/)
`,
			);
			createTestFile(
				"level1/level2/README.md",
				`# Level 2

- [Deep Leaf](./deep.md)
`,
			);
			createTestFile("level1/level2/deep.md", "Deep content");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("returns success for mixed branches and leaves", () => {
			createTestFile(
				"README.md",
				`# Root

- [Branch](./branch/)
- [Leaf](./leaf.md)
`,
			);
			createTestFile(
				"branch/README.md",
				`# Branch

- [Nested](./nested.md)
`,
			);
			createTestFile("branch/nested.md", "Nested");
			createTestFile("leaf.md", "Leaf");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});

	describe("missing root", () => {
		it("returns error when README.md not found", () => {
			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].message).toContain("not found");
		});
	});

	describe("invalid index files", () => {
		it("returns error when README.md has no H1", () => {
			createTestFile(
				"README.md",
				`## Not H1

- [Child](./child.md)
`,
			);
			createTestFile("child.md", "Content");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(result.errors.some((e) => e.message.includes("H1"))).toBe(true);
		});

		it("returns error when README.md has no links", () => {
			createTestFile(
				"README.md",
				`# Root

No links here.
`,
			);

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(result.errors.some((e) => e.message.includes("link"))).toBe(true);
		});
	});

	describe("broken links", () => {
		it("returns error for missing leaf file", () => {
			createTestFile(
				"README.md",
				`# Root

- [Missing](./missing.md)
`,
			);

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].message).toContain("not found");
			expect(result.errors[0].message).toContain("missing.md");
		});

		it("returns error for missing branch folder", () => {
			createTestFile(
				"README.md",
				`# Root

- [Missing Branch](./missing/)
`,
			);

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].message).toContain("not found");
		});

		it("returns error for branch folder without README.md", () => {
			createTestFile(
				"README.md",
				`# Root

- [Branch](./branch/)
`,
			);
			mkdirSync(join(TEST_DIR, "branch"), { recursive: true });

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].message).toContain("not found");
		});
	});

	describe("nested errors", () => {
		it("collects errors from nested branches", () => {
			createTestFile(
				"README.md",
				`# Root

- [Branch](./branch/)
`,
			);
			createTestFile(
				"branch/README.md",
				`# Branch

- [Missing](./missing.md)
`,
			);

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].path).toContain("branch/README.md");
		});

		it("collects multiple errors across tree", () => {
			createTestFile(
				"README.md",
				`# Root

- [Branch 1](./branch1/)
- [Branch 2](./branch2/)
`,
			);
			createTestFile(
				"branch1/README.md",
				`# Branch 1

- [Missing 1](./missing1.md)
`,
			);
			createTestFile(
				"branch2/README.md",
				`# Branch 2

- [Missing 2](./missing2.md)
`,
			);

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(2);
		});

		it("continues checking after finding errors", () => {
			createTestFile(
				"README.md",
				`# Root

- [Missing](./missing.md)
- [Valid](./valid.md)
- [Also Missing](./also-missing.md)
`,
			);
			createTestFile("valid.md", "Valid content");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(2);
		});
	});

	describe("link resolution variants", () => {
		it("handles folder links with trailing slash", () => {
			createTestFile(
				"README.md",
				`# Root

- [Branch](./branch/)
`,
			);
			createTestFile(
				"branch/README.md",
				`# Branch

- [Leaf](./leaf.md)
`,
			);
			createTestFile("branch/leaf.md", "Content");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(true);
		});

		it("handles folder links without trailing slash", () => {
			createTestFile(
				"README.md",
				`# Root

- [Branch](./branch)
`,
			);
			createTestFile(
				"branch/README.md",
				`# Branch

- [Leaf](./leaf.md)
`,
			);
			createTestFile("branch/leaf.md", "Content");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(true);
		});

		it("handles explicit README.md links", () => {
			createTestFile(
				"README.md",
				`# Root

- [Branch](./branch/README.md)
`,
			);
			createTestFile(
				"branch/README.md",
				`# Branch

- [Leaf](./leaf.md)
`,
			);
			createTestFile("branch/leaf.md", "Content");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(true);
		});
	});

	describe("related article links", () => {
		it("returns success for valid Read First links", () => {
			createTestFile(
				"README.md",
				`# Root

- [Main](./main.md)
`,
			);
			createTestFile(
				"main.md",
				`# Main

Content.

## Read First

- [Prereq](./prereq.md)
`,
			);
			createTestFile("prereq.md", "# Prereq\n\nPrereq content.");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("returns success for valid Read Next links", () => {
			createTestFile(
				"README.md",
				`# Root

- [Main](./main.md)
`,
			);
			createTestFile(
				"main.md",
				`# Main

Content.

## Read Next

- [Follow Up](./followup.md)
`,
			);
			createTestFile("followup.md", "# Follow Up\n\nFollow up content.");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("returns error for missing Read First link target", () => {
			createTestFile(
				"README.md",
				`# Root

- [Main](./main.md)
`,
			);
			createTestFile(
				"main.md",
				`# Main

## Read First

- [Missing](./missing.md)
`,
			);

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].message).toContain("Read First");
			expect(result.errors[0].message).toContain("not found");
			expect(result.errors[0].message).toContain("missing.md");
		});

		it("returns error for missing Read Next link target", () => {
			createTestFile(
				"README.md",
				`# Root

- [Main](./main.md)
`,
			);
			createTestFile(
				"main.md",
				`# Main

## Read Next

- [Missing](./missing.md)
`,
			);

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].message).toContain("Read Next");
			expect(result.errors[0].message).toContain("not found");
		});

		it("returns error when Read First links to branch README.md", () => {
			createTestFile(
				"README.md",
				`# Root

- [Main](./main.md)
- [Branch](./branch/)
`,
			);
			createTestFile(
				"main.md",
				`# Main

## Read First

- [Branch](./branch/)
`,
			);
			createTestFile(
				"branch/README.md",
				`# Branch

- [Leaf](./leaf.md)
`,
			);
			createTestFile("branch/leaf.md", "Leaf content");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(
				result.errors.some((e) => e.message.includes("leaves, not branches")),
			).toBe(true);
		});

		it("returns error when Read Next links to branch README.md", () => {
			createTestFile(
				"README.md",
				`# Root

- [Main](./main.md)
- [Branch](./branch/)
`,
			);
			createTestFile(
				"main.md",
				`# Main

## Read Next

- [Branch](./branch/README.md)
`,
			);
			createTestFile(
				"branch/README.md",
				`# Branch

- [Leaf](./leaf.md)
`,
			);
			createTestFile("branch/leaf.md", "Leaf content");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(
				result.errors.some((e) => e.message.includes("leaves, not branches")),
			).toBe(true);
		});

		it("validates relative paths with parent directory", () => {
			createTestFile(
				"README.md",
				`# Root

- [Branch](./branch/)
`,
			);
			createTestFile(
				"branch/README.md",
				`# Branch

- [Main](./main.md)
`,
			);
			createTestFile(
				"branch/main.md",
				`# Main

## Read First

- [Parent Doc](../parent.md)
`,
			);
			createTestFile("parent.md", "# Parent\n\nParent content.");

			const result = lint(TEST_DIR);

			expect(result.success).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("collects multiple related link errors", () => {
			createTestFile(
				"README.md",
				`# Root

- [Main](./main.md)
`,
			);
			createTestFile(
				"main.md",
				`# Main

## Read First

- [Missing 1](./missing1.md)
- [Missing 2](./missing2.md)

## Read Next

- [Missing 3](./missing3.md)
`,
			);

			const result = lint(TEST_DIR);

			expect(result.success).toBe(false);
			expect(result.errors).toHaveLength(3);
		});
	});

	describe("test-wiki integration", () => {
		it("validates actual test-wiki structure", () => {
			const testWikiPath = join(process.cwd(), "test-wiki");
			if (!existsSync(testWikiPath)) {
				return; // Skip if test-wiki doesn't exist
			}

			const result = lint(testWikiPath);

			expect(result.success).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});
});
