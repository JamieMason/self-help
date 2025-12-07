import { describe, expect, it } from 'vitest';
import { isAsyncBranch, isAsyncLeaf, isBranch, isChildren, isLeaf, isNode } from './nodes.js';

describe('nodes', () => {
  describe('isLeaf', () => {
    it('should return true for a valid leaf node', () => {
      const leaf = { label: 'Test Leaf', value: 'test value' };
      expect(isLeaf(leaf)).toBe(true);
    });

    it('should return false for a branch node', () => {
      const branch = {
        label: 'Test Branch',
        children: [{ label: 'Child', value: 'value' }],
      };
      expect(isLeaf(branch)).toBe(false);
    });

    it('should return false for an async leaf node', () => {
      const asyncLeaf = {
        label: 'Async Leaf',
        value: () => 'async value',
      };
      expect(isLeaf(asyncLeaf)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isLeaf(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isLeaf(undefined)).toBe(false);
    });

    it('should return false for an object without a label', () => {
      expect(isLeaf({ value: 'test' })).toBe(false);
    });

    it('should return false for an object without a value', () => {
      expect(isLeaf({ label: 'test' })).toBe(false);
    });
  });

  describe('isAsyncLeaf', () => {
    it('should return true for a valid async leaf node with sync function', () => {
      const asyncLeaf = {
        label: 'Async Leaf',
        value: () => 'sync value',
      };
      expect(isAsyncLeaf(asyncLeaf)).toBe(true);
    });

    it('should return true for a valid async leaf node with async function', () => {
      const asyncLeaf = {
        label: 'Async Leaf',
        value: () => Promise.resolve('async value'),
      };
      expect(isAsyncLeaf(asyncLeaf)).toBe(true);
    });

    it('should return false for a regular leaf node', () => {
      const leaf = { label: 'Test Leaf', value: 'test value' };
      expect(isAsyncLeaf(leaf)).toBe(false);
    });

    it('should return false for a branch node', () => {
      const branch = {
        label: 'Test Branch',
        children: [{ label: 'Child', value: 'value' }],
      };
      expect(isAsyncLeaf(branch)).toBe(false);
    });

    it('should return false for an async branch node', () => {
      const asyncBranch = {
        label: 'Async Branch',
        children: () => Promise.resolve([{ label: 'Child', value: 'value' }]),
      };
      expect(isAsyncLeaf(asyncBranch)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isAsyncLeaf(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isAsyncLeaf(undefined)).toBe(false);
    });

    it('should return false for an object without a label', () => {
      expect(isAsyncLeaf({ value: () => 'test' })).toBe(false);
    });

    it('should return false for an object without a value', () => {
      expect(isAsyncLeaf({ label: 'test' })).toBe(false);
    });
  });

  describe('isBranch', () => {
    it('should return true for a valid branch node', () => {
      const branch = {
        label: 'Test Branch',
        children: [{ label: 'Child', value: 'value' }],
      };
      expect(isBranch(branch)).toBe(true);
    });

    it('should return false for a leaf node', () => {
      const leaf = { label: 'Test Leaf', value: 'test value' };
      expect(isBranch(leaf)).toBe(false);
    });

    it('should return false for an async leaf node', () => {
      const asyncLeaf = {
        label: 'Async Leaf',
        value: () => 'async value',
      };
      expect(isBranch(asyncLeaf)).toBe(false);
    });

    it('should return false for an async branch', () => {
      const asyncBranch = {
        label: 'Async Branch',
        children: () => Promise.resolve([{ label: 'Child', value: 'value' }]),
      };
      expect(isBranch(asyncBranch)).toBe(false);
    });

    it('should return false for a branch with empty children', () => {
      const emptyBranch = { label: 'Empty Branch', children: [] };
      expect(isBranch(emptyBranch)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isBranch(null)).toBe(false);
    });
  });

  describe('isAsyncBranch', () => {
    it('should return true for a valid async branch node', () => {
      const asyncBranch = {
        label: 'Async Branch',
        children: () => Promise.resolve([{ label: 'Child', value: 'value' }]),
      };
      expect(isAsyncBranch(asyncBranch)).toBe(true);
    });

    it('should return false for a regular branch', () => {
      const branch = {
        label: 'Test Branch',
        children: [{ label: 'Child', value: 'value' }],
      };
      expect(isAsyncBranch(branch)).toBe(false);
    });

    it('should return false for a leaf node', () => {
      const leaf = { label: 'Test Leaf', value: 'test value' };
      expect(isAsyncBranch(leaf)).toBe(false);
    });

    it('should return false for an async leaf node', () => {
      const asyncLeaf = {
        label: 'Async Leaf',
        value: () => 'async value',
      };
      expect(isAsyncBranch(asyncLeaf)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isAsyncBranch(null)).toBe(false);
    });
  });

  describe('isChildren', () => {
    it('should return true for an array of valid nodes', () => {
      const children = [
        { label: 'Leaf', value: 'value' },
        {
          label: 'Branch',
          children: [{ label: 'Nested', value: 'nested value' }],
        },
      ];
      expect(isChildren(children)).toBe(true);
    });

    it('should return true for an array containing async leaf nodes', () => {
      const children = [
        { label: 'Leaf', value: 'value' },
        { label: 'Async Leaf', value: () => 'async value' },
      ];
      expect(isChildren(children)).toBe(true);
    });

    it('should return false for an empty array', () => {
      expect(isChildren([])).toBe(false);
    });

    it('should return false for an array with invalid nodes', () => {
      expect(isChildren([{ invalid: 'object' }])).toBe(false);
    });

    it('should return false for non-array values', () => {
      expect(isChildren('string')).toBe(false);
      expect(isChildren(123)).toBe(false);
      expect(isChildren(null)).toBe(false);
    });
  });

  describe('isNode', () => {
    it('should return true for a leaf node', () => {
      const leaf = { label: 'Test Leaf', value: 'test value' };
      expect(isNode(leaf)).toBe(true);
    });

    it('should return true for an async leaf node', () => {
      const asyncLeaf = {
        label: 'Async Leaf',
        value: () => 'async value',
      };
      expect(isNode(asyncLeaf)).toBe(true);
    });

    it('should return true for an async leaf node with promise', () => {
      const asyncLeaf = {
        label: 'Async Leaf',
        value: () => Promise.resolve('async value'),
      };
      expect(isNode(asyncLeaf)).toBe(true);
    });

    it('should return true for a branch node', () => {
      const branch = {
        label: 'Test Branch',
        children: [{ label: 'Child', value: 'value' }],
      };
      expect(isNode(branch)).toBe(true);
    });

    it('should return true for an async branch node', () => {
      const asyncBranch = {
        label: 'Async Branch',
        children: () => Promise.resolve([{ label: 'Child', value: 'value' }]),
      };
      expect(isNode(asyncBranch)).toBe(true);
    });

    it('should return false for invalid objects', () => {
      expect(isNode({})).toBe(false);
      expect(isNode({ label: 'only label' })).toBe(false);
      expect(isNode(null)).toBe(false);
      expect(isNode(undefined)).toBe(false);
    });
  });
});
