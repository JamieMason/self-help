/**
 * @description
 * A **Leaf** represents the answer the User has been looking for as they have
 * been navigating a given **Help Document**. The value can be any String, but
 * is normally the contents of a **Markdown Document** which explains the answer
 * to the User.
 *
 * @example
 * http://j.mp/rxjs-self-help-example
 */
export interface Leaf {
  label: string;
  value: string;
}

/**
 * @description
 * An **AsyncLeaf** is like a **Leaf**, but its value is loaded lazily via a
 * function. This enables large documents to be read on-demand rather than
 * embedded in the help document. The function can return the value
 * synchronously or as a Promise.
 *
 * @example
 * {
 *   label: 'Installation Guide',
 *   value: () => fs.readFileSync('./installation.md', 'utf8')
 * }
 */
export interface AsyncLeaf {
  label: string;
  value: () => string | Promise<string>;
}

/**
 * @description
 * A **Branch** presents multiple options to choose from in the form of its
 * children **Array**. Children can be a combination of other **Branch**,
 * **AsyncBranch**, **Leaf**, or **AsyncLeaf** Nodes.
 *
 * @example
 * http://j.mp/rxjs-self-help-example
 */
export interface Branch {
  children: Node[];
  label: string;
}

/**
 * @description
 * **Help Documents** can be combined and linked together through the use of
 * **Promises**. Use this mechanism to deep-link to other **Help Documents**
 * hosted online, or to help break down a large **Help Document** into smaller
 * files that can be lazily-loaded at runtime.
 *
 * @example
 * http://j.mp/rxjs-self-help-example
 */
export interface AsyncBranch {
  children: () => Promise<Node[]>;
  label: string;
}

/**
 * @description
 * **Help Documents** return a nested hierarchy of **Node** Objects, see the
 * documentation for each of its Types for more information.
 *
 * @example
 * http://j.mp/rxjs-self-help-example
 */
export type Node = Leaf | AsyncLeaf | Branch | AsyncBranch;

/**
 * @description
 * A **Help Document** is a JavaScript Module exporting a `getHelpDocument`
 * method of type `GetHelpDocument`. It returns a nested hierarchy of Nodes
 * which form the **Decision Tree** a User will navigate.
 */
export type GetHelpDocument = () => Node | Promise<Node>;
