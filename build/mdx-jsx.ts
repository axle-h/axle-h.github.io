/**
 * Helpers for reading and rewriting MDX JSX elements during remark transforms.
 *
 * Both `<PintoraDiagram src={`…`}/>` and `<Latex src={`…`}/>` are resolved at build time, and both
 * carry their payload as a template literal attribute, so they share this extraction.
 */
import type { MdxJsxFlowElement, MdxJsxAttribute } from 'mdast-util-mdx-jsx'

/** Reads a `name={`…`}` or `name="…"` attribute as a plain string. Throws if it isn't static. */
export function readTemplateAttribute(
  node: MdxJsxFlowElement,
  name: string
): string {
  const attr = node.attributes.find(
    (a): a is MdxJsxAttribute => a.type === 'mdxJsxAttribute' && a.name === name
  )
  if (!attr || attr.value === null || attr.value === undefined) {
    throw new Error(`<${node.name}> requires a ${name} attribute`)
  }
  if (typeof attr.value === 'string') {
    return attr.value
  }

  const statement = attr.value.data?.estree?.body[0]
  if (!statement || statement.type !== 'ExpressionStatement') {
    throw new Error(`<${node.name} ${name}> must be a single expression`)
  }
  const expression = statement.expression

  if (expression.type === 'TemplateLiteral') {
    if (expression.expressions.length > 0) {
      throw new Error(
        `<${node.name} ${name}> cannot contain \${interpolation} — it is resolved at build time`
      )
    }
    return expression.quasis.map((q) => q.value.cooked ?? q.value.raw).join('')
  }
  if (expression.type === 'Literal' && typeof expression.value === 'string') {
    return expression.value
  }
  throw new Error(
    `<${node.name} ${name}> must be a template literal or string literal`
  )
}

/**
 * Builds `name={"…"}` — an *expression* attribute holding a JS string literal.
 *
 * Deliberately not a plain `name="…"` string attribute: the values here are raw SVG and KaTeX
 * markup, full of quotes and newlines, and the expression form is serialised by
 * estree-util-to-js as a proper JS string literal.
 */
export function stringExpressionAttribute(
  name: string,
  value: string
): MdxJsxAttribute {
  const raw = JSON.stringify(value)
  return {
    type: 'mdxJsxAttribute',
    name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: raw,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          comments: [],
          body: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Literal', value, raw },
            },
          ],
        },
      },
    },
  }
}
