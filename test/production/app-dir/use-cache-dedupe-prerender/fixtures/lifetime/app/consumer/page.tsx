import { Suspense } from 'react'
import { readShortLived } from '../../cache'
import { data } from '../../data'

async function waitForLookup() {
  'use cache'
  await data('wait:lookup:short-lived:shared')
}

async function releaseLookup() {
  'use cache'
  await data('join-ready')
}

async function readIndependent() {
  'use cache'
  return data('independent')
}

async function readCachedMessage(value: string) {
  'use cache'
  await data('cached-message')
  return `message: ${value}`
}

async function Consumer() {
  await waitForLookup()
  const shortLived = readShortLived('shared')
  const independent = readIndependent()
  const [value] = await Promise.all([
    Promise.race([shortLived, independent]),
    releaseLookup(),
  ])
  return <p id="cached-message">{await readCachedMessage(value)}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p id="consumer-pending">Loading consumer</p>}>
      <Consumer />
    </Suspense>
  )
}
