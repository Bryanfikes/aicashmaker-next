import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import AccountSidebar from './_components/AccountSidebar'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  const userName = (user as { name?: string }).name || ''
  const initials = userName
    ? userName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : (user as { email?: string }).email?.slice(0, 2).toUpperCase() || '??'

  return (
    <div className="flex min-h-screen">
      <AccountSidebar
        userName={userName || (user as { email?: string }).email || 'Customer'}
        userInitials={initials}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}
