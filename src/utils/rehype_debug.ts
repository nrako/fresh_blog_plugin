import type { Node } from 'https://esm.sh/v135/@types/unist@3.0.2/index.d.ts'
import type { Element } from 'npm:@types/hast'
import { visit } from 'https://esm.sh/unist-util-visit@5'

export default () => {
  function visitor(
    node: Element,
    _index: number,
    parent: Element | null,
  ) {
    console.log(node)
    if (node.tagName !== 'code') return
    if (!parent || parent.tagName !== 'pre') return
  }

  return (tree: Node) => {
    visit(tree, 'element', visitor)
  }
}
