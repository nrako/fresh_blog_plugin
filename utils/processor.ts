import markdownit from 'npm:markdown-it@14'
import katex from 'npm:markdown-it-katex@2'
import Shikiji from 'npm:markdown-it-shikiji@0.9'
import { transformerNotationDiff } from 'npm:shikiji-transformers@0.9'

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(katex)
  .use(
    await Shikiji({
      themes: {
        light: 'material-theme-lighter',
        dark: 'material-theme-darker'
      },
      transformers: [
        transformerNotationDiff()
      ]
    }),
  )

export default async function processor(content: string) {
  const html = md.render(content)
  // const html = render(content, {
  //   allowMath: true,
  //   allowIframes: true,

  //   // TODO use front matter post.attrs.disableHTMLSanitzation or
  //   // post.attrs.enableTwitterEmbed? Might not be sufficient since
  //   // gfm also sanitize CSS classes which could be useful for
  //   // YouTube iframes...

  //   // NOTE this is actually mostly needed because
  //   // https://deno.land/x/gfm@0.3.0/mod.ts?source is quite
  //   // opiniated about which HTML elements and CSS classes can make
  //   // it through. For YouTube `w-full aspect-video" CSS classes would not go through.
  //   // For Twitter `twitter-tweet` on `<blockquote>` CSS class would not go through
  //   disableHtmlSanitization: true,
  // })

  return html
}
