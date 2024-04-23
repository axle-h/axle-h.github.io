import { render as renderPintora } from '@pintora/cli'
import { Box, Image } from '@chakra-ui/react'
import { load as cheerioLoad } from 'cheerio'

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

type DiagramType = 'componentDiagram' | 'sequenceDiagram'

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
}

export async function ThemedPintoraDiagram({
  src,
  isDark = false,
}: {
  src: string
  isDark?: boolean
}) {
  const diagramType = src
    .split('\n')
    .find((line) => line.trim() !== '')
    ?.trim()

  if (!diagramType || !(diagramType in themes)) {
    throw new Error(`unknown diagram type ${diagramType}`)
  }


  const palette = isDark ? palettes.dark : palettes.light
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
  const displayProps = {
    display: isDark ? 'none' : 'block',
    _dark: { display: isDark ? 'block' : 'none' },
    w: '100%',
    h: 'auto',
    my: 8
  }

  if (Buffer.isBuffer(result))
    return (
      <Image
        {...displayProps}
        src={`data:image/png;base64, ${result.toString('base64')}`}
      />
    )

  // we have to modify the svg a bit to add a view box and make it scale nicely in the center
  // there's probably a better way to do this than parsing the html, but we need the dimensions for the view box anyway
  const $ = cheerioLoad(result)
  const svg = $('svg')
  const w = parseInt(svg.prop('width'))
  const h = parseInt(svg.prop('height'))
  svg.css({
    width: '100%',
    height: 'auto',
    'margin-left': 'auto',
    'margin-right': 'auto',
    'max-width': `${w * 0.9}px`,
  })
  svg.prop('viewbox', `0 0 ${w + 1} ${h + 1}`)

  // for whatever reason, we cannot theme the actor lines
  if (diagramType === 'sequenceDiagram') {
    $('g.actor line.actor__line').prop('stroke', palette.text)
    $('g.divider line').prop('stroke', palette.text)
  }

  return (
    <Box {...displayProps} dangerouslySetInnerHTML={{ __html: $.html() }} />
  )
}

export async function PintoraDiagram({ src }: { src: string }) {
  return (
    <>
      <ThemedPintoraDiagram src={src} />
      <ThemedPintoraDiagram src={src} isDark />
    </>
  )
}
