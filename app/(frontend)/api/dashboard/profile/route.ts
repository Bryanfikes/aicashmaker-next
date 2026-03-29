import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function PATCH(request: Request) {
  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { creatorId, displayName, handle, bio, websiteUrl, twitterHandle, payoutEmail } = body

    if (!creatorId) {
      return NextResponse.json({ error: 'Missing creatorId' }, { status: 400 })
    }

    // Ensure the user owns this creator profile
    const linkedId = typeof user.creator === 'object' ? user.creator?.id : user.creator
    if (String(linkedId) !== String(creatorId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await payload.update({
      collection: 'creators',
      id: creatorId,
      overrideAccess: true,
      data: {
        displayName,
        handle,
        bio,
        websiteUrl: websiteUrl || null,
        twitterHandle: twitterHandle || null,
        payoutEmail: payoutEmail || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[profile/route]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
