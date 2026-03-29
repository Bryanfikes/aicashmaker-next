import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import AccountSettingsForm from './_components/AccountSettingsForm'

export const metadata = {
  title: 'Settings',
}

export default async function SettingsPage() {
  let user = null

  try {
    const payload = await getPayload()
    const { user: authUser } = await payload.auth({ headers: await headers() })
    user = authUser

    if (!user) redirect('/login')
  } catch {
    redirect('/login')
  }

  if (!user) redirect('/login')

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Gradient page header */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your profile and security preferences</p>
      </div>

      <div className="p-8 flex-1">
        <div className="max-w-lg">
          <AccountSettingsForm
            userId={String(user.id)}
            initialName={(user as { name?: string }).name || ''}
            email={(user as { email: string }).email}
          />
        </div>
      </div>
    </div>
  )
}
