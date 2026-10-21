import { connection } from 'next/server'
import { getData } from '../data'
import cacheLookups from '../../../cache-lookups'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  await connection()
  const { id } = await searchParams

  const pendingData = id === undefined ? getData() : getData(id)
  cacheLookups.startedRoutes.push(id === undefined ? 'b' : `b:${id}`)

  return <p id="data">{await pendingData}</p>
}
