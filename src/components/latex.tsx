import 'katex/dist/katex.css'
import { Box } from '@chakra-ui/react'

/** Renders KaTeX markup already produced at build time by `remarkLatex`. */
export function LatexHtml({ html }: { html: string }) {
  return (
    <Box className="katex" dangerouslySetInnerHTML={{ __html: html }} mb={3} />
  )
}

/** Tripwire — see the note on PintoraDiagram. */
export function Latex(): never {
  throw new Error(
    'Latex must be replaced at build time by remarkLatex — is the plugin registered?'
  )
}
