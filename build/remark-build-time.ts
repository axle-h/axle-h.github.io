/**
 * Remark transforms that resolve build-time-only MDX components.
 *
 * These run inside Vite's Node process during MDX compilation, so they can use Node-only
 * renderers. Each rewrites the authored element to a dumb presentational one carrying pre-rendered
 * markup, which keeps `@pintora/cli`, `cheerio` and `katex` out of the browser bundle entirely.
 */
import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx'
import katex from 'katex'
import { renderDiagram } from './pintora.ts'
import { readTemplateAttribute, stringExpressionAttribute } from './mdx-jsx.ts'

/** `<PintoraDiagram src={`…`}/>` -> `<PintoraDiagramSvg light={"…"} dark={"…"}/>` */
export function remarkPintora() {
  return async function transform(tree: Root) {
    const jobs: Promise<void>[] = []

    // visit() is synchronous, so collect the work and await it afterwards. Safe because the jobs
    // only mutate node fields, never the shape of the tree.
    visit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElement) => {
      if (node.name !== 'PintoraDiagram') return
      const src = readTemplateAttribute(node, 'src')
      jobs.push(
        Promise.all([
          renderDiagram(src, 'light'),
          renderDiagram(src, 'dark'),
        ]).then(([light, dark]) => {
          node.name = 'PintoraDiagramSvg'
          node.attributes = [
            stringExpressionAttribute('light', light),
            stringExpressionAttribute('dark', dark),
          ]
          node.children = []
        })
      )
    })

    await Promise.all(jobs)
  }
}

/** `<Latex src={`…`}/>` -> `<LatexHtml html={"…"}/>`, dropping ~270KB of katex from the client. */
export function remarkLatex() {
  return function transform(tree: Root) {
    visit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElement) => {
      if (node.name !== 'Latex') return
      const src = readTemplateAttribute(node, 'src')
      const html = katex.renderToString(src, { throwOnError: false })
      node.name = 'LatexHtml'
      node.attributes = [stringExpressionAttribute('html', html)]
      node.children = []
    })
  }
}
