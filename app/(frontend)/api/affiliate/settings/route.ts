import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from '@/lib/payload'

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if ((user as { role?: string }).role !== 'affiliate') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const affiliateRaw = (user as { affiliate?: { id?: string } | string }).affiliate
    if (!affiliateRaw) {
      return NextResponse.json({ error: 'No affiliate profile linked to this account' }, { status: 400 })
    }

    const affiliateId =
      typeof affiliateRaw === 'object' ? (affiliateRaw as { id: string }).id : affiliateRaw

    const body = await req.json()
    const { displayName, payoutEmail, payoutMethod } = body

    // Validate
    if (displayName !== undefined && typeof displayName !== 'string') {
      return NextResponse.json({ error: 'Invalid displayName' }, { status: 400 })
    }
    if (payoutEmail !== undefined && typeof payoutEmail !== 'string') {
      return NextResponse.json({ error: 'Invalid payoutEmail' }, { status: 400 })
    }
    if (payoutMethod !== undefined && typeof payoutMethod !== 'string') {
      return NextResponse.json({ error: 'Invalid payoutMethod' }, { status: 400 })
    }

    const data: Record<string, string> = {}
    if (displayName !== undefined) data.displayName = displayName.trim()
    if (payoutEmail !== undefined) data.payoutEmail = payoutEmail.trim()
    if (payoutMethod !== undefined) data.payoutMethod = payoutMethod

    const updated = await payload.update({
      collection: 'affiliates',
      id: affiliateId as string,
      data,
      overrideAccess: false,
      user,
    })

    return NextResponse.json({ success: true, affiliate: updated })
  } catch (err) {
    console.error('[affiliate/settings PATCH]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
