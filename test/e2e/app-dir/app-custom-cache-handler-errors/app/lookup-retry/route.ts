import { cacheLife, cacheTag } from 'next/cache'
import { connection } from 'next/server'
import state from '../../lookup-retry-state'

async function getData(id: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`lookup-retry:${id}`)
  return Math.random()
}

export async function GET(request: Request) {
  await connection()
  if (new URL(request.url).searchParams.has('state')) {
    return Response.json({
      lookupCount: state.lookupCount,
      writeStarted: state.writeStarted,
      writeCompleted: state.writeCompleted,
      requestCompleted: state.requestCompleted,
    })
  }
  const id = new URL(request.url).searchParams.get('id')
  if (id === null) {
    return new Response(null, { status: 400 })
  }
  const results = await Promise.allSettled([getData(id), getData(id)])
  const first = await getData(id)
  const second = await getData(id)
  state.requestCompleted = true
  return Response.json({
    failures: results.map((result) =>
      result.status === 'rejected' ? result.reason.message : 'fulfilled'
    ),
    first,
    second,
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
      state.failNextLookup = true
      state.lookupCount = 0
      state.writeStarted = false
      state.writeCompleted = false
      state.requestCompleted = false
      state.pendingWrite = new Promise((resolve) => {
        state.releaseWrite = resolve
      })
      break
    }
    case 'release':
      state.releaseWrite?.()
      state.releaseWrite = null
      state.pendingWrite = null
      break
    default:
      return new Response(null, { status: 400 })
  }
  return new Response(null, { status: 204 })
}
