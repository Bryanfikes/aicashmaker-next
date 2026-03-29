import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import type { Creator } from '@/payload-types'
import ProfileForm from './_components/ProfileForm'

export const metadata = { title: 'Profile' }

export default async function DashboardProfilePage() {
  let creator: Creator | null = null

  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) redirect('/login')

    if (user.creator) {
      const creatorId = typeof user.creator === 'object' ? user.creator.id : user.creator
      creator = await payload.findByID({
        collection: 'creators',
        id: creatorId,
        overrideAccess: true,
      }) as Creator
    }
  } catch {
    redirect('/login')
  }

  if (!creator) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Profile</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your public creator profile.</p>
        </div>
        <div className="p-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center max-w-md">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="font-extrabold tracking-tight text-slate-900 text-sm">No creator profile found</p>
            <p className="text-slate-400 text-xs mt-2">Contact support to set up your creator profile.</p>
          </div>
        </div>
      </div>
    )
  }

  const initials = creator.avatarInitials ||
    creator.displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Gradient header strip */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Update your public creator profile.</p>
      </div>

      <div className="p-8">
        <div className="max-w-2xl">
          {/* Avatar preview card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold shrink-0"
                style={{ background: creator.avatarGradient || 'linear-gradient(135deg,#0ea5e9,#0284c7)' }}
              >
                {initials}
              </div>
              <div>
                <p className="font-extrabold tracking-tight text-slate-900">{creator.displayName}</p>
                <p className="text-sm text-slate-500 mt-0.5">@{creator.handle}</p>
                {creator.verified && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 mt-2">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified creator
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-extrabold tracking-tight text-slate-900 mb-6">Edit profile</h2>
            <ProfileForm
              creator={{
                id: creator.id,
                displayName: creator.displayName,
                handle: creator.handle,
                bio: creator.bio,
                websiteUrl: creator.websiteUrl || undefined,
                twitterHandle: creator.twitterHandle || undefined,
                payoutEmail: creator.payoutEmail || undefined,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
