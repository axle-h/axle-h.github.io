import { use } from 'react'
import type { MDXContent } from 'mdx/types'

/**
 * Lazily loads a post's compiled MDX component.
 *
 * The glob is deliberately NOT eager: eager would fuse all 13 posts (plus their inlined diagram
 * SVGs, katex markup and shiki output) into a single chunk downloaded by every visitor. Lazy gives
 * one chunk per post.
 *
 * A compiled component can't travel as route loader data (it isn't serialisable), so the loader
 * primes this module-level cache instead and the component reads it back. If the cache is cold —
 * which it is on the client right after hydrating a prerendered page, because the loader result
 * was dehydrated rather than re-run — `use()` suspends against the same promise. That needs a
 * <Suspense> boundary above the consumer.
 */
const modules = import.meta.glob<{ default: MDXContent }>('../../posts/*.mdx')

const resolved = new Map<string, MDXContent>()
const pending = new Map<string, Promise<MDXContent>>()

export function loadPostContent(filename: string): Promise<MDXContent> {
  const ready = resolved.get(filename)
  if (ready) return Promise.resolve(ready)

  let promise = pending.get(filename)
  if (!promise) {
    const load = modules[`../../posts/${filename}`]
    if (!load) {
      return Promise.reject(new Error(`no mdx module for ${filename}`))
    }
    promise = load().then((module) => {
      resolved.set(filename, module.default)
      return module.default
    })
    pending.set(filename, promise)
  }
  return promise
}

/** Suspends if the content isn't loaded yet. Requires a <Suspense> boundary above it. */
export function usePostContent(filename: string): MDXContent {
  const ready = resolved.get(filename)
  if (ready) return ready
  return use(loadPostContent(filename))
}
