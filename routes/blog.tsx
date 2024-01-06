import { type BlogOptions } from '../mod.ts'
import { FreshContext } from '$fresh/server.ts'
import { getPosts } from '../data.ts'
import PostCard from '../components/PostCard.tsx'
import Footer from '../components/Footer.tsx'

export default function createBlog(options: Required<BlogOptions>) {
  return async function Blog(_req: Request, ctx: FreshContext) {
    const posts = await getPosts(options.contentDir)
    return (
      <>
        <main class='max-w-screen-md px-4 pt-16 mx-auto'>
          <h1 class='text-5xl font-bold'>{options.title}</h1>
          <div class='mt-8'>
            {!posts.length && "There's no posts yet."}
            {posts.map((post) => (
              <PostCard
                url={options.path}
                post={post}
                language={options.language}
              />
            ))}
          </div>
        </main>
        <Footer feedPathPrefix={options.feedPathPrefix} />
      </>
    )
  }
}
