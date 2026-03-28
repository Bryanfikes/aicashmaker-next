import config from '@payload-config'
import { getPayload as getPayloadBase } from 'payload'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'

let cached: Awaited<ReturnType<typeof getPayloadBase>> | null = null
let initError: Error | null = null

export async function getPayload() {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    throw new Error('[Payload] Skipping DB init during build phase')
  }
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
