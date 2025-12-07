import { type Actor, assign, createActor, createMachine, fromPromise, type Snapshot } from 'xstate';
import type { Branch, Node } from '../../index.js';

export interface TreeContext {
  currentNode: Node;
  error: Error | null;
  rootNode: Node;
}

export interface FinaliseEvent {
  type: 'FINALISE';
}

export interface RetryEvent {
  type: 'RETRY';
}

export interface SelectChildEvent {
  type: 'SELECT_CHILD';
  childIndex: number;
}

export interface SelectRootEvent {
  type: 'SELECT_ROOT';
}

export interface SetChildrenEvent {
  type: 'done.invoke.getChildren';
  data: Branch;
}

export type TreeEvent =
  | FinaliseEvent
  | RetryEvent
  | SelectChildEvent
  | SelectRootEvent
  | SetChildrenEvent;

import { isAsyncBranch, isBranch, isChildren, isLeaf, isNode } from './nodes.js';

const isSelectChildEvent = (event: TreeEvent): event is SelectChildEvent =>
  event.type === 'SELECT_CHILD';

export const createTreeMachine = (rootNode: Node, id: string = 'tree-machine') => {
  const RENDER_BRANCH = `#${id}.renderBranch`;
  const RENDER_LEAF = `#${id}.renderLeaf`;
  const RENDER_VALUE = `#${id}.renderValue`;
  const RESOLVE_BRANCH = `#${id}.resolveBranch`;
  const VISIT_NODE = `#${id}.visitNode`;

  return createMachine(
    {
      id,
      types: {} as {
        context: TreeContext;
        events: TreeEvent;
      },
      context: {
        currentNode: rootNode,
        error: null,
        rootNode,
      },
      initial: 'visitNode',
      states: {
        visitNode: {
          always: [
            { guard: 'isAsyncBranch', target: RESOLVE_BRANCH },
            { guard: 'isBranch', target: RENDER_BRANCH },
            { guard: 'isLeaf', target: RENDER_LEAF },
          ],
        },
        resolveBranch: {
          initial: 'loading',
          states: {
            loading: {
              invoke: {
                id: 'getChildren',
                src: 'getChildren',
                input: ({ context }) => ({ currentNode: context.currentNode }),
                onDone: {
                  target: 'success',
                  actions: assign({
                    currentNode: ({ event }) => event.output as Branch,
                  }),
                },
                onError: {
                  target: 'failure',
                  actions: assign({
                    error: ({ event }) => event.error as Error,
                  }),
                },
              },
            },
            success: {
              always: {
                target: VISIT_NODE,
              },
            },
            failure: {
              on: {
                RETRY: {
                  target: 'loading',
                },
              },
            },
          },
        },
        renderBranch: {
          on: {
            SELECT_CHILD: {
              actions: 'selectChild',
              target: VISIT_NODE,
            },
            SELECT_ROOT: {
              actions: 'selectRoot',
              target: VISIT_NODE,
            },
          },
        },
        renderLeaf: {
          on: {
            FINALISE: RENDER_VALUE,
            SELECT_ROOT: {
              actions: 'selectRoot',
              target: VISIT_NODE,
            },
          },
        },
        renderValue: {
          type: 'final',
        },
      },
    },
    {
      actions: {
        selectChild: assign({
          currentNode: ({ context, event }) => {
            const typedEvent = event as TreeEvent;
            return isSelectChildEvent(typedEvent) &&
              isBranch(context.currentNode) &&
              isNode(context.currentNode.children[typedEvent.childIndex])
              ? context.currentNode.children[typedEvent.childIndex]
              : context.currentNode;
          },
        }),
        selectRoot: assign({
          currentNode: ({ context }) => context.rootNode,
        }),
      },
      guards: {
        isAsyncBranch: ({ context }) => isAsyncBranch(context.currentNode),
        isBranch: ({ context }) => isBranch(context.currentNode),
        isLeaf: ({ context }) => isLeaf(context.currentNode),
      },
      actors: {
        getChildren: fromPromise(
          async ({ input }: { input: { currentNode: Node } }): Promise<Branch> => {
            const { currentNode } = input;
            if (!isAsyncBranch(currentNode)) {
              throw new Error('getChildren invoked with a value not of type AsyncBranch');
            }
            const { label } = currentNode;
            const children = await currentNode.children();
            if (!isChildren(children)) {
              throw new Error(`AsyncBranch with label "${label}" has invalid children`);
            }
            return { children, label };
          },
        ),
      },
    },
  );
};

export type TreeMachine = ReturnType<typeof createTreeMachine>;
export type TreeActor = Actor<TreeMachine>;
export type TreeSnapshot = Snapshot<unknown>;

export const createTreeInterpreter = (rootNode: Node, id?: string): TreeActor =>
  createActor(createTreeMachine(rootNode, id));
