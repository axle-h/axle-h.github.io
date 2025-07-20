import 'katex/dist/katex.css'
import katex from 'katex'
import React from 'react'
import { Box } from '@chakra-ui/react'

export function Latex({ src }: { src: string }) {
  const html = katex.renderToString(src, {
    throwOnError: false,
  })
  return (
    <Box className="katex" dangerouslySetInnerHTML={{ __html: html }} mb={3} />
  )
}
