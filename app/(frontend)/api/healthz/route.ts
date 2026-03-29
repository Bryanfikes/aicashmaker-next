import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result: Record<string, unknown> = {
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'missing',
      DATABASE_URI: process.env.DATABASE_URI ? 'set' : 'missing',
      PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ? 'set' : 'missing',
      NODE_ENV: process.env.NODE_ENV,
    },
  }

  try {
    const payload = await getPayload()
    // Quick sanity check
    await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
    result.payload = 'ok'
  } catch (err) {
    result.payload = 'error'
    result.error = String(err)
    result.stack = err instanceof Error ? err.stack?.split('\n').slice(0, 6).join('\n') : undefined
  }

  return NextResponse.json(result, {
    status: result.payload === 'ok' ? 200 : 500,
  })
}
