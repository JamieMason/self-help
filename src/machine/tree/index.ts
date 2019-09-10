import { assign, interpret, Interpreter, Machine, State, StateMachine } from 'xstate';
import { Branch, Node } from '../..';
import { actions } from './actions';
import { guards } from './guards';
import { services } from './services';

export interface TreeSchema {
  states: {
    visitNode: {};
    resolveBranch: {
      states: {
        failure: {};
        loading: {};
        success: {};
      };
    };
    renderBranch: {};
    renderLeaf: {};
    renderValue: {};
  };
}

export interface TreeContext<NodeType = Node> {
  currentNode: NodeType;
  error: Error | null;
  retries: number;
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

export type TreeInterpreter = Interpreter<TreeContext, TreeSchema, TreeEvent>;
export type TreeState = State<TreeContext<Node>, TreeEvent>;
export type TreeMachine = StateMachine<TreeContext<Node>, TreeSchema, TreeEvent>;

export const createTreeMachine = (rootNode: Node, id: string = 'tree-machine'): TreeMachine => {
  const RENDER_BRANCH = `#${id}.renderBranch`;
  const RENDER_LEAF = `#${id}.renderLeaf`;
  const RENDER_VALUE = `#${id}.renderValue`;
  const RESOLVE_BRANCH = `#${id}.resolveBranch`;
  const VISIT_NODE = `#${id}.visitNode`;
  return Machine<TreeContext, TreeSchema, TreeEvent>(
    {
      context: {
        currentNode: rootNode,
        error: null,
        retries: 0,
        rootNode,
      },
      id,
      initial: 'visitNode',
      states: {
        visitNode: {
          on: {
            '': [
              { cond: 'isUnresolvedBranch', target: RESOLVE_BRANCH },
              { cond: 'isBranch', target: RENDER_BRANCH },
              { cond: 'isLeaf', target: RENDER_LEAF },
            ],
          },
        },
        resolveBranch: {
          initial: 'loading',
          states: {
            loading: {
              invoke: {
                id: 'getChildren',
                src: 'getChildren',
                onDone: {
                  target: 'success',
                  actions: assign((context, event) => ({ currentNode: event.data })),
                },
                onError: {
                  target: 'failure',
                  actions: assign((context, event) => ({ error: event.data })),
                },
              },
            },
            success: {
              on: {
                '': {
                  actions: ['resetRetries'],
                  target: VISIT_NODE,
                },
              },
            },
            failure: {
              on: {
                RETRY: {
                  actions: ['incrementRetries'],
                  target: 'loading',
                },
              },
            },
          },
        },
        renderBranch: {
          on: {
            SELECT_CHILD: {
              actions: ['selectChild'],
              target: VISIT_NODE,
            },
            SELECT_ROOT: {
              actions: ['selectRoot'],
              target: VISIT_NODE,
            },
          },
        },
        renderLeaf: {
          on: {
            FINALISE: RENDER_VALUE,
            SELECT_ROOT: {
              actions: ['selectRoot'],
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
      actions,
      guards,
      services,
    },
  );
};

export const createTreeInterpreter = (rootNode: Node, id?: string): TreeInterpreter =>
  interpret(createTreeMachine(rootNode, id));
