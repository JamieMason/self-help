import produce from 'immer';
import { useCallback, useState } from 'preact/hooks';
import { Branch } from './branch';
import { getInitialState } from './lib/get-initial-state';
import { List } from './list';

export type Node = BranchNode | LeafNode;

export interface BranchNode {
  label: string;
  children: Node[];
}

export interface LeafNode {
  label: string;
  value: string;
}

interface State {
  doc: Node;
}

type Mutator = (node: Node) => void;
export type SetState = (mutator: Mutator) => void;

export interface Props {
  path: string;
  setState: SetState;
  state: State;
}

export function App() {
  const [state, saveState] = useState<State>(getInitialState);
  const setState = useCallback<SetState>((mutator) => saveState(produce(state, mutator)), [state]);
  return (
    <List>
      <Branch path="doc" setState={setState} state={state} />
    </List>
  );
}
