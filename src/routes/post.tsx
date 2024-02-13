import { type BlogOptions } from '../../mod.ts'
import { Handlers, PageProps } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import { getPost, type Post } from '../data.ts'
import Time from '../components/Time.tsx'
import Footer from '../components/Footer.tsx'
import ReadTime from '../components/ReadTime.tsx'

interface Data {
  post: Post
}

export function createPostHandler(
  options: Required<BlogOptions>,
): Handlers<Data> {
  return {
    async GET(_req, ctx) {
      const post = await getPost(ctx.params.slug, options)
      if (!post) return ctx.renderNotFound()
      return ctx.render({ post })
    },
  }
}

export function createPostPage(options: Required<BlogOptions>) {
  return function PostPage(props: PageProps<Data>) {
    const { post } = props.data
    return (
      <>
        <Head>
          <title>{`${post.frontmatter.title} - ${options.title}`}</title>
          {/* TODO use post.attrs.enableTwitterEmbed ? */}
          <script
            async
            src='https://platform.twitter.com/widgets.js'
            charset='utf-8'
          >
          </script>
          <link
            rel='stylesheet'
            type='text/css'
            href='https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css'
          />
        </Head>
        <main class='max-w-screen-md px-4 pt-16 mx-auto'>
          <h1 class='text-5xl font-bold'>{post.frontmatter.title}</h1>
          <div class='text-gray-500 space-x-8'>
            {post.frontmatter.date &&
              <Time date={post.frontmatter.date} language={options.language} />}
            <ReadTime content={post.content} />
          </div>
          <div
            class='mt-8 prose'
            data-light-theme='light'
            data-dark-theme='dark'
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </main>
        <Footer feedPathPrefix={options.feedPathPrefix} />
      </>
    )
  }
}
