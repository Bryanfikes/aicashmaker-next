import { getPayload } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const toolName = typeof body.toolName === 'string' ? body.toolName.trim() : ''
  const toolUrl = typeof body.toolUrl === 'string' ? body.toolUrl.trim() : ''
  const submitterEmail = typeof body.submitterEmail === 'string' ? body.submitterEmail.trim().toLowerCase() : ''

  if (!toolName) return NextResponse.json({ error: 'Tool name is required' }, { status: 400 })
  if (!toolUrl) return NextResponse.json({ error: 'Tool URL is required' }, { status: 400 })
  if (!submitterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail)) {
    return NextResponse.json({ error: 'Valid submitter email is required' }, { status: 400 })
  }

  try {
    const payload = await getPayload()

    const submission = await payload.create({
      collection: 'tool-submissions',
      data: {
        toolName,
        toolUrl,
        submitterEmail,
        affiliateLink: typeof body.affiliateLink === 'string' ? body.affiliateLink.trim() : undefined,
        category: typeof body.category === 'string' ? body.category : undefined,
        pricingModel: typeof body.pricingModel === 'string' ? body.pricingModel : undefined,
        price: typeof body.price === 'string' ? body.price : undefined,
        shortDescription: typeof body.shortDescription === 'string' ? body.shortDescription.trim() : undefined,
        fullDescription: typeof body.fullDescription === 'string' ? body.fullDescription.trim() : undefined,
        logoUrl: typeof body.logoUrl === 'string' ? body.logoUrl.trim() : undefined,
        submitterName: typeof body.submitterName === 'string' ? body.submitterName.trim() : undefined,
        featuredUpgrade: body.featuredUpgrade === true,
        status: 'pending',
      },
      overrideAccess: true,
    })

    // TODO: send admin notification email via Resend when configured
    console.log(`[ToolSubmission] New submission: ${toolName} from ${submitterEmail} (id: ${submission.id})`)

    return NextResponse.json({ success: true, id: submission.id })
  } catch (err) {
    console.error('[ToolSubmission] Error:', err)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
