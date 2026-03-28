import config from '@payload-config'
import { getPayload as getPayloadBase } from 'payload'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'

let cached: Awaited<ReturnType<typeof getPayloadBase>> | null = null
let initError: Error | null = null

export async function getPayload() {
  // Skip DB init during Vercel/Next.js build phase — no database available at build time
  if (
    process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD ||
    !process.env.DATABASE_URI && !process.env.DATABASE_URL
  ) {
    throw new Error('[Payload] Skipping DB init — no database connection available')
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
