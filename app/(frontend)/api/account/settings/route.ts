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
    const { name, currentPassword, newPassword } = body

    // Password change flow
    if (currentPassword !== undefined && newPassword !== undefined) {
      // Verify current password by attempting a login
      let loginValid = false
      try {
        const result = await payload.login({
          collection: 'users',
          data: {
            email: (user as { email: string }).email,
            password: currentPassword,
          },
        })
        loginValid = !!result.user
      } catch {
        loginValid = false
      }

      if (!loginValid) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
      }

      await payload.update({
        collection: 'users',
        id: user.id,
        overrideAccess: true,
        data: {
          password: newPassword,
        },
      })

      return NextResponse.json({ success: true })
    }

    // Profile name update
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
      }

      await payload.update({
        collection: 'users',
        id: user.id,
        overrideAccess: true,
        data: {
          name: name.trim(),
        },
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
  } catch (err) {
    console.error('[account/settings/route]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
