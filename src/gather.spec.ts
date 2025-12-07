import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  formatArticlesForCli,
  formatArticlesForMarkdown,
  gatherRelatedArticles,
} from './gather.js';

const TEST_DIR = join(process.cwd(), '.test-gather');

const createTestFile = (relativePath: string, content: string) => {
  const fullPath = join(TEST_DIR, relativePath);
  const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(fullPath, content, 'utf8');
};

describe('gatherRelatedArticles', () => {
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

  describe('single article without related', () => {
    it('returns single article when no related sections', async () => {
      createTestFile(
        'article.md',
        `# My Article

This is the content.`,
      );

      const result = await gatherRelatedArticles(join(TEST_DIR, 'article.md'), 'My Article');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('My Article');
      expect(result[0].isMain).toBe(true);
      expect(result[0].content).toContain('This is the content.');
    });

    it('uses H1 as title when available', async () => {
      createTestFile(
        'article.md',
        `# Title from H1

Content here.`,
      );

      const result = await gatherRelatedArticles(join(TEST_DIR, 'article.md'), 'Fallback Label');

      expect(result[0].title).toBe('Title from H1');
    });

    it('uses label as title when no H1', async () => {
      createTestFile('article.md', 'Content without heading.');

      const result = await gatherRelatedArticles(join(TEST_DIR, 'article.md'), 'Fallback Label');

      expect(result[0].title).toBe('Fallback Label');
    });
  });

  describe('Read First gathering', () => {
    it('gathers Read First articles before main', async () => {
      createTestFile(
        'main.md',
        `# Main Article

Main content.

## Read First

- [Prerequisite](./prereq.md)`,
      );
      createTestFile(
        'prereq.md',
        `# Prerequisite

Read this first.`,
      );

      const result = await gatherRelatedArticles(join(TEST_DIR, 'main.md'), 'Main Article');

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Prerequisite');
      expect(result[0].isMain).toBe(false);
      expect(result[1].title).toBe('Main Article');
      expect(result[1].isMain).toBe(true);
    });

    it('gathers multiple Read First articles in order', async () => {
      createTestFile(
        'main.md',
        `# Main

## Read First

- [First](./first.md)
- [Second](./second.md)`,
      );
      createTestFile('first.md', '# First\n\nFirst content.');
      createTestFile('second.md', '# Second\n\nSecond content.');

      const result = await gatherRelatedArticles(join(TEST_DIR, 'main.md'), 'Main');

      expect(result).toHaveLength(3);
      expect(result[0].title).toBe('First');
      expect(result[1].title).toBe('Second');
      expect(result[2].title).toBe('Main');
    });
  });

  describe('Read Next gathering', () => {
    it('gathers Read Next articles after main', async () => {
      createTestFile(
        'main.md',
        `# Main Article

Main content.

## Read Next

- [Follow Up](./followup.md)`,
      );
      createTestFile(
        'followup.md',
        `# Follow Up

Continue here.`,
      );

      const result = await gatherRelatedArticles(join(TEST_DIR, 'main.md'), 'Main Article');

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Main Article');
      expect(result[0].isMain).toBe(true);
      expect(result[1].title).toBe('Follow Up');
      expect(result[1].isMain).toBe(false);
    });

    it('gathers multiple Read Next articles in order', async () => {
      createTestFile(
        'main.md',
        `# Main

## Read Next

- [Next One](./next1.md)
- [Next Two](./next2.md)`,
      );
      createTestFile('next1.md', '# Next One\n\nContent.');
      createTestFile('next2.md', '# Next Two\n\nContent.');

      const result = await gatherRelatedArticles(join(TEST_DIR, 'main.md'), 'Main');

      expect(result).toHaveLength(3);
      expect(result[0].title).toBe('Main');
      expect(result[1].title).toBe('Next One');
      expect(result[2].title).toBe('Next Two');
    });
  });

  describe('combined Read First and Read Next', () => {
    it('gathers in correct order: Read First → Main → Read Next', async () => {
      createTestFile(
        'main.md',
        `# Main

Content.

## Read First

- [Before](./before.md)

## Read Next

- [After](./after.md)`,
      );
      createTestFile('before.md', '# Before\n\nBefore content.');
      createTestFile('after.md', '# After\n\nAfter content.');

      const result = await gatherRelatedArticles(join(TEST_DIR, 'main.md'), 'Main');

      expect(result).toHaveLength(3);
      expect(result[0].title).toBe('Before');
      expect(result[0].isMain).toBe(false);
      expect(result[1].title).toBe('Main');
      expect(result[1].isMain).toBe(true);
      expect(result[2].title).toBe('After');
      expect(result[2].isMain).toBe(false);
    });
  });

  describe('recursive gathering', () => {
    it('recursively gathers nested Read First articles', async () => {
      createTestFile(
        'main.md',
        `# Main

## Read First

- [Level 1](./level1.md)`,
      );
      createTestFile(
        'level1.md',
        `# Level 1

## Read First

- [Level 2](./level2.md)`,
      );
      createTestFile('level2.md', '# Level 2\n\nDeepest.');

      const result = await gatherRelatedArticles(join(TEST_DIR, 'main.md'), 'Main');

      expect(result).toHaveLength(3);
      expect(result[0].title).toBe('Level 2');
      expect(result[1].title).toBe('Level 1');
      expect(result[2].title).toBe('Main');
    });

    it('recursively gathers nested Read Next articles', async () => {
      createTestFile(
        'main.md',
        `# Main

## Read Next

- [Next 1](./next1.md)`,
      );
      createTestFile(
        'next1.md',
        `# Next 1

## Read Next

- [Next 2](./next2.md)`,
      );
      createTestFile('next2.md', '# Next 2\n\nFinal.');

      const result = await gatherRelatedArticles(join(TEST_DIR, 'main.md'), 'Main');

      expect(result).toHaveLength(3);
      expect(result[0].title).toBe('Main');
      expect(result[1].title).toBe('Next 1');
      expect(result[2].title).toBe('Next 2');
    });
  });

  describe('cycle detection', () => {
    it('prevents infinite loops with circular references', async () => {
      createTestFile(
        'a.md',
        `# Article A

## Read Next

- [Article B](./b.md)`,
      );
      createTestFile(
        'b.md',
        `# Article B

## Read Next

- [Article A](./a.md)`,
      );

      const result = await gatherRelatedArticles(join(TEST_DIR, 'a.md'), 'Article A');

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Article A');
      expect(result[1].title).toBe('Article B');
    });

    it('renders article only once when referenced multiple times', async () => {
      createTestFile(
        'main.md',
        `# Main

## Read First

- [Shared](./shared.md)

## Read Next

- [Other](./other.md)`,
      );
      createTestFile('shared.md', '# Shared\n\nShared content.');
      createTestFile(
        'other.md',
        `# Other

## Read First

- [Shared](./shared.md)`,
      );

      const result = await gatherRelatedArticles(join(TEST_DIR, 'main.md'), 'Main');

      // Shared should appear only once (first occurrence)
      const sharedCount = result.filter((a) => a.title === 'Shared').length;
      expect(sharedCount).toBe(1);
    });

    it('handles self-referencing article', async () => {
      createTestFile(
        'self.md',
        `# Self

## Read First

- [Self](./self.md)`,
      );

      const result = await gatherRelatedArticles(join(TEST_DIR, 'self.md'), 'Self');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Self');
    });
  });

  describe('missing files', () => {
    it('skips missing Read First files gracefully', async () => {
      createTestFile(
        'main.md',
        `# Main

## Read First

- [Missing](./missing.md)
- [Exists](./exists.md)`,
      );
      createTestFile('exists.md', '# Exists\n\nContent.');

      const result = await gatherRelatedArticles(join(TEST_DIR, 'main.md'), 'Main');

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Exists');
      expect(result[1].title).toBe('Main');
    });

    it('skips missing Read Next files gracefully', async () => {
      createTestFile(
        'main.md',
        `# Main

## Read Next

- [Missing](./missing.md)`,
      );

      const result = await gatherRelatedArticles(join(TEST_DIR, 'main.md'), 'Main');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Main');
    });
  });

  describe('relative path resolution', () => {
    it('resolves parent directory paths', async () => {
      createTestFile(
        'subdir/main.md',
        `# Main

## Read First

- [Parent Doc](../parent.md)`,
      );
      createTestFile('parent.md', '# Parent\n\nParent content.');

      const result = await gatherRelatedArticles(join(TEST_DIR, 'subdir/main.md'), 'Main');

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Parent');
      expect(result[1].title).toBe('Main');
    });

    it('resolves nested directory paths', async () => {
      createTestFile(
        'main.md',
        `# Main

## Read First

- [Nested](./subdir/nested.md)`,
      );
      createTestFile('subdir/nested.md', '# Nested\n\nNested content.');

      const result = await gatherRelatedArticles(join(TEST_DIR, 'main.md'), 'Main');

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Nested');
      expect(result[1].title).toBe('Main');
    });
  });

  describe('plan example', () => {
    it('matches expected order from plan: D, B, A, C', async () => {
      // Article A → Read First: B, Read Next: C
      // Article B → Read First: D
      // Article C → Read Next: A (circular)
      // Article D (no related)
      // Expected gather order for A: D, B, A, C

      createTestFile(
        'a.md',
        `# A

## Read First

- [B](./b.md)

## Read Next

- [C](./c.md)`,
      );
      createTestFile(
        'b.md',
        `# B

## Read First

- [D](./d.md)`,
      );
      createTestFile(
        'c.md',
        `# C

## Read Next

- [A](./a.md)`,
      );
      createTestFile('d.md', '# D\n\nNo related articles.');

      const result = await gatherRelatedArticles(join(TEST_DIR, 'a.md'), 'A');

      expect(result.map((a) => a.title)).toEqual(['D', 'B', 'A', 'C']);
      expect(result.find((a) => a.title === 'A')?.isMain).toBe(true);
    });
  });
});

describe('formatArticlesForCli', () => {
  it('formats single article with separator', () => {
    const articles = [
      {
        title: 'My Article',
        content: '# My Article\n\nContent here.',
        isMain: true,
        path: '/path/to/article.md',
      },
    ];

    const result = formatArticlesForCli(articles);

    expect(result).toContain('━');
    expect(result).toContain('📖 My Article (main)');
    expect(result).toContain('Content here.');
  });

  it('formats multiple articles with separators', () => {
    const articles = [
      {
        title: 'First',
        content: 'First content.',
        isMain: false,
        path: '/path/to/first.md',
      },
      {
        title: 'Main',
        content: 'Main content.',
        isMain: true,
        path: '/path/to/main.md',
      },
      {
        title: 'Last',
        content: 'Last content.',
        isMain: false,
        path: '/path/to/last.md',
      },
    ];

    const result = formatArticlesForCli(articles);

    expect(result).toContain('📖 First');
    expect(result).toContain('📖 Main (main)');
    expect(result).toContain('📖 Last');
    expect(result).not.toContain('📖 First (main)');
    expect(result).not.toContain('📖 Last (main)');
  });
});

describe('formatArticlesForMarkdown', () => {
  it('formats single article without separator', () => {
    const articles = [
      {
        title: 'Article',
        content: '# Article\n\nContent.',
        isMain: true,
        path: '/path/to/article.md',
      },
    ];

    const result = formatArticlesForMarkdown(articles);

    expect(result).toBe('# Article\n\nContent.');
  });

  it('formats multiple articles with horizontal rules', () => {
    const articles = [
      {
        title: 'First',
        content: '# First\n\nFirst content.',
        isMain: false,
        path: '/path/to/first.md',
      },
      {
        title: 'Second',
        content: '# Second\n\nSecond content.',
        isMain: true,
        path: '/path/to/second.md',
      },
    ];

    const result = formatArticlesForMarkdown(articles);

    expect(result).toBe('# First\n\nFirst content.\n\n---\n\n# Second\n\nSecond content.');
  });
});
