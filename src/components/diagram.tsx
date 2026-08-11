import { Box } from '@chakra-ui/react'

/**
 * Renders diagrams that `remarkPintora` already rendered to SVG at build time.
 *
 * Two copies are emitted (light + dark palettes) and toggled by CSS, exactly as before. The SVG
 * stays an opaque HTML string: it carries a lowercase `viewbox` attribute that only survives
 * because the HTML parser corrects SVG attribute casing.
 */
const displayProps = (isDark: boolean) => ({
  display: isDark ? 'none' : 'block',
  _dark: { display: isDark ? 'block' : 'none' },
  w: '100%',
  h: 'auto',
  my: 8,
})

export function PintoraDiagramSvg({
  light,
  dark,
}: {
  light: string
  dark: string
}) {
  return (
    <>
      <Box
        {...displayProps(false)}
        dangerouslySetInnerHTML={{ __html: light }}
      />
      <Box {...displayProps(true)} dangerouslySetInnerHTML={{ __html: dark }} />
    </>
  )
}

/**
 * Tripwire. MDX authors write <PintoraDiagram src={`…`}/>, which remarkPintora rewrites at build
 * time. If this ever actually renders, the remark plugin didn't run — fail loudly rather than
 * silently emitting nothing.
 */
export function PintoraDiagram(): never {
  throw new Error(
    'PintoraDiagram must be replaced at build time by remarkPintora — is the plugin registered?'
  )
}
