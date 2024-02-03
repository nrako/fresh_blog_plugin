import { transformerNotationDiff } from 'npm:shikiji-transformers@0.9'
import { VFile } from 'https://esm.sh/vfile@5'
import { mystParse } from 'https://esm.sh/myst-parser@1.0.22'
import {
  basicTransformationsPlugin,
  DOITransformer,
  GithubTransformer,
  inlineMathSimplificationPlugin,
  linksPlugin,
  RRIDTransformer,
  WikiTransformer,
} from 'https://esm.sh/myst-transforms@1.1.19'
import { unified } from 'https://esm.sh/unified@10'
import { visit } from 'https://esm.sh/unist-util-visit@5'
import { mystToHtml } from 'https://esm.sh/myst-to-html@1.0.22'
import rehypeShiki from 'https://esm.sh/@shikijs/rehype@1.0.0-beta.3'
import rehypeStringify from 'https://esm.sh/v135/rehype-stringify@8'
import rehypeParse from 'https://esm.sh/rehype-parse@8'
import rehypeExternalLinks from 'https://esm.sh/rehype-external-links@3'
import rehypeKatex from 'https://esm.sh/v135/rehype-katex@7.0.0/lib/index.js'

async function parse(text: string) {
  const file = new VFile()
  const mdast = mystParse(text, {
    markdownit: { linkify: true },
    vfile: file,
  })

  const linkTransforms = [
    new WikiTransformer(),
    new GithubTransformer(),
    new DOITransformer(),
    new RRIDTransformer(),
  ]

  // For the mdast that we show, duplicate, strip positions and dump to yaml
  // Also run some of the transforms, like the links
  const mdastPre = JSON.parse(JSON.stringify(mdast))
  unified()
    .use(basicTransformationsPlugin, {})
    .use(inlineMathSimplificationPlugin)
    .use(linksPlugin, { transformers: linkTransforms })
    .runSync(mdastPre)

  visit(mdastPre, (n) => delete n.position)
  const htmlString = mystToHtml(mdastPre, {
    hast: {
      allowDangerousHtml: true,
    },
    stringifyHtml: {
      allowDangerousHtml: true,
    },
  })

  const r = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeShiki, {
      themes: {
        light: 'material-theme-lighter',
        dark: 'material-theme-darker',
      },
      transformers: [
        transformerNotationDiff(),
      ],
    })
    // @ts-ignore required until unified can be upgrade to v11 when mystmd plays fair
    .use(rehypeExternalLinks, { rel: ['noopener'] })
    // @ts-ignore required until unified can be upgrade to v11 when mystmd plays fair
    .use(rehypeKatex)
    // @ts-ignore required until unified can be upgrade to v11 when mystmd plays fair
    .use(rehypeStringify)
    .process(htmlString)

  const html = r.value

  return { html }
}

export default async function processor(content: string) {
  const { html } = await parse(content)
  return html
}