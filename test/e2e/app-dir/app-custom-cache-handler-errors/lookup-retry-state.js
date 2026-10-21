// @ts-check

/**
 * @typedef {object} LookupRetryState
 * @property {string} id
 * @property {boolean} failNextLookup
 * @property {number} lookupCount
 * @property {boolean} writeStarted
 * @property {boolean} writeCompleted
 * @property {boolean} requestCompleted
 * @property {Promise<void> | null} pendingWrite
 * @property {(() => void) | null} releaseWrite
 */

/**
 * @type {typeof globalThis & { lookupRetryState?: LookupRetryState }}
 */
const reference = globalThis

module.exports = reference.lookupRetryState ??= {
  id: '',
  failNextLookup: false,
  lookupCount: 0,
  writeStarted: false,
  writeCompleted: false,
  requestCompleted: false,
  pendingWrite: null,
  releaseWrite: null,
}
