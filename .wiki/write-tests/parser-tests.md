# Test the parser

## Read First

- [How it works](../get-started/core-concepts.md)

## Read Next

- [Create test factories](./test-data-factories.md)
- [Markdown not parsing](../fix-an-issue/markdown-not-parsing.md)

**Test `src/build/parser.ts` functions in `src/build/parser.spec.ts`.**

## File locations

- Parser: `src/build/parser.ts`
- Tests: `src/build/parser.spec.ts`
- Types: `src/build/types.ts`

## Key functions to test

```typescript
// Parse README.md content
parseIndexContent(content: string): ParsedIndex

// Extract H1 heading
extractH1(content: string): string | undefined

// Extract ordered list of links
extractLinks(content: string): ParsedLink[]
```

## Test structure

```typescript
import { describe, expect, it } from 'vitest';
import { parseIndexContent, extractH1, extractLinks } from './parser.js';

describe('parseIndexContent', () => {
  it('should extract H1 as label', () => {
    const content = '# My Label\n\n- [Link](./file.md)';
    const result = parseIndexContent(content);
    expect(result.label).toBe('My Label');
  });

  it('should extract links as children', () => {
    const content = '# Label\n\n- [Child](./child.md)';
    const result = parseIndexContent(content);
    expect(result.links).toHaveLength(1);
    expect(result.links[0]).toEqual({ label: 'Child', href: './child.md' });
  });
});
```

## Test cases to cover

### H1 extraction

- ✅ Standard H1: `# Label`
- ✅ H1 with extra whitespace
- ✅ H1 with inline formatting (bold, italics)
- ❌ Missing H1 → error or undefined
- ❌ H2 instead of H1 → not extracted

### Link extraction

- ✅ Single link: `- [Label](./path.md)`
- ✅ Multiple links
- ✅ Folder link: `- [Label](./folder/)`
- ✅ Links preserve order
- ❌ No links → empty array
- ❌ Malformed link syntax

### Edge cases

- Empty content
- Content with only whitespace
- Links with special characters
- Very long labels

## Example test patterns

### Testing H1 extraction

```typescript
describe('extractH1', () => {
  it('should extract plain H1', () => {
    expect(extractH1('# Simple Label')).toBe('Simple Label');
  });

  it('should handle whitespace', () => {
    expect(extractH1('#   Padded Label  ')).toBe('Padded Label');
  });

  it('should return undefined for missing H1', () => {
    expect(extractH1('No heading here')).toBeUndefined();
  });

  it('should not extract H2', () => {
    expect(extractH1('## Not H1')).toBeUndefined();
  });
});
```

### Testing link extraction

```typescript
describe('extractLinks', () => {
  it('should extract markdown links', () => {
    const content = '- [First](./first.md)\n- [Second](./second.md)';
    const links = extractLinks(content);
    expect(links).toEqual([
      { label: 'First', href: './first.md' },
      { label: 'Second', href: './second.md' },
    ]);
  });

  it('should handle folder links', () => {
    const content = '- [Branch](./folder/)';
    const links = extractLinks(content);
    expect(links[0].href).toBe('./folder/');
  });

  it('should return empty array for no links', () => {
    expect(extractLinks('Just text')).toEqual([]);
  });
});
```

## Running tests

```bash
# Run parser tests
pnpm test -- parser.spec

# Watch mode
pnpm test -- parser.spec --watch

# Verbose output
pnpm test -- parser.spec --reporter=verbose
```
