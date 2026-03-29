import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { formatPrice, formatDate } from '@/lib/utils'

export const metadata = { title: 'Referrals' }

const PAGE_SIZE = 25

export default async function AffiliateReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>
}) {
  const params = await searchParams
  const filter = params.filter || 'all'
  const page = parseInt(params.page || '1', 10)

  type ReferralDoc = {
    id: string
    type?: string
    commission?: number
    status?: string
    createdAt?: string
    landingUrl?: string
    referralCode?: string
  }

  let referrals: ReferralDoc[] = []
  let totalDocs = 0

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

      type WhereClause = {
        and: Array<{ affiliate?: { equals: string }; type?: { equals: string } }>
      }

      const whereClause: WhereClause = {
        and: [{ affiliate: { equals: affiliateId as string } }],
      }

      if (filter === 'conversions') {
        whereClause.and.push({ type: { equals: 'conversion' } })
      } else if (filter === 'clicks') {
        whereClause.and.push({ type: { equals: 'click' } })
      }

      const result = await payload.find({
        collection: 'affiliate-referrals',
        where: whereClause,
        overrideAccess: true,
        sort: '-createdAt',
        limit: PAGE_SIZE,
        page,
      })

      referrals = result.docs as ReferralDoc[]
      totalDocs = result.totalDocs
    }
  } catch {
    redirect('/login')
  }

  const totalPages = Math.ceil(totalDocs / PAGE_SIZE)

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'conversions', label: 'Conversions' },
    { key: 'clicks', label: 'Clicks' },
  ]

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Page header strip */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Referrals</h1>
            <p className="text-sm text-slate-400 mt-1">All clicks and conversions tracked for your referral links.</p>
          </div>
          {totalDocs > 0 && (
            <span className="ml-auto inline-flex items-center bg-sky-500/20 text-sky-400 text-xs font-bold px-2.5 py-1 rounded-full border border-sky-500/30 shrink-0">
              {totalDocs} total
            </span>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Filter tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={`/affiliate/referrals?filter=${tab.key}`}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200">
          {referrals.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-slate-600 text-sm font-semibold">No referrals found</p>
              <p className="text-slate-400 text-xs mt-1">Share your referral link to start tracking clicks and conversions.</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <div>Date</div>
                <div>Type</div>
                <div className="col-span-2">Landing Page</div>
                <div className="text-right">Commission / Status</div>
              </div>

              <div className="divide-y divide-slate-100">
                {referrals.map((referral) => (
                  <div key={referral.id} className="grid grid-cols-5 gap-4 px-6 py-4 items-center text-sm">
                    <div className="text-slate-600 font-medium">
                      {referral.createdAt ? formatDate(referral.createdAt) : '—'}
                    </div>

                    <div>
                      <TypeBadge type={referral.type || 'click'} />
                    </div>

                    <div className="col-span-2 text-slate-500 truncate font-mono text-xs">
                      {referral.landingUrl || '—'}
                    </div>

                    <div className="text-right flex items-center justify-end gap-2">
                      {referral.type === 'conversion' && referral.commission ? (
                        <span className="font-extrabold text-emerald-600">
                          +{formatPrice(referral.commission)}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                      <StatusBadge status={referral.status || 'pending'} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages} &middot; {totalDocs} total
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`/affiliate/referrals?filter=${filter}&page=${page - 1}`}
                  className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Previous
                </a>
              )}
              {page < totalPages && (
                <a
                  href={`/affiliate/referrals?filter=${filter}&page=${page + 1}`}
                  className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Next
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TypeBadge({ type }: { type: string }) {
  return type === 'conversion' ? (
    <span className="inline-block text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-500 text-white">
      Conversion
    </span>
  ) : (
    <span className="inline-block text-xs px-2.5 py-1 rounded-full font-bold bg-sky-100 text-sky-700">
      Click
    </span>
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
