import config from '@payload-config'
import { getPayload as getPayloadBase } from 'payload'

let cached: Awaited<ReturnType<typeof getPayloadBase>> | null = null
let initError: Error | null = null

export async function getPayload() {
  if (cached) return cached
  if (initError) throw initError

  try {
    cached = await getPayloadBase({ config })
    return cached
  } catch (err) {
    initError = err instanceof Error ? err : new Error(String(err))
    throw initError
  }
}
