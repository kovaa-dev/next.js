import { cacheLife, cacheTag } from 'next/cache'
import { lang } from 'next/root-params'
import { connection } from 'next/server'
import state from '../../../../write-failure-state'

async function readData(id: string) {
  'use cache'
  cacheLife('hours')
  const language = await lang()
  cacheTag(`write-failure:${id}`, `write-failure-language:${language}`)
  state.generatedLanguages.push(language)
  await state.pendingFill
  return `${language}:${crypto.randomUUID()}`
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string; lang: string }>
  searchParams: Promise<{ id?: string | string[] }>
}) {
  await connection()
  const { id } = await searchParams
  if (id === undefined) {
    return null
  }
  if (typeof id !== 'string') {
    throw new Error('Expected a single id search parameter')
  }
  const { lang: language } = await params
  state.startedLanguages.push(language)
  return <p id="value">{await readData(id)}</p>
}
