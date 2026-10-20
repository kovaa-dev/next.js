import type { NodePath, types } from 'next/dist/compiled/babel/core'
import type { PluginObj } from 'next/dist/compiled/babel/core'

export default function NextPageDisallowReExportAllExports(): PluginObj<any> {
  return {
    visitor: {
      ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
        if (
          [
            '@next/font/local',
            '@next/font/google',
            'next/font/local',
            'next/font/google',
          ].includes(path.node.source.value)
        ) {
          const err = Object.assign(
            new SyntaxError(
              `"next/font" requires SWC although Babel is being used due to a custom babel config being present.\nRead more: https://nextjs.org/docs/messages/babel-font-loader-conflict`
            ),
            {
              code: 'BABEL_PARSE_ERROR',
              loc: path.node.loc?.start ?? path.node.loc?.end ?? path.node.loc,
            }
          )
          throw err
        }
      },
    },
  }
}
