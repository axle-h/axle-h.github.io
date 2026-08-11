import type { Plugin } from 'vite'
import { readPostIndex, POSTS_DIR } from './posts-index.ts'

const ID = 'virtual:posts'
const RESOLVED = '\0virtual:posts'

/**
 * Exposes the fs-derived post index to app code as `virtual:posts`.
 *
 * Metadata is embedded as a JSON literal (~2.5KB for 13 posts) because the home page grid and
 * `PostLink` need every post's title/url/logo on the client. Post *content* is loaded separately
 * via a lazy `import.meta.glob` so each post stays its own chunk.
 */
export function postsIndexPlugin(): Plugin {
  return {
    name: 'posts-index',
    resolveId(id) {
      return id === ID ? RESOLVED : null
    },
    // Not `async`: this hook runs for every module in the graph, and returning a promise for
    // all ~3000 of them shows up as the dominant cost in --plugin-timings.
    load(id) {
      if (id !== RESOLVED) return null
      return readPostIndex().then(
        (posts) => `export const posts = ${JSON.stringify(posts)}\n`
      )
    },
    configureServer(server) {
      server.watcher.add(POSTS_DIR)
      const invalidate = (file: string) => {
        if (!file.endsWith('.mdx')) return
        const mod = server.moduleGraph.getModuleById(RESOLVED)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', invalidate)
      server.watcher.on('unlink', invalidate)
    },
  }
}
