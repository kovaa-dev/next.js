// @ts-check

/**
 * @typedef {object} WriteFailureState
 * @property {string} id
 * @property {string[]} startedLanguages
 * @property {string[]} generatedLanguages
 * @property {string[]} failedLanguages
 * @property {string[]} storedLanguages
 * @property {Promise<void> | null} pendingFill
 * @property {(() => void) | null} releaseFill
 */

/**
 * @type {typeof globalThis & { writeFailureState?: WriteFailureState }}
 */
const reference = globalThis

module.exports = reference.writeFailureState ??= {
  id: '',
  startedLanguages: [],
  generatedLanguages: [],
  failedLanguages: [],
  storedLanguages: [],
  pendingFill: null,
  releaseFill: null,
}
