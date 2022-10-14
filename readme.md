# remark-headings

A remark plugin to add metadata about headings to the parsed output.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

```sh
yarn add @vcarl/remark-headings
```

## Use

Running:

```js
import remarkHeadings from '@vcarl/remark-headings';

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";

const processor = unified()
  .use(remarkParse)
  .use(remarkStringify)
  .use(remarkHeadings);

const input = fs.readFileSync("input.md");

/*
# Heading 1
## Heading 2
### Heading 3
*/
const vfile = await processor.process(input);

console.log(vfile.data.headings)
```

Yields:

```javascript
[
  {"depth": 1, "value": "Heading 1"},
  {"depth": 2, "value": "Heading 2"},
  {"depth": 3, "value": "Heading 3"},
]
```

As a courtesy, any other data found to be attached to the node by other plugins will be forwarded through. For instance if you're using [`remark-heading-id`](https://github.com/imcuttle/remark-heading-id), that custom ID will look like:

```javascript
[
  {"depth": 1, "value": "Heading 1", "data": {"id": "custom-id"}},
  {"depth": 2, "value": "Heading 2"},
  {"depth": 3, "value": "Heading 3"},
]
```


## License

[MIT][license] © [Carl Vitullo][author]
