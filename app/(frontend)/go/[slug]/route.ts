import { getPayload } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  try {
    const payload = await getPayload()

    const result = await payload.find({
      collection: 'tools',
      where: { slug: { equals: slug }, published: { equals: true } },
      limit: 1,
      depth: 0,
    })

    if (result.totalDocs === 0) {
      return NextResponse.redirect(new URL('/tools', request.url))
    }

    const tool = result.docs[0] as { affiliateLink?: string; name?: string }
    const affiliateLink = tool.affiliateLink

    if (!affiliateLink) {
      return NextResponse.redirect(new URL('/tools', request.url))
    }

    // TODO Phase 5: log click to affiliate_clicks table for analytics
    console.log(`[AffiliateClick] ${slug} → ${affiliateLink}`)

    return NextResponse.redirect(affiliateLink, { status: 301 })
  } catch (err) {
    console.error('[AffiliateClick] Error:', err)
    return NextResponse.redirect(new URL('/tools', request.url))
  }
}
