/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('mdast').List} List
 *
 * @typedef TestConfig
 * @property {boolean} [useCustomHProperty]
 *
 */

import fs from "node:fs";
import path from "node:path";
import test from "tape";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import plugin, { headings } from "../index.js";
import { visit } from "unist-util-visit";

const join = path.join;

test("mdast-util-headings", (t) => {
  t.is(typeof headings, "function", "should be a function");

  t.throws(
    () => {
      // @ts-expect-error
      headings();
    },
    /Cannot read propert/,
    "should fail without node"
  );

  t.end();
});

test("Fixtures", async (t) => {
  const root = join("test", "fixtures");
  const files = fs.readdirSync(root);
  let index = -1;

  while (++index < files.length) {
    const name = files[index];

    if (name.indexOf(".") === 0) {
      continue;
    }

    const input = fs.readFileSync(join(root, name, "input.md"));

    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkStringify)
      .use(plugin);

    const tree = /** @type {Root} */ processor.runSync(processor.parse(input));
    const actual = headings(tree);
    /** @type {Root} */
    const expected = JSON.parse(
      String(fs.readFileSync(join(root, name, "output.json")))
    );

    // eslint-disable-next-line no-await-in-loop
    const vfile = await processor.process(input);

    t.deepEqual(actual, expected, name);
    t.deepEqual(vfile.data.headings, expected, name);
    console.log({ h: vfile.data.headings });
  }

  t.end();
});

test("Data", async (t) => {
  const input = `# custom-data Heading
## Heading without data`;
  const expected = [
    { depth: 1, value: 'custom-data Heading', data: { foo: 'bar' } },
    { depth: 2, value: 'Heading without data' },
  ];

  const processor = unified()
    .use(remarkParse)
    .use(() => {
      return (root) => {
        visit(root, "heading", (node) => {
          const child = node.children?.[0];
          if (child.type === 'text' && child.value.startsWith('custom-data')) {
            node.data = { foo: 'bar' };
          }
        });
      };
    })
    .use(plugin)
    .use(remarkStringify);
  const result = await processor.process(input);
  const data = result.data;
  t.deepEqual(data.headings, expected, 'should have custom data');
});
