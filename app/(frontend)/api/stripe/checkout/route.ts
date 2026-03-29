import { getPayload } from '@/lib/payload'
import { stripe, ADVERTISING_PACKAGES, PLATFORM_FEE_PERCENT, type AdvertisingPackageId } from '@/lib/stripe'
import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

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

  const type = typeof body.type === 'string' ? body.type : ''

  // Read affiliate referral code from cookie (set by middleware on ?ref= visits)
  const cookieStore = await cookies()
  const affiliateRef = cookieStore.get('affiliate_ref')?.value || ''

  // Identify logged-in buyer for order linking
  let buyerId: string | undefined
  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await headers() })
    if (user) buyerId = String(user.id)
  } catch {
    // Not authenticated — no buyer link
  }

  try {
    // --- PRODUCT PURCHASE ---
    if (type === 'product') {
      const productId = typeof body.productId === 'string' ? body.productId : ''
      if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })

      const payload = await getPayload()
      const productDoc = await payload.findByID({
        collection: 'products',
        id: productId,
        depth: 1,
        overrideAccess: true,
      })

      if (!productDoc || !productDoc.approved) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      const product = productDoc as {
        id: string
        name: string
        tagline: string
        price: number
        stripePriceId?: string
        creator?: { stripeAccountId?: string } | string
      }

      const priceInCents = Math.round(product.price * 100)
      const applicationFee = Math.round(priceInCents * (PLATFORM_FEE_PERCENT / 100))

      const creator = typeof product.creator === 'object' ? product.creator : null
      const creatorStripeAccount = creator?.stripeAccountId

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: priceInCents,
              product_data: {
                name: product.name,
                description: product.tagline,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orderType: 'product',
          productId: product.id,
          ...(affiliateRef ? { affiliateCode: affiliateRef } : {}),
          ...(buyerId ? { buyerId } : {}),
        },
        success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_URL}/marketplace`,
      }

      // Use Stripe Connect if creator has a connected account
      if (creatorStripeAccount) {
        sessionParams.payment_intent_data = {
          application_fee_amount: applicationFee,
          transfer_data: { destination: creatorStripeAccount },
        }
      }

      const session = await stripe.checkout.sessions.create(sessionParams)
      return NextResponse.json({ url: session.url })
    }

    // --- ADVERTISING PURCHASE ---
    if (type === 'advertising') {
      const packageId = typeof body.packageId === 'string' ? body.packageId as AdvertisingPackageId : null
      if (!packageId || !ADVERTISING_PACKAGES[packageId]) {
        return NextResponse.json({ error: 'Invalid advertising package' }, { status: 400 })
      }

      const pkg = ADVERTISING_PACKAGES[packageId]
      const companyName = typeof body.companyName === 'string' ? body.companyName.trim() : ''
      const websiteUrl = typeof body.websiteUrl === 'string' ? body.websiteUrl.trim() : ''
      const email = typeof body.email === 'string' ? body.email.trim() : ''

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: pkg.interval ? 'subscription' : 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: pkg.price,
              product_data: {
                name: pkg.name,
                description: pkg.description,
              },
              ...(pkg.interval
                ? { recurring: { interval: pkg.interval } }
                : {}),
            },
            quantity: 1,
          },
        ],
        metadata: {
          orderType: packageId,
          companyName,
          websiteUrl,
          ...(buyerId ? { buyerId } : {}),
        },
        ...(email ? { customer_email: email } : {}),
        success_url: `${SITE_URL}/advertise/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_URL}/advertise`,
      }

      const session = await stripe.checkout.sessions.create(sessionParams)
      return NextResponse.json({ url: session.url })
    }

    return NextResponse.json({ error: 'Invalid checkout type' }, { status: 400 })
  } catch (err) {
    console.error('[StripeCheckout] Error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
