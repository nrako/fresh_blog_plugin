import type { PageProps } from '$fresh/server.ts'

export default function AboutPage(props: PageProps) {
  return <div>You are on the page '{props.url.href}'.</div>
}
