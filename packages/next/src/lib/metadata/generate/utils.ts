function resolveArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}

function resolveAsArrayOrUndefined<T>(
  value: T | T[] | undefined | null
): T extends undefined | null ? undefined : T[]
function resolveAsArrayOrUndefined<T>(
  value: T | T[] | undefined | null
): T[] | undefined {
  if (typeof value === 'undefined' || value === null) {
    return undefined
  }
  return resolveArray(value)
}

function getOrigin(url: string | URL): string | undefined {
  let origin = undefined
  if (typeof url === 'string') {
    try {
      url = new URL(url)
      origin = url.origin
    } catch {}
  }
  return origin
}

export { resolveAsArrayOrUndefined, resolveArray, getOrigin }
