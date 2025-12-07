import { describe, expect, it } from 'vitest';
import { isAsyncBranch, isBranch, isChildren, isLeaf, isNode } from './nodes';

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
