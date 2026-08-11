import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '@/components/not-found'

/**
 * Prerenders to `404.html`, which GitHub Pages serves for any unmatched path. The splat route
 * handles client-side misses via its own notFoundComponent.
 */
export const Route = createFileRoute('/404')({ component: NotFound })
