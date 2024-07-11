import { type InternalOptions } from '../../mod.ts'
import { Handlers, PageProps } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import { getPost, type Post } from '../data.ts'
import Time from '../components/Time.tsx'
import Footer from '../components/Footer.tsx'
import ReadTime from '../components/ReadTime.tsx'
import DialogMessages from '../components/DialogMessages.tsx'
import { Authors } from '../components/Authors.tsx'
import { getFeedPathPrefix } from '../utils/index.ts'

interface Data {
  post: Post
  displayMessages: boolean
}

export function createPostHandler(
  options: InternalOptions,
): Handlers<Data> {
  return {
    async GET(_req, ctx) {
      const post = await getPost(ctx.params.slug, options)
      if (!post) return ctx.renderNotFound()
      return ctx.render({
        post,
        displayMessages: options.dev || ctx.config.dev,
      })
    },
  }
}

export function createPostPage(options: InternalOptions) {
  const feedPathPrefix = getFeedPathPrefix(options)
  return function PostPage(props: PageProps<Data>) {
    const { post, displayMessages } = props.data

    post.messages.errors?.forEach((error) => console.error(post.slug, error))
    post.messages.warnings?.forEach((warning) =>
      console.warn(post.slug, warning)
    )

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
        {displayMessages &&
          (
            <DialogMessages
              messages={post.messages}
            />
          )}
        <article class='freshBlog-post'>
          <header>
            <h1>{post.frontmatter.title}</h1>
            {post.frontmatter.subtitle && (
              <p>
                {post.frontmatter.subtitle}
              </p>
            )}
            <div class='freshBlog-post-meta' aria-label='Post Metadata'>
              {options.showAuthors !== 'never' && post.frontmatter.authors && (
                <Authors
                  authors={post.frontmatter.authors}
                  affiliations={post.frontmatter.affiliations}
                  showLinks={true}
                />
              )}
              {post.frontmatter.date &&
                (
                  <Time
                    date={post.frontmatter.date}
                    language={options.language}
                  />
                )}
              <ReadTime content={post.content} />
            </div>
          </header>
          <div
            class='freshBlog-post-content'
            data-light-theme='light'
            data-dark-theme='dark'
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        <Footer feedPathPrefix={feedPathPrefix} />
      </>
    )
  }
}
