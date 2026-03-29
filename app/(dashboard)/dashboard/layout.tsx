import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import DashboardSidebar from './_components/DashboardSidebar'
import type { Creator } from '@/payload-types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  let creator: Creator | null = null

  try {
    const payload = await getPayload()
    const { user: authUser } = await payload.auth({ headers: await headers() })
    user = authUser

    if (!user) redirect('/login')

    // Fetch linked creator profile
    if (user.creator) {
      const creatorId = typeof user.creator === 'object' ? user.creator.id : user.creator
      const result = await payload.findByID({
        collection: 'creators',
        id: creatorId,
        overrideAccess: true,
      })
      creator = result as Creator
    }
  } catch {
    redirect('/login')
  }

  if (!user) redirect('/login')

  const initials = creator?.avatarInitials ||
    (creator?.displayName
      ? creator.displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
      : (user as { name?: string }).name?.slice(0, 2).toUpperCase() || '??')

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        creatorName={creator?.displayName || (user as { name?: string }).name || 'Creator'}
        creatorInitials={initials}
        creatorGradient={creator?.avatarGradient || undefined}
        verified={creator?.verified || false}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}
