import { type InternalOptions } from '../../mod.ts'

export function getFeedPathPrefix(
  blogOptions: InternalOptions,
): string {
  return blogOptions.feedPathPrefix ?? blogOptions.path
}
