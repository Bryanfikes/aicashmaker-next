import { getPayload } from '@/lib/payload'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

// Stripe requires the raw body to verify webhook signatures
export async function POST(request: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[StripeWebhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const rawBody = await request.text()
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[StripeWebhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      }
      case 'checkout.session.expired': {
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session)
        break
      }
      default:
        // Ignore unhandled events
        break
    }
  } catch (err) {
    console.error(`[StripeWebhook] Handler error for ${event.type}:`, err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const payload = await getPayload()
  const metadata = session.metadata ?? {}
  const orderType = metadata.orderType as string
  const amountTotal = session.amount_total ?? 0

  const isProduct = orderType === 'product'
  const platformFee = isProduct ? Math.round(amountTotal * 0.2) : amountTotal
  const creatorPayout = isProduct ? amountTotal - platformFee : 0

  // Upsert order record
  const existing = await payload.find({
    collection: 'orders',
    where: { stripeSessionId: { equals: session.id } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.totalDocs > 0) {
    await payload.update({
      collection: 'orders',
      id: existing.docs[0].id as string,
      data: {
        status: 'paid',
        stripePaymentIntentId: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : undefined,
      },
      overrideAccess: true,
    })
  } else {
    await payload.create({
      collection: 'orders',
      data: {
        orderType: mapOrderType(orderType),
        buyerEmail: session.customer_details?.email ?? '',
        buyerName: session.customer_details?.name ?? undefined,
        product: isProduct ? metadata.productId : undefined,
        amount: amountTotal,
        platformFee,
        creatorPayout,
        status: 'paid',
        stripeSessionId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : undefined,
        advertisingDetails: !isProduct
          ? {
              companyName: metadata.companyName ?? '',
              websiteUrl: metadata.websiteUrl ?? '',
            }
          : undefined,
      },
      overrideAccess: true,
    })
  }

  // Increment product sales count
  if (isProduct && metadata.productId) {
    const product = await payload.findByID({
      collection: 'products',
      id: metadata.productId,
      overrideAccess: true,
    }) as { salesCount?: number } | null

    if (product) {
      await payload.update({
        collection: 'products',
        id: metadata.productId,
        data: { salesCount: (product.salesCount ?? 0) + 1 },
        overrideAccess: true,
      })
    }
  }

  // TODO Phase 5: send download link email to buyer via Resend
  console.log(`[StripeWebhook] Order paid: ${session.id} (${orderType}) — $${(amountTotal / 100).toFixed(2)}`)
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const payload = await getPayload()

  const existing = await payload.find({
    collection: 'orders',
    where: { stripeSessionId: { equals: session.id } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.totalDocs > 0) {
    await payload.update({
      collection: 'orders',
      id: existing.docs[0].id as string,
      data: { status: 'failed' },
      overrideAccess: true,
    })
  }
}

function mapOrderType(raw: string): string {
  const map: Record<string, string> = {
    product: 'product',
    'featured-listing': 'featured-listing',
    'newsletter-sponsorship': 'newsletter-sponsorship',
    'full-review': 'full-review',
    bundle: 'bundle',
  }
  return map[raw] ?? 'product'
}
