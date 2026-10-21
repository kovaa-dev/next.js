// @ts-check

/**
 * @typedef {object} CacheLookups
 * @property {string[][]} softTags
 * @property {string[]} startedRoutes
 * @property {Promise<void> | null} pendingLookup
 * @property {(() => void) | null} releaseLookup
 * @property {string[]} fills
 * @property {string[]} writes
 * @property {string[]} misses
 * @property {Promise<void> | null} pendingFill
 * @property {(() => void) | null} releaseFill
 * @property {Promise<void> | null} pendingMiss
 * @property {(() => void) | null} releaseMiss
 */

/**
 * @type {typeof globalThis & { cacheLookups?: CacheLookups }}
 */
const reference = globalThis

module.exports = reference.cacheLookups ??= {
  softTags: [],
  startedRoutes: [],
  pendingLookup: null,
  releaseLookup: null,
  fills: [],
  writes: [],
  misses: [],
  pendingFill: null,
  releaseFill: null,
  pendingMiss: null,
  releaseMiss: null,
}
