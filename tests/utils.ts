import { createHandler, ServeHandlerInfo } from '$fresh/server.ts'
import { DOMParser } from '$deno_dom/deno-dom-wasm.ts'
import blogPlugin, { type BlogOptions } from '../mod.ts'

type Handler =  (req: Request, connInfo?: ServeHandlerInfo) => Promise<Response>

export async function createFreshBlogHandler(blogOptions: BlogOptions): Promise<Handler> {
  const handler = await createHandler({
    routes: {},
    islands: {},
    baseUrl: import.meta.url,
  }, {
    plugins: [blogPlugin(blogOptions)],
  })

  return handler
}

export async function docForPath(
  handler: Handler,
  path: string,
) {
  const resp = await handler(
    new Request(`http://127.0.0.1${path}`),
  )
  const body = await resp.text()
  const doc = new DOMParser().parseFromString(body, 'text/html')!
  return doc
}
