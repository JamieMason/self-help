import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { AsyncBranch, AsyncLeaf } from "../index.js";
import { isAsyncBranch, isAsyncLeaf } from "../machine/tree/nodes.js";
import { createMarkdownSource, MarkdownSourceError } from "./markdown.js";

const TEST_DIR = join(process.cwd(), ".test-markdown-source");

const createTestFile = (relativePath: string, content: string) => {
	const fullPath = join(TEST_DIR, relativePath);
	const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
	writeFileSync(fullPath, content, "utf8");
};

describe("createMarkdownSource", () => {
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

	describe("root node creation", () => {
		it("creates AsyncBranch from directory with README.md", () => {
			createTestFile(
				"README.md",
				`# Root Label

- [Child One](./child.md)
`,
			);
			createTestFile("child.md", "Leaf content");

			const root = createMarkdownSource(TEST_DIR);

			expect(isAsyncBranch(root)).toBe(true);
			expect(root.label).toBe("Root Label");
			expect(typeof root.children).toBe("function");
		});

		it("throws MarkdownSourceError when README.md not found", () => {
			expect(() => createMarkdownSource(TEST_DIR)).toThrow(MarkdownSourceError);
			expect(() => createMarkdownSource(TEST_DIR)).toThrow("not found");
		});

		it("throws MarkdownSourceError when README.md has no H1", () => {
			createTestFile(
				"README.md",
				`## Not an H1

- [Child](./child.md)
`,
			);

			expect(() => createMarkdownSource(TEST_DIR)).toThrow(MarkdownSourceError);
			expect(() => createMarkdownSource(TEST_DIR)).toThrow("H1");
		});

		it("throws MarkdownSourceError when README.md has no links", () => {
			createTestFile(
				"README.md",
				`# Root

No links here.
`,
			);

			expect(() => createMarkdownSource(TEST_DIR)).toThrow(MarkdownSourceError);
			expect(() => createMarkdownSource(TEST_DIR)).toThrow("link");
		});
	});

	describe("children loading", () => {
		it("loads leaf children as AsyncLeaf nodes", async () => {
			createTestFile(
				"README.md",
				`# Root

- [Leaf Child](./leaf.md)
`,
			);
			createTestFile("leaf.md", "Leaf content here");

			const root = createMarkdownSource(TEST_DIR);
			const children = await root.children();

			expect(children).toHaveLength(1);
			expect(isAsyncLeaf(children[0])).toBe(true);
			expect(children[0].label).toBe("Leaf Child");
		});

		it("loads branch children as AsyncBranch nodes", async () => {
			createTestFile(
				"README.md",
				`# Root

- [Branch Child](./branch/)
`,
			);
			createTestFile(
				"branch/README.md",
				`# Branch Label

- [Nested Leaf](./nested.md)
`,
			);
			createTestFile("branch/nested.md", "Nested content");

			const root = createMarkdownSource(TEST_DIR);
			const children = await root.children();

			expect(children).toHaveLength(1);
			expect(isAsyncBranch(children[0])).toBe(true);
			expect(children[0].label).toBe("Branch Child");
		});

		it("preserves child order from links", async () => {
			createTestFile(
				"README.md",
				`# Root

- [First](./first.md)
- [Second](./second.md)
- [Third](./third.md)
`,
			);
			createTestFile("first.md", "First");
			createTestFile("second.md", "Second");
			createTestFile("third.md", "Third");

			const root = createMarkdownSource(TEST_DIR);
			const children = await root.children();

			expect(children.map((c) => c.label)).toEqual([
				"First",
				"Second",
				"Third",
			]);
		});

		it("throws when link target does not exist", async () => {
			createTestFile(
				"README.md",
				`# Root

- [Missing](./missing.md)
`,
			);

			const root = createMarkdownSource(TEST_DIR);

			expect(() => root.children()).toThrow(MarkdownSourceError);
			expect(() => root.children()).toThrow("not found");
		});
	});

	describe("lazy leaf value loading", () => {
		it("reads leaf content lazily via value()", async () => {
			createTestFile(
				"README.md",
				`# Root

- [My Leaf](./leaf.md)
`,
			);
			createTestFile("leaf.md", "This is the leaf content");

			const root = createMarkdownSource(TEST_DIR);
			const children = await root.children();
			const leaf = children[0] as AsyncLeaf;

			expect(typeof leaf.value).toBe("function");

			const content = await leaf.value();
			expect(content).toBe("This is the leaf content");
		});

		it("re-reads leaf content each time value() is called", async () => {
			createTestFile(
				"README.md",
				`# Root

- [Leaf](./leaf.md)
`,
			);
			createTestFile("leaf.md", "Original content");

			const root = createMarkdownSource(TEST_DIR);
			const children = await root.children();
			const leaf = children[0] as AsyncLeaf;

			expect(await leaf.value()).toBe("Original content");

			// Modify the file
			createTestFile("leaf.md", "Updated content");

			expect(await leaf.value()).toBe("Updated content");
		});

		it("throws when leaf file is deleted before value() call", async () => {
			createTestFile(
				"README.md",
				`# Root

- [Leaf](./leaf.md)
`,
			);
			createTestFile("leaf.md", "Content");

			const root = createMarkdownSource(TEST_DIR);
			const children = await root.children();
			const leaf = children[0] as AsyncLeaf;

			// Delete the leaf file
			rmSync(join(TEST_DIR, "leaf.md"));

			await expect(leaf.value()).rejects.toThrow(MarkdownSourceError);
		});
	});

	describe("nested navigation", () => {
		it("navigates multiple levels deep", async () => {
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

			const root = createMarkdownSource(TEST_DIR);
			const level1Children = await root.children();
			const level1 = level1Children[0] as AsyncBranch;

			const level2Children = await level1.children();
			const level2 = level2Children[0] as AsyncBranch;

			const level3Children = await level2.children();
			const leaf = level3Children[0] as AsyncLeaf;

			expect(leaf.label).toBe("Deep Leaf");
			expect(await leaf.value()).toBe("Deep content");
		});

		it("re-reads branch children each time children() is called", async () => {
			createTestFile(
				"README.md",
				`# Root

- [Child](./child.md)
`,
			);
			createTestFile("child.md", "Original");

			const root = createMarkdownSource(TEST_DIR);

			const children1 = await root.children();
			expect(children1).toHaveLength(1);
			expect(children1[0].label).toBe("Child");

			// Add a new child
			createTestFile(
				"README.md",
				`# Root

- [Child](./child.md)
- [New Child](./new.md)
`,
			);
			createTestFile("new.md", "New content");

			const children2 = await root.children();
			expect(children2).toHaveLength(2);
			expect(children2[1].label).toBe("New Child");
		});
	});

	describe("link resolution", () => {
		it("resolves folder links with trailing slash", async () => {
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

			const root = createMarkdownSource(TEST_DIR);
			const children = await root.children();

			expect(isAsyncBranch(children[0])).toBe(true);
		});

		it("resolves folder links without trailing slash", async () => {
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

			const root = createMarkdownSource(TEST_DIR);
			const children = await root.children();

			expect(isAsyncBranch(children[0])).toBe(true);
		});

		it("resolves explicit README.md links", async () => {
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

			const root = createMarkdownSource(TEST_DIR);
			const children = await root.children();

			expect(isAsyncBranch(children[0])).toBe(true);
			expect(children[0].label).toBe("Branch");
		});
	});

	describe("test-wiki integration", () => {
		it("works with actual test-wiki structure", () => {
			// This test uses the real test-wiki if it exists
			const testWikiPath = join(process.cwd(), "test-wiki");
			if (!existsSync(testWikiPath)) {
				return; // Skip if test-wiki doesn't exist
			}

			const root = createMarkdownSource(testWikiPath);

			expect(root.label).toBe("How can we help?");
			expect(typeof root.children).toBe("function");
		});
	});
});
