import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import AffiliateSettingsForm from './_components/AffiliateSettingsForm'

export const metadata = { title: 'Affiliate Settings' }

export default async function AffiliateSettingsPage() {
  let displayName = ''
  let payoutEmail = ''
  let payoutMethod = 'paypal'
  let referralCode = ''
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
        payoutEmail?: string
        payoutMethod?: string
        referralCode?: string
        commissionRate?: number
      }

      displayName = affiliate?.displayName || ''
      payoutEmail = affiliate?.payoutEmail || ''
      payoutMethod = affiliate?.payoutMethod || 'paypal'
      referralCode = affiliate?.referralCode || ''
      commissionRate = affiliate?.commissionRate ?? 30
    }
  } catch {
    redirect('/login')
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Page header strip */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your affiliate profile and payout preferences.</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form card */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight mb-5">Profile &amp; Payout Info</h2>
            <AffiliateSettingsForm
              initialDisplayName={displayName}
              initialPayoutEmail={payoutEmail}
              initialPayoutMethod={payoutMethod}
            />
          </div>

          {/* Right column: Account info + help */}
          <div className="space-y-5">
            {/* Account Info — read only */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight mb-4">Account Info</h2>
              <div className="space-y-4 text-sm">
                {referralCode && (
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">Referral Code</p>
                    <p className="font-mono font-extrabold text-slate-900 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 inline-block">
                      {referralCode}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Commission Rate</p>
                  <span className="inline-flex items-center bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {commissionRate}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-5 leading-relaxed">
                To change your referral code or commission rate, contact{' '}
                <a href="mailto:affiliates@aicashmaker.com" className="text-sky-500 hover:underline font-medium">
                  affiliates@aicashmaker.com
                </a>
                .
              </p>
            </div>

            {/* Need Help card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight mb-2">Need Help?</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                For questions about payouts, tracking, or your account, reach out to our affiliate team.
              </p>
              <a
                href="mailto:affiliates@aicashmaker.com"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-500 hover:text-sky-600 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                affiliates@aicashmaker.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
