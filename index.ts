import { Heading as AstHeading } from "mdast";

import { Node, visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { VFileWithOutput } from "unified";

export interface Heading {
  depth: number;
  value: string;
  id?: string;
}

export const hasHeadingsData = (
  data: unknown
): data is { headings: Heading[] } =>
  data instanceof Object &&
  data.hasOwnProperty("headings") &&
  // @ts-expect-error
  data.headings instanceof Array;

export const headings = (root: Node) => {
  const headingList: Heading[] = [];

  visit(root, "heading", (node: AstHeading) => {
    const heading: Heading = {
      depth: node.depth,
      value: toString(node, { includeImageAlt: false }),
    };

    // If a previous plugin attached the heading id to the node,
    // store it as part of the heading list.
    const id = (node?.data as any)?.id;
    if (id) {
      heading.id = id;
    }

    headingList.push(heading);
  });

  return headingList;
};

export default function remarkHeadings() {
  return (node: Node, file: VFileWithOutput<any>) => {
    file.data.headings = headings(node);
  };
}
