import { cacheLife, cacheTag } from 'next/cache'
import cacheLookups from '../../cache-lookups'

export async function getData(id?: string) {
  'use cache: route-aware'

  cacheLife('hours')
  cacheTag('path-revalidation')

  if (id !== undefined) {
    cacheTag(`observed-fill:${id}`)
    cacheLookups.fills.push(id)
    await cacheLookups.pendingFill
  }

  return Math.random()
}
