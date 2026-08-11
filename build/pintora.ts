/**
 * Build-time Pintora diagram rendering.
 *
 * Lifted verbatim from the old `components/diagram.tsx`, which did this inside an async React
 * Server Component. `@pintora/cli` is Node-only, so it now runs during MDX compilation instead.
 *
 * The returned value is an opaque HTML string, injected downstream via dangerouslySetInnerHTML.
 * Do NOT convert it to JSX or hast: `svg.prop('viewbox', …)` below is lowercase and only survives
 * because the HTML parser corrects SVG attribute casing. As JSX the viewBox would silently vanish
 * and every diagram would stop scaling.
 */
import { render as renderPintora } from '@pintora/cli'
import { load as cheerioLoad } from 'cheerio'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { ROOT } from './posts-index.ts'

interface Palette {
  bg: string
  solid: string
  text: string
}

type PaletteMode = 'light' | 'dark'

const palettes: Record<PaletteMode, Palette> = {
  light: {
    bg: 'white',
    solid: '#8EC6FA',
    text: 'rgb(30, 47, 72)',
  },
  dark: {
    bg: 'rgb(30, 47, 72)',
    solid: 'rgb(2, 26, 49)',
    text: 'white',
  },
}

type DiagramType = 'componentDiagram' | 'sequenceDiagram' | 'activityDiagram'

const themes: Record<DiagramType, (palette: Palette) => string> = {
  componentDiagram: (palette) => `
    edgeType curved
    componentPadding 20
    hideGroupType true
    diagramPadding 0
    fontSize 20
    groupBackground transparent
    groupBorderWidth 1
    componentBackground ${palette.solid}
    componentBorderColor ${palette.solid}
    groupBorderColor ${palette.text}
    relationLineColor ${palette.text}
    textColor ${palette.text}
    labelBackground ${palette.bg}
  `,
  sequenceDiagram: (palette) => `
    fontSize 20
    messageFontSize 20
    mirrorActors false
    messageTextColor ${palette.text}
    loopLineColor ${palette.text}
    actorBackground ${palette.solid}
    actorTextColor ${palette.text}
    actorBorderColor ${palette.text}
    participantBackground ${palette.solid}
    activationBackground ${palette.solid}
    dividerTextColor ${palette.text}
  `,
  activityDiagram: (palette) => `
    fontSize 20
    edgeType curved
    actionPaddingX 10
    actionPaddingY 10
    actionBackground ${palette.solid}
    actionBorderColor ${palette.text}
    groupBackground ${palette.solid}
    groupBorderColor ${palette.text}
    textColor ${palette.text}
    edgeColor ${palette.text}
    keywordBackground ${palette.solid}
    noteTextColor ${palette.text}
    labelTextColor ${palette.text}
    labelBackground transparent
  `,
}

const CACHE_DIR = path.join(ROOT, 'node_modules/.cache/pintora')
/** Bump when palettes or theme params change, to invalidate the on-disk cache. */
const CACHE_VERSION = 'v1'

/** Dedupes within a single process; the disk cache covers the client/SSR/prerender passes. */
const memo = new Map<string, Promise<string>>()

export function renderDiagram(src: string, mode: PaletteMode): Promise<string> {
  const key = createHash('sha256')
    .update(`${CACHE_VERSION}\0${mode}\0${src}`)
    .digest('hex')
  let pending = memo.get(key)
  if (!pending) {
    pending = renderCached(key, src, mode)
    memo.set(key, pending)
  }
  return pending
}

async function renderCached(key: string, src: string, mode: PaletteMode) {
  const file = path.join(CACHE_DIR, `${key}.svg`)
  try {
    return await readFile(file, 'utf8')
  } catch {
    // cache miss
  }
  const svg = await renderUncached(src, mode)
  await mkdir(CACHE_DIR, { recursive: true })
  await writeFile(file, svg)
  return svg
}

async function renderUncached(src: string, mode: PaletteMode): Promise<string> {
  const diagramType = src
    .split('\n')
    .find((line) => line.trim() !== '')
    ?.trim()

  if (!diagramType || !(diagramType in themes)) {
    throw new Error(`unknown diagram type ${diagramType}`)
  }

  const palette = palettes[mode]
  const theme = `
    @param {
      ${themes[diagramType as DiagramType](palette)}
    }
  `
  const themedSrc = src.replace(diagramType, diagramType + theme)
  const result = await renderPintora({
    code: themedSrc,
    pintoraConfig: {
      themeConfig: {},
    },
    backgroundColor: 'transparent',
    mimeType: 'image/svg+xml',
    renderInSubprocess: false,
  })

  if (Buffer.isBuffer(result)) {
    throw new Error('expected an svg string from pintora, got a buffer')
  }

  // We have to modify the svg a bit to add a view box and make it scale nicely in the center.
  const $ = cheerioLoad(result)
  const svg = $('svg')
  const w = Number.parseInt(svg.prop('width')!)
  const h = Number.parseInt(svg.prop('height')!)
  svg.css({
    width: '100%',
    height: 'auto',
    'margin-left': 'auto',
    'margin-right': 'auto',
    'max-width': `${w * 0.9}px`,
  })
  svg.prop('viewbox', `0 0 ${w + 1} ${h + 1}`)

  // For whatever reason, we cannot theme the actor lines.
  if (diagramType === 'sequenceDiagram') {
    $('g.actor line.actor__line').prop('stroke', palette.text)
    $('g.divider line').prop('stroke', palette.text)
  }

  return $.html()
}
