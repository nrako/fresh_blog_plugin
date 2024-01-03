import { type Post } from '../post.ts'
import Time from './Time.tsx'

export default function PostCard(
  props: { url: string; post: Post; language: string },
) {
  const { url, post, language } = props
  return (
    <div class='py-8 border(t gray-200)'>
      <a class='sm:col-span-2' href={`${url}/${post.slug}`}>
        <h3 class='text(3xl gray-900) font-bold'>
          {post.title}
        </h3>
        <Time date={post.date} language={language} />
        <div class='mt-4 text-gray-900'>
          {post.description}
        </div>
      </a>
    </div>
  )
}
