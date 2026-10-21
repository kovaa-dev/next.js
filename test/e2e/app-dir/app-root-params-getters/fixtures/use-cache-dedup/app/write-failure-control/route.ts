import { connection } from 'next/server'
import state from '../../write-failure-state'

export async function GET() {
  await connection()
  return Response.json({
    startedLanguages: state.startedLanguages,
    generatedLanguages: state.generatedLanguages,
    failedLanguages: state.failedLanguages,
    storedLanguages: state.storedLanguages,
  })
}

export async function POST(request: Request) {
  switch (await request.text()) {
    case 'hold': {
      const id = new URL(request.url).searchParams.get('id')
      if (id === null) {
        return new Response(null, { status: 400 })
      }
      state.id = id
      state.startedLanguages = []
      state.generatedLanguages = []
      state.failedLanguages = []
      state.storedLanguages = []
      state.pendingFill = new Promise((resolve) => {
        state.releaseFill = resolve
      })
      break
    }
    case 'release':
      state.releaseFill?.()
      state.releaseFill = null
      state.pendingFill = null
      break
    default:
      return new Response(null, { status: 400 })
  }
  return new Response(null, { status: 204 })
}
