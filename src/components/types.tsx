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

  export type Mutator = (node: Node) => void;
  export type SetState = (mutator: Mutator) => void;
  export interface State {
    doc: Node;
  }
}
