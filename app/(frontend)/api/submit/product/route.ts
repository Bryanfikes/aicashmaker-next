import { getPayload } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const productName = typeof body.productName === 'string' ? body.productName.trim() : ''
  const type = typeof body.type === 'string' ? body.type : ''
  const creatorName = typeof body.creatorName === 'string' ? body.creatorName.trim() : ''
  const creatorEmail = typeof body.creatorEmail === 'string' ? body.creatorEmail.trim().toLowerCase() : ''
  const description = typeof body.description === 'string' ? body.description.trim() : ''
  const price = typeof body.price === 'number' ? body.price : Number(body.price)

  if (!productName) return NextResponse.json({ error: 'Product name is required' }, { status: 400 })
  if (!type) return NextResponse.json({ error: 'Product type is required' }, { status: 400 })
  if (!creatorName) return NextResponse.json({ error: 'Creator name is required' }, { status: 400 })
  if (!creatorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creatorEmail)) {
    return NextResponse.json({ error: 'Valid creator email is required' }, { status: 400 })
  }
  if (!description) return NextResponse.json({ error: 'Description is required' }, { status: 400 })
  if (!price || price < 5) return NextResponse.json({ error: 'Price must be at least $5' }, { status: 400 })

  // Parse whatsIncluded array
  const whatsIncluded = Array.isArray(body.whatsIncluded)
    ? (body.whatsIncluded as unknown[])
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map(item => ({ item: item.trim() }))
    : []

  try {
    const payload = await getPayload()

    const submission = await payload.create({
      collection: 'product-submissions',
      data: {
        productName,
        type,
        creatorName,
        creatorEmail,
        description,
        price,
        aiPlatform: typeof body.aiPlatform === 'string' ? body.aiPlatform : undefined,
        category: typeof body.category === 'string' ? body.category.trim() : undefined,
        demoUrl: typeof body.demoUrl === 'string' ? body.demoUrl.trim() : undefined,
        payoutEmail: typeof body.payoutEmail === 'string' ? body.payoutEmail.trim().toLowerCase() : undefined,
        payoutMethod: typeof body.payoutMethod === 'string' ? body.payoutMethod : undefined,
        whatsIncluded: whatsIncluded.length > 0 ? whatsIncluded : undefined,
        status: 'pending',
      },
      overrideAccess: true,
    })

    // TODO: send admin notification + creator confirmation via Resend when configured
    console.log(`[ProductSubmission] New submission: ${productName} by ${creatorName} (id: ${submission.id})`)

    return NextResponse.json({ success: true, id: submission.id })
  } catch (err) {
    console.error('[ProductSubmission] Error:', err)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
