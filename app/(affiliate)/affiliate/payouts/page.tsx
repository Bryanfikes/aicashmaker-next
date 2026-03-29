import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { formatPrice, formatDate } from '@/lib/utils'

export const metadata = { title: 'Payouts' }

export default async function AffiliatePayoutsPage() {
  type AffiliateDoc = {
    totalEarned?: number
    totalPaid?: number
    payoutEmail?: string
    payoutMethod?: string
    displayName?: string
  }

  type ReferralDoc = {
    id: string
    commission?: number
    status?: string
    createdAt?: string
    landingUrl?: string
  }

  let affiliate: AffiliateDoc | null = null
  let paidReferrals: ReferralDoc[] = []

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

      affiliate = await payload.findByID({
        collection: 'affiliates',
        id: affiliateId as string,
        overrideAccess: true,
      }) as AffiliateDoc

      const result = await payload.find({
        collection: 'affiliate-referrals',
        where: {
          and: [
            { affiliate: { equals: affiliateId } },
            { type: { equals: 'conversion' } },
            { status: { equals: 'paid' } },
          ],
        },
        overrideAccess: true,
        sort: '-createdAt',
        limit: 100,
      })

      paidReferrals = result.docs as ReferralDoc[]
    }
  } catch {
    redirect('/login')
  }

  const totalEarned = affiliate?.totalEarned ?? 0
  const totalPaid = affiliate?.totalPaid ?? 0
  const balanceDue = Math.max(0, totalEarned - totalPaid)

  const payoutMethodLabel: Record<string, string> = {
    paypal: 'PayPal',
    bank_transfer: 'Bank Transfer',
    stripe: 'Stripe',
    check: 'Check',
    other: 'Other',
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Page header strip */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Payouts</h1>
        <p className="text-sm text-slate-400 mt-1">Track your earnings and payout history.</p>
      </div>

      <div className="p-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Total Earned */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{formatPrice(totalEarned)}</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">Total Earned</p>
            <p className="text-xs text-slate-400 mt-1">Lifetime commissions</p>
          </div>

          {/* Total Paid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{formatPrice(totalPaid)}</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">Total Paid</p>
            <p className="text-xs text-slate-400 mt-1">Already disbursed</p>
          </div>

          {/* Balance Due */}
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-emerald-700">{formatPrice(balanceDue)}</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">Balance Due</p>
            <p className="text-xs text-emerald-600 mt-1">Pending payout</p>
          </div>
        </div>

        {/* Payout method info card */}
        {(affiliate?.payoutEmail || affiliate?.payoutMethod) && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight mb-4">Payout Details</h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              {affiliate.payoutMethod && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Method</p>
                  <p className="font-semibold text-slate-900">
                    {payoutMethodLabel[affiliate.payoutMethod] || affiliate.payoutMethod}
                  </p>
                </div>
              )}
              {affiliate.payoutEmail && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Payout Email</p>
                  <p className="font-semibold text-slate-900">{affiliate.payoutEmail}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Request Payout CTA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Request a Payout</h2>
              <p className="text-sm text-slate-500 mt-1">
                Payouts are processed manually. To request your current balance, contact our affiliate team and we&apos;ll get back to you within 2 business days.
              </p>
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <a
                  href="mailto:affiliates@aicashmaker.com?subject=Payout%20Request"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Request Payout
                </a>
                <span className="text-xs text-slate-400">affiliates@aicashmaker.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Paid history */}
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-extrabold text-slate-900 tracking-tight">Paid Commissions</h2>
          </div>

          {paidReferrals.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm font-semibold">No paid commissions yet</p>
              <p className="text-slate-400 text-xs mt-1">Your paid commission history will appear here.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <div>Date</div>
                <div>Landing Page</div>
                <div className="text-right">Commission</div>
              </div>
              <div className="divide-y divide-slate-100">
                {paidReferrals.map((referral) => (
                  <div key={referral.id} className="grid grid-cols-3 gap-4 px-6 py-4 items-center text-sm">
                    <div className="text-slate-600 font-medium">
                      {referral.createdAt ? formatDate(referral.createdAt) : '—'}
                    </div>
                    <div className="text-slate-500 truncate font-mono text-xs">
                      {referral.landingUrl || '—'}
                    </div>
                    <div className="text-right font-extrabold text-emerald-600">
                      +{formatPrice(referral.commission || 0)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
