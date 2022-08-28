export namespace EditorApp {
  export type Node = BranchNode | LeafNode;

  export interface BranchNode {
    label: string;
    children: Node[];
  }

  export interface LeafNode {
    label: string;
    value: string;
  }

  export type Mutator = (node: State) => void;
  export type SetState = (mutator: Mutator) => void;
  export interface State {
    currentRoute: 'editor' | 'source';
    darkModeEnabled: boolean;
    doc: Node;
  }
}
