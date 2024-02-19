import { createHandler, ServeHandlerInfo } from '$fresh/server.ts'
import { DOMParser } from '../deps.ts'
import blogPlugin, { type InternalOptions } from '../mod.ts'
import * as colors from '$std/fmt/colors.ts'

type Handler = (req: Request, connInfo?: ServeHandlerInfo) => Promise<Response>

export async function createFreshBlogHandler(
  blogOptions: Partial<InternalOptions>,
): Promise<Handler> {
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

export async function runBuildExample() {
  try {
    await Deno.remove('./example/_fresh', { recursive: true })
  } catch {
    // Ignore
  }

  const res = await new Deno.Command(Deno.execPath(), {
    args: [
      'run',
      '-A',
      './example/dev.ts',
      'build',
    ],
    env: {
      GITHUB_SHA: '__BUILD_ID__',
      DENO_DEPLOYMENT_ID: '__BUILD_ID__',
    },
    stdin: 'null',
    stdout: 'piped',
    stderr: 'piped',
  }).output()

  const output = getStdOutput(res)
  return {
    code: res.code,
    stderr: output.stderr,
    stdout: output.stdout,
  }
}

export function getStdOutput(
  out: Deno.CommandOutput,
): { stdout: string; stderr: string } {
  const decoder = new TextDecoder()
  const stdout = colors.stripAnsiCode(decoder.decode(out.stdout))

  const decoderErr = new TextDecoder()
  const stderr = colors.stripAnsiCode(decoderErr.decode(out.stderr))

  return { stdout, stderr }
}
