import { PageProps } from '$fresh/server.ts'
import Navigation from '../../components/Navigation.tsx'

export default function SpecsLayout({ Component }: PageProps) {
  // do something with state here
  return (
    <>
      <Navigation class='container mx-auto flex justify-center p-4' />
      <div class='prose prose-sm md:prose-base mx-auto p-4 md:p-8 shadow-lg shadow-cyan-500/50 bg-white'>
        <Component />
      </div>
    </>
  )
}
