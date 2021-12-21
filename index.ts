import { Heading as AstHeading } from "mdast";

import { Node, visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { VFileWithOutput } from "unified";

export interface Heading {
  depth: number;
  value: string;
}

export const headings = (root: Node) => {
  const headingList: Heading[] = [];

  visit(root, "heading", (node: AstHeading) => {
    headingList.push({
      depth: node.depth,
      value: toString(node, { includeImageAlt: false }),
    });
  });

  return headingList;
};

export default function remarkHeadings() {
  return (node: Node, file: VFileWithOutput<any>) => {
    file.data.headings = headings(node);
  };
}
