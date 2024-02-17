import { PageProps } from '$fresh/server.ts'
import Navigation from '../../components/Navigation.tsx'

export default function BlogLayout({ Component, state }: PageProps) {
  // do something with state here
  return (
    <>
      <Navigation class='container mx-auto flex justify-center p-4' />
      <div class='container mx-auto flex flex-wrap py-6 justify-center items-start gap-4 font-serif'>
        <div class='w-full md:w-2/3 prose prose-sm md:prose-base lg:prose-lg xl:prose-xl prose-slate p-4 md:p-8 lg:py-12 shadow-lg rounded-lg bg-neutral-100'>
          <Component />
        </div>
        <aside class='w-full md:w-1/3 px-3 prose prose-sm p-4 md:p-8 lg:py-12 shadow-lg rounded-lg bg-neutral-100'>
          <h1>About this Blog</h1>
          <p>
            This blog has its own custom layout which differs from{' '}
            <a href='/specs'>the specs layout</a>.
          </p>
          <a href='/blog/about'>More...</a>
        </aside>
      </div>
    </>
  )
}
