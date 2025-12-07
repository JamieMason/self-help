import { Lexer } from 'marked';
import { describe, expect, it } from 'vitest';
import {
  emptyRelatedArticles,
  extractH1,
  hasRelatedArticles,
  parseLeafContent,
} from './related.js';

describe('extractH1', () => {
  it('extracts H1 heading text', () => {
    const lexer = new Lexer();
    const tokens = lexer.lex('# My Title\n\nSome content');
    expect(extractH1(tokens)).toBe('My Title');
  });

  it('returns null when no H1 exists', () => {
    const lexer = new Lexer();
    const tokens = lexer.lex('## Not an H1\n\nContent');
    expect(extractH1(tokens)).toBeNull();
  });

  it('returns first H1 when multiple exist', () => {
    const lexer = new Lexer();
    const tokens = lexer.lex('# First\n\n# Second');
    expect(extractH1(tokens)).toBe('First');
  });
});

describe('parseLeafContent', () => {
  describe('content extraction', () => {
    it('returns original content when no related sections exist', () => {
      const content = `# Title

Main content here.`;

      const result = parseLeafContent(content);

      expect(result.content).toBe(content);
      expect(result.related.readFirst).toEqual([]);
      expect(result.related.readNext).toEqual([]);
    });

    it('removes Read First section from content', () => {
      const content = `# Title

Main content here.

## Read First

- [Concepts](./concepts.md)`;

      const result = parseLeafContent(content);

      expect(result.content).toBe(`# Title

Main content here.`);
    });

    it('removes Read Next section from content', () => {
      const content = `# Title

Main content here.

## Read Next

- [Next Steps](./next.md)`;

      const result = parseLeafContent(content);

      expect(result.content).toBe(`# Title

Main content here.`);
    });

    it('removes both sections from content', () => {
      const content = `# Title

Main content here.

## Read First

- [Concepts](./concepts.md)

## Read Next

- [Next Steps](./next.md)`;

      const result = parseLeafContent(content);

      expect(result.content).toBe(`# Title

Main content here.`);
    });

    it('preserves other H2 sections', () => {
      const content = `# Title

Main content.

## Examples

Some examples here.

## Read First

- [Concepts](./concepts.md)

## See Also

More info.`;

      const result = parseLeafContent(content);

      expect(result.content).toBe(`# Title

Main content.

## Examples

Some examples here.

## See Also

More info.`);
    });
  });

  describe('Read First extraction', () => {
    it('extracts single link from Read First section', () => {
      const content = `# Title

Content.

## Read First

- [Concepts](./concepts.md)`;

      const result = parseLeafContent(content);

      expect(result.related.readFirst).toEqual([{ label: 'Concepts', href: './concepts.md' }]);
    });

    it('extracts multiple links preserving order', () => {
      const content = `# Title

Content.

## Read First

- [First](./first.md)
- [Second](./second.md)
- [Third](./third.md)`;

      const result = parseLeafContent(content);

      expect(result.related.readFirst).toHaveLength(3);
      expect(result.related.readFirst[0].label).toBe('First');
      expect(result.related.readFirst[1].label).toBe('Second');
      expect(result.related.readFirst[2].label).toBe('Third');
    });

    it('handles relative paths with parent directory', () => {
      const content = `# Title

## Read First

- [Parent Doc](../parent/doc.md)`;

      const result = parseLeafContent(content);

      expect(result.related.readFirst[0].href).toBe('../parent/doc.md');
    });
  });

  describe('Read Next extraction', () => {
    it('extracts single link from Read Next section', () => {
      const content = `# Title

Content.

## Read Next

- [Next Steps](./next.md)`;

      const result = parseLeafContent(content);

      expect(result.related.readNext).toEqual([{ label: 'Next Steps', href: './next.md' }]);
    });

    it('extracts multiple links preserving order', () => {
      const content = `# Title

Content.

## Read Next

- [Follow Up](./follow-up.md)
- [Advanced](./advanced.md)`;

      const result = parseLeafContent(content);

      expect(result.related.readNext).toHaveLength(2);
      expect(result.related.readNext[0].label).toBe('Follow Up');
      expect(result.related.readNext[1].label).toBe('Advanced');
    });
  });

  describe('combined extraction', () => {
    it('extracts both Read First and Read Next', () => {
      const content = `# How to add a CLI command

Main content here.

## Read First

- [Core concepts](../get-started/core-concepts.md)
- [Before you code](../get-started/before-you-code.md)

## Read Next

- [Write tests](../write-tests/state-machine-tests.md)`;

      const result = parseLeafContent(content);

      expect(result.related.readFirst).toHaveLength(2);
      expect(result.related.readFirst[0].label).toBe('Core concepts');
      expect(result.related.readFirst[1].label).toBe('Before you code');

      expect(result.related.readNext).toHaveLength(1);
      expect(result.related.readNext[0].label).toBe('Write tests');
    });
  });

  describe('case insensitivity', () => {
    it('handles "read first" lowercase', () => {
      const content = `# Title

## read first

- [Doc](./doc.md)`;

      const result = parseLeafContent(content);

      expect(result.related.readFirst).toHaveLength(1);
    });

    it('handles "READ FIRST" uppercase', () => {
      const content = `# Title

## READ FIRST

- [Doc](./doc.md)`;

      const result = parseLeafContent(content);

      expect(result.related.readFirst).toHaveLength(1);
    });

    it('handles "Read Next" mixed case', () => {
      const content = `# Title

## Read next

- [Doc](./doc.md)`;

      const result = parseLeafContent(content);

      expect(result.related.readNext).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('handles empty Read First section', () => {
      const content = `# Title

## Read First

## Other Section`;

      const result = parseLeafContent(content);

      expect(result.related.readFirst).toEqual([]);
    });

    it('handles Read First with no list', () => {
      const content = `# Title

## Read First

Just some text, no links.`;

      const result = parseLeafContent(content);

      expect(result.related.readFirst).toEqual([]);
    });

    it('handles empty content', () => {
      const result = parseLeafContent('');

      expect(result.content).toBe('');
      expect(result.related.readFirst).toEqual([]);
      expect(result.related.readNext).toEqual([]);
    });

    it('ignores links outside of lists', () => {
      const content = `# Title

## Read First

Check out [this inline link](./inline.md) in text.

- [Valid](./valid.md)`;

      const result = parseLeafContent(content);

      expect(result.related.readFirst).toHaveLength(1);
      expect(result.related.readFirst[0].label).toBe('Valid');
    });

    it('handles ordered lists', () => {
      const content = `# Title

## Read First

1. [First](./first.md)
2. [Second](./second.md)`;

      const result = parseLeafContent(content);

      expect(result.related.readFirst).toHaveLength(2);
    });

    it('does not remove section headings inside code blocks', () => {
      const content = `# Title

Main content.

\`\`\`markdown
## Read First

This is inside a code block and should be preserved.

- [Not a real link](./fake.md)
\`\`\`

## Read First

- [Real link](./real.md)`;

      const result = parseLeafContent(content);

      // The code block content should be preserved
      expect(result.content).toContain('## Read First');
      expect(result.content).toContain('This is inside a code block');
      expect(result.content).toContain('[Not a real link](./fake.md)');

      // Only the real link outside the code block should be extracted
      expect(result.related.readFirst).toHaveLength(1);
      expect(result.related.readFirst[0].label).toBe('Real link');
    });

    it('preserves indented code blocks with section headings', () => {
      const content = `# Title

Example:

    ## Read First

    - [Indented link](./indented.md)

## Read First

- [Actual link](./actual.md)`;

      const result = parseLeafContent(content);

      // Indented content should be preserved
      expect(result.content).toContain('## Read First');
      expect(result.content).toContain('[Indented link](./indented.md)');

      // Only the real link should be extracted
      expect(result.related.readFirst).toHaveLength(1);
      expect(result.related.readFirst[0].label).toBe('Actual link');
    });
  });
});

describe('hasRelatedArticles', () => {
  it('returns false when no related articles', () => {
    const parsed = {
      content: 'Content',
      related: { readFirst: [], readNext: [] },
    };

    expect(hasRelatedArticles(parsed)).toBe(false);
  });

  it('returns true when has readFirst', () => {
    const parsed = {
      content: 'Content',
      related: {
        readFirst: [{ label: 'Doc', href: './doc.md' }],
        readNext: [],
      },
    };

    expect(hasRelatedArticles(parsed)).toBe(true);
  });

  it('returns true when has readNext', () => {
    const parsed = {
      content: 'Content',
      related: {
        readFirst: [],
        readNext: [{ label: 'Doc', href: './doc.md' }],
      },
    };

    expect(hasRelatedArticles(parsed)).toBe(true);
  });

  it('returns true when has both', () => {
    const parsed = {
      content: 'Content',
      related: {
        readFirst: [{ label: 'A', href: './a.md' }],
        readNext: [{ label: 'B', href: './b.md' }],
      },
    };

    expect(hasRelatedArticles(parsed)).toBe(true);
  });
});

describe('emptyRelatedArticles', () => {
  it('has empty readFirst and readNext arrays', () => {
    expect(emptyRelatedArticles.readFirst).toEqual([]);
    expect(emptyRelatedArticles.readNext).toEqual([]);
  });
});
