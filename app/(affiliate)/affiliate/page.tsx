import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { formatPrice, formatDate } from '@/lib/utils'
import CopyCodeButton from './_components/CopyCodeButton'

export const metadata = { title: 'Affiliate Overview' }

export default async function AffiliateOverviewPage() {
  type AffiliateDoc = {
    id: string
    displayName?: string
    referralCode?: string
    commissionRate?: number
    totalClicks?: number
    totalConversions?: number
    totalEarned?: number
    totalPaid?: number
    status?: string
  }

  type ReferralDoc = {
    id: string
    type?: string
    commission?: number
    status?: string
    createdAt?: string
    landingUrl?: string
    order?: { id: string; [key: string]: unknown } | string
  }

  let affiliate: AffiliateDoc | null = null
  let recentReferrals: ReferralDoc[] = []
  let pendingEarnings = 0

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

      const referralsResult = await payload.find({
        collection: 'affiliate-referrals',
        where: { affiliate: { equals: affiliateId } },
        overrideAccess: true,
        sort: '-createdAt',
        limit: 100,
      })

      const allReferrals = referralsResult.docs as ReferralDoc[]

      // Pending earnings = approved but not yet paid conversions
      pendingEarnings = allReferrals
        .filter((r) => r.type === 'conversion' && r.status === 'approved')
        .reduce((sum, r) => sum + (r.commission || 0), 0)

      recentReferrals = allReferrals.filter((r) => r.type === 'conversion').slice(0, 5)
    }
  } catch {
    redirect('/login')
  }

  const totalClicks = affiliate?.totalClicks ?? 0
  const totalConversions = affiliate?.totalConversions ?? 0
  const conversionRate =
    totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : '0.0'
  const totalEarned = affiliate?.totalEarned ?? 0
  const referralCode = affiliate?.referralCode || ''
  const firstName = affiliate?.displayName?.split(' ')[0] ?? 'Affiliate'
  const commissionRate = affiliate?.commissionRate ?? 30

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Page header strip */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome back, {firstName}
            </h1>
            <p className="text-sm text-slate-400 mt-1">Here&apos;s how your referrals are performing.</p>
          </div>
          <span className="ml-auto inline-flex items-center bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
            {commissionRate}% commission
          </span>
        </div>
      </div>

      <div className="p-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {/* Clicks */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{totalClicks.toLocaleString()}</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">Total Clicks</p>
            <p className="text-xs text-slate-400 mt-1">All-time link clicks</p>
          </div>

          {/* Conversions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{totalConversions.toLocaleString()}</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">Conversions</p>
            <p className="text-xs text-slate-400 mt-1">Completed sales</p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-sky-50 rounded-2xl border border-sky-100 p-5">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-sky-700">{conversionRate}%</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">Conversion Rate</p>
            <p className="text-xs text-slate-400 mt-1">Clicks that convert</p>
          </div>

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
        </div>

        {/* Pending earnings banner */}
        {pendingEarnings > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold text-emerald-800 tracking-tight">Pending Earnings</p>
              <p className="text-xs text-emerald-600 mt-0.5">Approved commissions awaiting payout</p>
            </div>
            <p className="text-2xl font-extrabold text-emerald-700 shrink-0">{formatPrice(pendingEarnings)}</p>
          </div>
        )}

        {/* Referral code */}
        {referralCode && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
            <p className="text-sm font-extrabold text-slate-900 tracking-tight mb-3">Your Referral Code</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-900 rounded-xl px-4 py-3 font-mono text-sky-400 text-sm tracking-widest select-all">
                {referralCode}
              </div>
              <CopyCodeButton value={referralCode} label="Copy Code" />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Share your link:{' '}
              <span className="font-mono text-slate-600">https://aicashmaker.com?ref={referralCode}</span>
            </p>
          </div>
        )}

        {/* Recent conversions */}
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 tracking-tight">Recent Conversions</h2>
            <a href="/affiliate/referrals" className="text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors">
              View all
            </a>
          </div>

          {recentReferrals.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm font-semibold">No conversions yet</p>
              <p className="text-slate-400 text-xs mt-1">Share your referral link to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentReferrals.map((referral) => (
                <div key={referral.id} className="px-6 py-4 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {referral.createdAt ? formatDate(referral.createdAt) : '—'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">
                      {referral.landingUrl || 'Direct'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-emerald-600">
                      +{formatPrice(referral.commission || 0)}
                    </span>
                    <StatusBadge status={referral.status || 'pending'} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-700',
    paid: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    rejected: 'bg-red-50 text-red-700',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  )
}
