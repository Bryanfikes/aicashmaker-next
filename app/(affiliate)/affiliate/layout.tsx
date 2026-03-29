import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import AffiliateSidebar from './_components/AffiliateSidebar'

export default async function AffiliateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let affiliateName = 'Affiliate'
  let referralCode = ''
  let status = 'pending'
  let commissionRate = 30

  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) redirect('/login')
    if ((user as { role?: string }).role !== 'affiliate') redirect('/login')

    if ((user as any).affiliate) {
      const affiliateId =
        typeof (user as any).affiliate === 'object'
          ? (user as any).affiliate?.id
          : (user as any).affiliate

      const affiliate = await payload.findByID({
        collection: 'affiliates',
        id: affiliateId as string,
        overrideAccess: true,
      }) as {
        displayName?: string
        referralCode?: string
        status?: string
        commissionRate?: number
      }

      affiliateName = affiliate?.displayName || 'Affiliate'
      referralCode = affiliate?.referralCode || ''
      status = affiliate?.status || 'pending'
      commissionRate = affiliate?.commissionRate ?? 30
    }
  } catch {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      <AffiliateSidebar
        affiliateName={affiliateName}
        referralCode={referralCode}
        status={status}
        commissionRate={commissionRate}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}
