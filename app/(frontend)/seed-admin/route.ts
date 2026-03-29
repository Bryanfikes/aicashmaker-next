import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

// One-time admin seeder — remove this file after creating your admin account
export async function POST(request: Request) {
  const secret = request.headers.get('x-seed-secret')
  if (secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { email, password, name } = await request.json()
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'email, password and name are required' }, { status: 400 })
    }

    const payload = await getPayload()

    // Check if any users exist
    const existing = await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
    if (existing.totalDocs > 0) {
      return NextResponse.json({ error: 'Users already exist — use /admin/login' }, { status: 409 })
    }

    const user = await payload.create({
      collection: 'users',
      data: { email, password, name, role: 'super-admin' },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, id: user.id, email: user.email })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
