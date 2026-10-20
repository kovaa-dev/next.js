import type { NodePath, types } from 'next/dist/compiled/babel/core'
import type { PluginObj } from 'next/dist/compiled/babel/core'

export default function NextPageDisallowReExportAllExports(): PluginObj<any> {
  return {
    visitor: {
      ExportAllDeclaration(path: NodePath<types.ExportAllDeclaration>) {
        const err = Object.assign(
          new SyntaxError(
            `Using \`export * from '...'\` in a page is disallowed. Please use \`export { default } from '...'\` instead.\n` +
              `Read more: https://nextjs.org/docs/messages/export-all-in-page`
          ),
          {
            code: 'BABEL_PARSE_ERROR',
            loc: path.node.loc?.start ?? path.node.loc?.end ?? path.node.loc,
          }
        )
        throw err
      },
    },
  }
}
