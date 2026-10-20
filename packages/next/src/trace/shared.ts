import { randomBytes } from 'node:crypto'

declare global {
  /** @internal */
  var _traceGlobals: Map<any, any> | undefined
}

let _traceGlobals: Map<any, any> | undefined = global._traceGlobals

if (!_traceGlobals) {
  _traceGlobals = new Map()
}
global._traceGlobals = _traceGlobals

export const traceGlobals: Map<any, any> = _traceGlobals
export const setGlobal = (key: any, val: any) => {
  traceGlobals.set(key, val)
}

export const traceId =
  process.env.TRACE_ID ||
  process.env.NEXT_PRIVATE_TRACE_ID ||
  randomBytes(8).toString('hex')
