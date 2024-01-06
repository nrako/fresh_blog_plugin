import { type BlogOptions } from '../mod.ts'
import { Handlers, PageProps } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import { getPost, type Post } from '../data.ts'
import { CSS, KATEX_CSS, render } from 'gfm/mod.ts'
import Time from '../components/Time.tsx'
import Footer from '../components/Footer.tsx'
import ReadTime from '../components/ReadTime.tsx'

interface Data {
  post: Post
  html: string
}

export function createPostHandler(
  options: Required<BlogOptions>,
): Handlers<Data> {
  return {
    async GET(req, ctx) {
      const post = await getPost(options.contentDir, ctx.params.slug)
      if (!post) return ctx.renderNotFound()

      // TODO read post attributes (front-matter) or content to detect needed
      // languages ? Or read options.codeLanguages ?
      await import(
        'https://esm.sh/prismjs@1.29.0/components/prism-typescript?no-check'
      )

      const html = render(post.content, {
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

      return ctx.render({
        post,
        html,
      })
    },
  }
}

export function createPostPage(options: Required<BlogOptions>) {
  return function PostPage(props: PageProps<Data>) {
    const { post, html } = props.data
    return (
      <>
        <Head>
          <title>{`${post.title} - ${options.title}`}</title>
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <style dangerouslySetInnerHTML={{ __html: KATEX_CSS }} />
          {/* TODO use post.attrs.enableTwitterEmbed ? */}
          <script
            async
            src='https://platform.twitter.com/widgets.js'
            charset='utf-8'
          >
          </script>
        </Head>
        <main class='max-w-screen-md px-4 pt-16 mx-auto'>
          <h1 class='text-5xl font-bold'>{post.title}</h1>
          <div class='text-gray-500 space-x-8'>
            <Time date={post.date} language={options.language} />
            <ReadTime content={post.content} />
          </div>
          <div
            class='mt-8 prose'
            data-light-theme='light'
            data-dark-theme='dark'
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </main>
        <Footer feedPathPrefix={options.feedPathPrefix} />
      </>
    )
  }
}
