// @ts-check

const cacheHandler = require('./throwing-cache-handler')
const state = require('./lookup-retry-state')

/**
 * @type {import('next/cache').CacheHandler}
 */
module.exports = {
  ...cacheHandler,
  async get(cacheKey, softTags) {
    if (state.id !== '' && cacheKey.includes(JSON.stringify(state.id))) {
      state.lookupCount++
      if (state.failNextLookup) {
        state.failNextLookup = false
        throw new Error('expected cache lookup failure')
      }
    }
    return cacheHandler.get(cacheKey)
  },
  async set(cacheKey, pendingEntry) {
    const entry = await pendingEntry
    if (!entry.tags.includes(`lookup-retry:${state.id}`)) {
      return cacheHandler.set(cacheKey, pendingEntry)
    }
    state.writeStarted = true
    await state.pendingWrite
    await cacheHandler.set(cacheKey, pendingEntry)
    state.writeCompleted = true
  },
}
