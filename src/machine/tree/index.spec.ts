import { describe, expect, it } from 'vitest';
import { createActor, waitFor } from 'xstate';
import type { AsyncLeaf, Branch, Leaf, Node } from '../../index.js';
import { createTreeInterpreter, createTreeMachine } from './index.js';

describe('tree machine', () => {
  const createLeaf = (label: string, value: string): Leaf => ({
    label,
    value,
  });

  const createAsyncLeaf = (label: string, valueFn: () => string | Promise<string>): AsyncLeaf => ({
    label,
    value: valueFn,
  });

  const createBranch = (label: string, children: Node[]): Branch => ({
    label,
    children,
  });

  describe('createTreeMachine', () => {
    it('should create a machine with the provided root node', () => {
      const rootNode = createLeaf('Root', 'root value');
      const machine = createTreeMachine(rootNode);
      const actor = createActor(machine);

      actor.start();

      expect(machine.config.id).toBe('tree-machine');
      expect(actor.getSnapshot().context.rootNode).toBe(rootNode);
      expect(actor.getSnapshot().context.currentNode).toBe(rootNode);
    });

    it('should create a machine with a custom id', () => {
      const rootNode = createLeaf('Root', 'root value');
      const machine = createTreeMachine(rootNode, 'custom-id');

      expect(machine.config.id).toBe('custom-id');
    });

    it('should initialise resolvedValue to null', () => {
      const rootNode = createLeaf('Root', 'root value');
      const machine = createTreeMachine(rootNode);
      const actor = createActor(machine);

      actor.start();

      expect(actor.getSnapshot().context.resolvedValue).toBe(null);
    });
  });

  describe('createTreeInterpreter', () => {
    it('should create an actor from the machine', () => {
      const rootNode = createLeaf('Root', 'root value');
      const actor = createTreeInterpreter(rootNode);

      expect(actor).toBeDefined();
      expect(actor.start).toBeDefined();
      expect(actor.send).toBeDefined();
    });
  });

  describe('state transitions', () => {
    describe('with a leaf node', () => {
      it('should transition to renderLeaf when starting with a leaf', () => {
        const rootNode = createLeaf('Leaf Node', 'leaf value');
        const actor = createTreeInterpreter(rootNode);

        actor.start();

        expect(actor.getSnapshot().value).toBe('renderLeaf');
      });

      it('should transition to renderValue when FINALISE is sent', () => {
        const rootNode = createLeaf('Leaf Node', 'leaf value');
        const actor = createTreeInterpreter(rootNode);

        actor.start();
        actor.send({ type: 'FINALISE' });

        expect(actor.getSnapshot().value).toBe('renderValue');
      });
    });

    describe('with an async leaf node', () => {
      it('should transition to resolveLeaf.loading when starting with async leaf', () => {
        const rootNode = createAsyncLeaf('Async Leaf', () => 'async value');
        const actor = createTreeInterpreter(rootNode);

        actor.start();

        expect(actor.getSnapshot().value).toEqual({
          resolveLeaf: 'loading',
        });
      });

      it('should resolve sync function and transition to renderLeaf', async () => {
        const rootNode = createAsyncLeaf('Async Leaf', () => 'sync value');
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();

        await waitFor(actor, (state) => state.matches('renderLeaf'), {
          timeout: 5000,
        });

        expect(actor.getSnapshot().value).toBe('renderLeaf');
        expect(actor.getSnapshot().context.resolvedValue).toBe('sync value');
      });

      it('should resolve async function and transition to renderLeaf', async () => {
        const rootNode = createAsyncLeaf('Async Leaf', () => Promise.resolve('async value'));
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();

        await waitFor(actor, (state) => state.matches('renderLeaf'), {
          timeout: 5000,
        });

        expect(actor.getSnapshot().value).toBe('renderLeaf');
        expect(actor.getSnapshot().context.resolvedValue).toBe('async value');
      });

      it('should convert async leaf to regular leaf after resolution', async () => {
        const rootNode = createAsyncLeaf('Async Leaf', () => 'resolved value');
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();

        await waitFor(actor, (state) => state.matches('renderLeaf'), {
          timeout: 5000,
        });

        const currentNode = actor.getSnapshot().context.currentNode;
        expect(currentNode).toEqual({
          label: 'Async Leaf',
          value: 'resolved value',
        });
      });

      it('should transition to resolveLeaf.failure when async value fails', async () => {
        const rootNode = createAsyncLeaf('Failing Async Leaf', () =>
          Promise.reject(new Error('Failed to load value')),
        );
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();

        await waitFor(actor, (state) => state.matches({ resolveLeaf: 'failure' }), {
          timeout: 5000,
        });

        expect(actor.getSnapshot().value).toEqual({
          resolveLeaf: 'failure',
        });
        expect(actor.getSnapshot().context.error).toBeDefined();
      });

      it('should retry loading when RETRY is sent after failure', async () => {
        let callCount = 0;
        const rootNode = createAsyncLeaf('Retry Async Leaf', () => {
          callCount++;
          if (callCount === 1) {
            return Promise.reject(new Error('First attempt failed'));
          }
          return 'success on retry';
        });
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();

        await waitFor(actor, (state) => state.matches({ resolveLeaf: 'failure' }), {
          timeout: 5000,
        });

        actor.send({ type: 'RETRY' });

        await waitFor(actor, (state) => state.matches('renderLeaf'), {
          timeout: 5000,
        });

        expect(actor.getSnapshot().value).toBe('renderLeaf');
        expect(actor.getSnapshot().context.resolvedValue).toBe('success on retry');
        expect(callCount).toBe(2);
      });

      it('should transition to renderValue when FINALISE is sent after resolution', async () => {
        const rootNode = createAsyncLeaf('Async Leaf', () => 'async value');
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();

        await waitFor(actor, (state) => state.matches('renderLeaf'), {
          timeout: 5000,
        });

        actor.send({ type: 'FINALISE' });

        expect(actor.getSnapshot().value).toBe('renderValue');
      });
    });

    describe('with a branch node', () => {
      it('should transition to renderBranch when starting with a branch', () => {
        const child = createLeaf('Child', 'child value');
        const rootNode = createBranch('Root Branch', [child]);
        const actor = createTreeInterpreter(rootNode);

        actor.start();

        expect(actor.getSnapshot().value).toBe('renderBranch');
      });

      it('should navigate to child and transition to renderLeaf when SELECT_CHILD is sent', () => {
        const child = createLeaf('Child Leaf', 'child value');
        const rootNode = createBranch('Root Branch', [child]);
        const actor = createTreeInterpreter(rootNode);

        actor.start();
        actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

        expect(actor.getSnapshot().value).toBe('renderLeaf');
        expect(actor.getSnapshot().context.currentNode).toBe(child);
      });

      it('should navigate to async leaf child and resolve it', async () => {
        const asyncChild = createAsyncLeaf('Async Child', () => 'async child value');
        const rootNode = createBranch('Root Branch', [asyncChild]);
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();
        actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

        await waitFor(actor, (state) => state.matches('renderLeaf'), {
          timeout: 5000,
        });

        expect(actor.getSnapshot().value).toBe('renderLeaf');
        expect(actor.getSnapshot().context.resolvedValue).toBe('async child value');
      });

      it('should navigate to nested branch when SELECT_CHILD points to a branch', () => {
        const grandchild = createLeaf('Grandchild', 'grandchild value');
        const child = createBranch('Child Branch', [grandchild]);
        const rootNode = createBranch('Root Branch', [child]);
        const actor = createTreeInterpreter(rootNode);

        actor.start();
        actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

        expect(actor.getSnapshot().value).toBe('renderBranch');
        expect(actor.getSnapshot().context.currentNode).toBe(child);
      });

      it('should return to root when SELECT_ROOT is sent from branch', () => {
        const grandchild = createLeaf('Grandchild', 'grandchild value');
        const child = createBranch('Child Branch', [grandchild]);
        const rootNode = createBranch('Root Branch', [child]);
        const actor = createTreeInterpreter(rootNode);

        actor.start();
        actor.send({ type: 'SELECT_CHILD', childIndex: 0 });
        actor.send({ type: 'SELECT_ROOT' });

        expect(actor.getSnapshot().context.currentNode).toBe(rootNode);
      });

      it('should clear resolvedValue when navigating via SELECT_CHILD', async () => {
        const asyncChild = createAsyncLeaf('Async Child', () => 'async child value');
        const leaf = createLeaf('Leaf', 'leaf value');
        const rootNode = createBranch('Root Branch', [asyncChild, leaf]);
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();
        actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

        await waitFor(actor, (state) => state.matches('renderLeaf'), {
          timeout: 5000,
        });

        expect(actor.getSnapshot().context.resolvedValue).toBe('async child value');

        actor.send({ type: 'SELECT_ROOT' });

        expect(actor.getSnapshot().context.resolvedValue).toBe(null);
      });
    });

    describe('with an async branch node', () => {
      it('should transition to resolveBranch.loading when starting with async branch', () => {
        const child = createLeaf('Child', 'child value');
        const rootNode = {
          label: 'Async Branch',
          children: () => Promise.resolve([child]),
        };
        const actor = createTreeInterpreter(rootNode);

        actor.start();

        expect(actor.getSnapshot().value).toEqual({
          resolveBranch: 'loading',
        });
      });

      it('should resolve and transition to renderBranch after async children load', async () => {
        const child = createLeaf('Child', 'child value');
        const rootNode = {
          label: 'Async Branch',
          children: () => Promise.resolve([child]),
        };
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();

        await waitFor(actor, (state) => state.matches('renderBranch'), {
          timeout: 5000,
        });

        expect(actor.getSnapshot().value).toBe('renderBranch');
      });

      it('should resolve async branch with async leaf children', async () => {
        const asyncChild = createAsyncLeaf('Async Child', () => 'async child value');
        const rootNode = {
          label: 'Async Branch',
          children: () => Promise.resolve([asyncChild]),
        };
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();

        await waitFor(actor, (state) => state.matches('renderBranch'), {
          timeout: 5000,
        });

        actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

        await waitFor(actor, (state) => state.matches('renderLeaf'), {
          timeout: 5000,
        });

        expect(actor.getSnapshot().context.resolvedValue).toBe('async child value');
      });

      it('should transition to resolveBranch.failure when async children fail', async () => {
        const rootNode = {
          label: 'Failing Async Branch',
          children: () => Promise.reject(new Error('Failed to load')),
        };
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();

        await waitFor(actor, (state) => state.matches({ resolveBranch: 'failure' }), {
          timeout: 5000,
        });

        expect(actor.getSnapshot().value).toEqual({
          resolveBranch: 'failure',
        });
        expect(actor.getSnapshot().context.error).toBeDefined();
      });

      it('should retry loading when RETRY is sent after failure', async () => {
        let callCount = 0;
        const child = createLeaf('Child', 'child value');
        const rootNode = {
          label: 'Retry Async Branch',
          children: () => {
            callCount++;
            if (callCount === 1) {
              return Promise.reject(new Error('First attempt failed'));
            }
            return Promise.resolve([child]);
          },
        };
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();

        await waitFor(actor, (state) => state.matches({ resolveBranch: 'failure' }), {
          timeout: 5000,
        });

        actor.send({ type: 'RETRY' });

        await waitFor(actor, (state) => state.matches('renderBranch'), {
          timeout: 5000,
        });

        expect(actor.getSnapshot().value).toBe('renderBranch');
        expect(callCount).toBe(2);
      });
    });

    describe('SELECT_ROOT from leaf', () => {
      it('should return to root when SELECT_ROOT is sent from leaf', () => {
        const child = createLeaf('Child Leaf', 'child value');
        const rootNode = createBranch('Root Branch', [child]);
        const actor = createTreeInterpreter(rootNode);

        actor.start();
        actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

        expect(actor.getSnapshot().value).toBe('renderLeaf');

        actor.send({ type: 'SELECT_ROOT' });

        expect(actor.getSnapshot().context.currentNode).toBe(rootNode);
        expect(actor.getSnapshot().value).toBe('renderBranch');
      });

      it('should return to root when SELECT_ROOT is sent from resolved async leaf', async () => {
        const asyncChild = createAsyncLeaf('Async Child', () => 'async value');
        const rootNode = createBranch('Root Branch', [asyncChild]);
        const actor = createActor(createTreeMachine(rootNode));

        actor.start();
        actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

        await waitFor(actor, (state) => state.matches('renderLeaf'), {
          timeout: 5000,
        });

        actor.send({ type: 'SELECT_ROOT' });

        expect(actor.getSnapshot().context.currentNode).toBe(rootNode);
        expect(actor.getSnapshot().value).toBe('renderBranch');
        expect(actor.getSnapshot().context.resolvedValue).toBe(null);
      });
    });

    describe('invalid SELECT_CHILD', () => {
      it('should not change currentNode when childIndex is out of bounds', () => {
        const child = createLeaf('Child', 'child value');
        const rootNode = createBranch('Root Branch', [child]);
        const actor = createTreeInterpreter(rootNode);

        actor.start();
        actor.send({ type: 'SELECT_CHILD', childIndex: 99 });

        expect(actor.getSnapshot().context.currentNode).toBe(rootNode);
      });
    });
  });
});
