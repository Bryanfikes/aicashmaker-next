import { getPayload } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : undefined
  const interest = typeof body.interest === 'string' ? body.interest : undefined
  const source = typeof body.source === 'string' ? body.source : 'homepage'

  try {
    const payload = await getPayload()

    // Check for existing subscriber
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs > 0) {
      const sub = existing.docs[0] as { unsubscribed?: boolean }
      if (sub.unsubscribed) {
        // Re-subscribe
        await payload.update({
          collection: 'newsletter-subscribers',
          id: existing.docs[0].id as string,
          data: { unsubscribed: false, unsubscribedAt: null, confirmed: false },
          overrideAccess: true,
        })
        return NextResponse.json({ success: true, status: 'resubscribed' })
      }
      return NextResponse.json({ success: true, status: 'already_subscribed' })
    }

    await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        email,
        ...(firstName && { firstName }),
        ...(interest && { interest }),
        source,
        confirmed: false,
        subscribedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    // TODO: send double opt-in email via Resend when email is configured
    console.log(`[Newsletter] New subscriber: ${email}`)

    return NextResponse.json({ success: true, status: 'subscribed' })
  } catch (err) {
    console.error('[Newsletter] Subscribe error:', err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
