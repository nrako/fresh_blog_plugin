import { render } from 'gfm/mod.ts'

export default async function processor(content: string) {
  await import(
    'https://esm.sh/prismjs@1.29.0/components/prism-typescript?no-check'
  )

  const html = render(content, {
    allowMath: true,
    allowIframes: true,

    // TODO use front matter post.attrs.disableHTMLSanitzation or
    // post.attrs.enableTwitterEmbed? Might not be sufficient since
    // gfm also sanitize CSS classes which could be useful for
    // YouTube iframes...

    // NOTE this is actually mostly needed because
    // https://deno.land/x/gfm@0.3.0/mod.ts?source is quite
    // opiniated about which HTML elements and CSS classes can make
    // it through. For YouTube `w-full aspect-video" CSS classes would not go through.
    // For Twitter `twitter-tweet` on `<blockquote>` CSS class would not go through
    disableHtmlSanitization: true,
  })

  return html
}
