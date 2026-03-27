import { getPayload } from '@/lib/payload'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const creatorId = typeof body.creatorId === 'string' ? body.creatorId : ''
  if (!creatorId) return NextResponse.json({ error: 'creatorId required' }, { status: 400 })

  try {
    const payload = await getPayload()

    const creator = await payload.findByID({
      collection: 'creators',
      id: creatorId,
      overrideAccess: true,
    }) as { stripeAccountId?: string; payoutEmail?: string; displayName?: string } | null

    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 })

    let stripeAccountId = creator.stripeAccountId

    // Create Stripe Connect account if not already onboarded
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: creator.payoutEmail,
        capabilities: {
          transfers: { requested: true },
        },
      })
      stripeAccountId = account.id

      await payload.update({
        collection: 'creators',
        id: creatorId,
        data: { stripeAccountId },
        overrideAccess: true,
      })
    }

    // Generate onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${SITE_URL}/dashboard/creator/connect?refresh=true`,
      return_url: `${SITE_URL}/dashboard/creator/connect?success=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (err) {
    console.error('[StripeConnect] Onboard error:', err)
    return NextResponse.json({ error: 'Onboarding failed' }, { status: 500 })
  }
}
