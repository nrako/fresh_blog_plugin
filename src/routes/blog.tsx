import { type BlogOptions } from '../../mod.ts'
import { getPosts } from '../data.ts'
import PostCard from '../components/PostCard.tsx'
import Footer from '../components/Footer.tsx'

export default function createBlog(options: Required<BlogOptions>) {
  return async function Blog(_req: Request) {
    const posts = await getPosts(options)
    return (
      <>
        <main class='fresh-blog'>
          <h1>{options.title}</h1>
          {!posts.length && "There's no posts yet."}
          {posts.map((post) => (
            <PostCard
              url={`${options.path}/${post.slug}`}
              frontmatter={post.frontmatter}
              language={options.language}
            />
          ))}
        </main>
        <Footer feedPathPrefix={options.feedPathPrefix} />
      </>
    )
  }
}
