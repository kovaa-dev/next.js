import { revalidatePath, revalidateTag } from 'next/cache'
import { connection } from 'next/server'
import cacheLookups from '../../cache-lookups'

export async function GET(request: Request) {
  await connection()

  const id = new URL(request.url).searchParams.get('id')
  if (id !== null) {
    return Response.json({
      startedRoutes: cacheLookups.startedRoutes,
      fills: cacheLookups.fills.filter((key) => key === id),
      writes: cacheLookups.writes.filter(
        (tag) => tag === `observed-fill:${id}`
      ),
      misses: cacheLookups.misses.filter((key) =>
        key.includes(JSON.stringify(id))
      ),
    })
  }

  return Response.json({
    softTags: cacheLookups.softTags,
    startedRoutes: cacheLookups.startedRoutes,
  })
}

export async function POST(request: Request) {
  switch (await request.text()) {
    case 'revalidate':
      revalidatePath('/path-revalidation/b')
      break
    case 'invalidate-entry': {
      const id = new URL(request.url).searchParams.get('id')
      if (id === null) {
        return new Response(null, { status: 400 })
      }
      revalidateTag(`observed-fill:${id}`, { expire: 0 })
      break
    }
    case 'hold-fill':
      cacheLookups.pendingFill = new Promise((resolve) => {
        cacheLookups.releaseFill = resolve
      })
      break
    case 'release-fill':
      cacheLookups.releaseFill?.()
      cacheLookups.pendingFill = null
      cacheLookups.releaseFill = null
      break
    case 'hold-miss':
      cacheLookups.pendingMiss = new Promise((resolve) => {
        cacheLookups.releaseMiss = resolve
      })
      break
    case 'release-miss':
      cacheLookups.releaseMiss?.()
      cacheLookups.pendingMiss = null
      cacheLookups.releaseMiss = null
      break
    case 'hold':
      cacheLookups.softTags.length = 0
      cacheLookups.startedRoutes.length = 0
      cacheLookups.pendingLookup = new Promise((resolve) => {
        cacheLookups.releaseLookup = resolve
      })
      break
    case 'release':
      cacheLookups.releaseLookup?.()
      cacheLookups.releaseLookup = null
      cacheLookups.pendingLookup = null
      break
    default:
      return new Response(null, { status: 400 })
  }

  return new Response(null, { status: 204 })
}
