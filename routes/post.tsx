import { type BlogOptions } from '../mod.ts'
import { Handlers, PageProps } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import { getPost, type Post } from '../data.ts'
import { CSS, KATEX_CSS } from 'gfm/mod.ts'
import Time from '../components/Time.tsx'
import Footer from '../components/Footer.tsx'
import ReadTime from '../components/ReadTime.tsx'
import processor from '../utils/processor.ts'

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

      const html = await processor(post.content)

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
