export interface Leaf {
  label: string;
  value: string;
}

export interface Branch {
  children: Node[];
  label: string;
}

export interface UnresolvedBranch {
  children: () => Promise<Node[]>;
  label: string;
}

export type Node = Leaf | Branch | UnresolvedBranch;
