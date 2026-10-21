// @ts-check

const cacheHandler = require('./handler')
const cacheLookups = require('./cache-lookups')
const defaultCacheHandler =
  require('next/dist/server/lib/cache-handlers/default.external').default

/**
 * @type {import('next/cache').CacheHandler}
 */
const routeAwareCacheHandler = {
  ...cacheHandler,

  async get(cacheKey, softTags) {
    const entry = await cacheHandler.get(cacheKey, softTags)
    if (
      cacheKey.includes('observed-miss-') &&
      softTags.some((tag) => tag.includes('/path-revalidation/b')) &&
      cacheLookups.pendingMiss !== null
    ) {
      cacheLookups.misses.push(cacheKey)
      await cacheLookups.pendingMiss
    }
    if (entry === undefined) {
      return undefined
    }

    if (entry.tags.includes('path-revalidation')) {
      cacheLookups.softTags.push([...softTags])
      await cacheLookups.pendingLookup
    }

    const expiration = await cacheHandler.getExpiration(softTags)
    if (entry.timestamp <= expiration) {
      await entry.value.cancel()
      return undefined
    }

    return entry
  },

  async set(cacheKey, pendingEntry) {
    const { tags } = await pendingEntry
    await cacheHandler.set(cacheKey, pendingEntry)
    for (const tag of tags) {
      if (tag.startsWith('observed-fill:')) {
        cacheLookups.writes.push(tag)
      }
    }
  },

  async getExpiration() {
    // This handler checks implicit tags in get(), so Next.js must use that
    // result for each route.
    return Infinity
  },

  async refreshTags() {
    return defaultCacheHandler.refreshTags()
  },

  async updateTags(tags) {
    return defaultCacheHandler.updateTags(tags)
  },
}

module.exports = routeAwareCacheHandler
