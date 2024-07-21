import type { PageProps } from '$fresh/server.ts'

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>example</title>
        <link rel='stylesheet' href='/styles.css' />
        <link rel='stylesheet' href='/freshblog.css' />
        <script src='/freshblog.js' type='module' defer />
      </head>
      <body class='bg-slate-100'>
        <Component />
      </body>
    </html>
  )
}
