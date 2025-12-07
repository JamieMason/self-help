import { describe, expect, it } from "vitest";

import { parseIndexContent, validateParsedIndex } from "./parser.js";

describe("parseIndexContent", () => {
	describe("H1 extraction", () => {
		it("extracts H1 heading as label", () => {
			const content = `# My Branch

- [Child 1](./child1.md)
`;
			const { result, errors } = parseIndexContent(content);
			expect(errors).toHaveLength(0);
			expect(result?.label).toBe("My Branch");
		});

		it("uses first H1 when multiple headings exist", () => {
			const content = `# First Heading

Some text

## Second Heading

- [Child](./child.md)

# Another H1
`;
			const { result, errors } = parseIndexContent(content);
			expect(errors).toHaveLength(0);
			expect(result?.label).toBe("First Heading");
		});

		it("returns error when no H1 exists", () => {
			const content = `## Not an H1

- [Child](./child.md)
`;
			const { result, errors } = parseIndexContent(content);
			expect(result).toBeNull();
			expect(errors).toHaveLength(1);
			expect(errors[0].message).toContain("H1 heading");
		});

		it("returns error for empty content", () => {
			const { result, errors } = parseIndexContent("");
			expect(result).toBeNull();
			expect(errors.length).toBeGreaterThan(0);
		});
	});

	describe("link extraction", () => {
		it("extracts single link from unordered list", () => {
			const content = `# Branch

- [Child One](./child-one.md)
`;
			const { result, errors } = parseIndexContent(content);
			expect(errors).toHaveLength(0);
			expect(result?.children).toHaveLength(1);
			expect(result?.children[0]).toEqual({
				label: "Child One",
				href: "./child-one.md",
			});
		});

		it("extracts multiple links preserving order", () => {
			const content = `# Branch

- [First](./first.md)
- [Second](./second/)
- [Third](./third.md)
`;
			const { result, errors } = parseIndexContent(content);
			expect(errors).toHaveLength(0);
			expect(result?.children).toHaveLength(3);
			expect(result?.children.map((c) => c.label)).toEqual([
				"First",
				"Second",
				"Third",
			]);
		});

		it("extracts links from ordered list", () => {
			const content = `# Branch

1. [First](./first.md)
2. [Second](./second.md)
`;
			const { result, errors } = parseIndexContent(content);
			expect(errors).toHaveLength(0);
			expect(result?.children).toHaveLength(2);
		});

		it("handles links to folders with trailing slash", () => {
			const content = `# Branch

- [Sub Branch](./sub-branch/)
`;
			const { result, errors } = parseIndexContent(content);
			expect(errors).toHaveLength(0);
			expect(result?.children[0].href).toBe("./sub-branch/");
		});

		it("handles links to explicit README.md", () => {
			const content = `# Branch

- [Sub Branch](./sub-branch/README.md)
`;
			const { result, errors } = parseIndexContent(content);
			expect(errors).toHaveLength(0);
			expect(result?.children[0].href).toBe("./sub-branch/README.md");
		});

		it("returns error when no links exist", () => {
			const content = `# Branch

Just some text without links.
`;
			const { result, errors } = parseIndexContent(content);
			expect(result).toBeNull();
			expect(errors.some((e) => e.message.includes("link"))).toBe(true);
		});

		it("ignores links outside of lists", () => {
			const content = `# Branch

Check out [this link](https://example.com) in paragraph.

- [Valid Child](./child.md)
`;
			const { result, errors } = parseIndexContent(content);
			expect(errors).toHaveLength(0);
			expect(result?.children).toHaveLength(1);
			expect(result?.children[0].label).toBe("Valid Child");
		});
	});

	describe("complex markdown", () => {
		it("handles H1 with inline formatting", () => {
			const content = `# Branch with **bold** and *italic*

- [Child](./child.md)
`;
			const { result, errors } = parseIndexContent(content);
			expect(errors).toHaveLength(0);
			expect(result?.label).toBe("Branch with **bold** and *italic*");
		});

		it("handles link text with inline formatting", () => {
			const content = `# Branch

- [Child with \`code\`](./child.md)
`;
			const { result, errors } = parseIndexContent(content);
			expect(errors).toHaveLength(0);
			expect(result?.children[0].label).toContain("code");
		});

		it("handles real-world example from test-wiki", () => {
			const content = `# How can we help?

- [I have one existing Observable, and](./i-have-one-existing-observable-and/)
- [I have some Observables to combine together as one Observable, and](./i-have-some-observables-to-combine-together-as-one/)
- [I have no Observables yet, and](./i-have-no-observables-yet-and/)
`;
			const { result, errors } = parseIndexContent(content);
			expect(errors).toHaveLength(0);
			expect(result?.label).toBe("How can we help?");
			expect(result?.children).toHaveLength(3);
			expect(result?.children[0]).toEqual({
				label: "I have one existing Observable, and",
				href: "./i-have-one-existing-observable-and/",
			});
		});
	});
});

describe("validateParsedIndex", () => {
	it("returns no errors for valid parsed index", () => {
		const parsed = {
			label: "My Branch",
			children: [{ label: "Child", href: "./child.md" }],
		};
		const errors = validateParsedIndex(parsed, "/path/to/README.md");
		expect(errors).toHaveLength(0);
	});

	it("returns error for empty label", () => {
		const parsed = {
			label: "   ",
			children: [{ label: "Child", href: "./child.md" }],
		};
		const errors = validateParsedIndex(parsed, "/path/to/README.md");
		expect(errors).toHaveLength(1);
		expect(errors[0].message).toContain("empty");
		expect(errors[0].path).toBe("/path/to/README.md");
	});

	it("returns error for empty children array", () => {
		const parsed = {
			label: "Branch",
			children: [],
		};
		const errors = validateParsedIndex(parsed, "/path/to/README.md");
		expect(errors).toHaveLength(1);
		expect(errors[0].message).toContain("child");
	});

	it("returns error for child with empty label", () => {
		const parsed = {
			label: "Branch",
			children: [{ label: "", href: "./child.md" }],
		};
		const errors = validateParsedIndex(parsed, "/path/to/README.md");
		expect(errors).toHaveLength(1);
		expect(errors[0].message).toContain("empty label");
	});

	it("returns error for child with empty href", () => {
		const parsed = {
			label: "Branch",
			children: [{ label: "Child", href: "" }],
		};
		const errors = validateParsedIndex(parsed, "/path/to/README.md");
		expect(errors).toHaveLength(1);
		expect(errors[0].message).toContain("empty href");
	});

	it("returns multiple errors when multiple issues exist", () => {
		const parsed = {
			label: "",
			children: [
				{ label: "", href: "./a.md" },
				{ label: "B", href: "" },
			],
		};
		const errors = validateParsedIndex(parsed, "/path/to/README.md");
		expect(errors.length).toBeGreaterThanOrEqual(3);
	});
});
