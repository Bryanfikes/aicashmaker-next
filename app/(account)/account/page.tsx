import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import Link from 'next/link'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatAmount(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    fulfilled: 'bg-emerald-50 text-emerald-700',
    paid: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    refunded: 'bg-slate-100 text-slate-600',
    failed: 'bg-red-50 text-red-700',
  }
  const cls = map[status] || 'bg-slate-100 text-slate-600'
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${cls}`}>
      {status}
    </span>
  )
}

export const metadata = {
  title: 'Overview',
}

export default async function AccountOverviewPage() {
  let user = null
  let orders: Record<string, unknown>[] = []

  try {
    const payload = await getPayload()
    const { user: authUser } = await payload.auth({ headers: await headers() })
    user = authUser

    if (!user) redirect('/login')

    const [byBuyer, byEmail] = await Promise.all([
      payload.find({
        collection: 'orders',
        where: { buyer: { equals: user.id } },
        overrideAccess: true,
        depth: 1,
        sort: '-createdAt',
        limit: 100,
      }),
      payload.find({
        collection: 'orders',
        where: { buyerEmail: { equals: (user as { email: string }).email } },
        overrideAccess: true,
        depth: 1,
        sort: '-createdAt',
        limit: 100,
      }),
    ])

    const seen = new Set<string>()
    const merged: Record<string, unknown>[] = []
    for (const order of [...byBuyer.docs, ...byEmail.docs]) {
      const id = String((order as { id: unknown }).id)
      if (!seen.has(id)) {
        seen.add(id)
        merged.push(order as Record<string, unknown>)
      }
    }

    merged.sort((a, b) => {
      return new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime()
    })

    orders = merged
  } catch {
    redirect('/login')
  }

  if (!user) redirect('/login')

  const totalSpent = orders.reduce((sum, o) => sum + ((o.amount as number) || 0), 0)
  const downloadsAvailable = orders.filter(
    (o) => o.orderType === 'product' && o.status === 'fulfilled'
  ).length
  const recent = orders.slice(0, 5)

  const userName = (user as { name?: string }).name || (user as { email?: string }).email || 'there'
  const firstName = userName.includes(' ') ? userName.split(' ')[0] : userName.split('@')[0]

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Gradient page header */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-slate-400 mt-1">Here are your recent purchases</p>
      </div>

      <div className="p-8 flex-1">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Total Purchases */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">Total Purchases</p>
            <p className="text-xs text-slate-400 mt-1">All time orders</p>
          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{formatAmount(totalSpent)}</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">Total Spent</p>
            <p className="text-xs text-slate-400 mt-1">Across all orders</p>
          </div>

          {/* Downloads Available */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{downloadsAvailable}</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">Downloads Available</p>
            <p className="text-xs text-slate-400 mt-1">Fulfilled product files</p>
          </div>
        </div>

        {/* Recent purchases */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Recent Purchases</h2>
            <Link
              href="/account/purchases"
              className="text-sm text-sky-500 hover:text-sky-600 font-semibold transition-colors"
            >
              View all →
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="px-6 py-16 text-center bg-sky-50/50">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-slate-700 font-semibold">No purchases yet</p>
              <p className="text-slate-400 text-sm mt-1">When you buy a product it will appear here.</p>
              <a
                href="/tools"
                className="mt-4 inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl px-4 py-2 text-sm transition-colors"
              >
                Browse tools and products
              </a>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Product</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Amount</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((order) => {
                  const product = order.product as { name?: string; downloadUrl?: string } | null
                  const productName =
                    product?.name ||
                    (order.advertisingDetails as { toolName?: string })?.toolName ||
                    '—'
                  const canDownload =
                    order.orderType === 'product' &&
                    order.status === 'fulfilled' &&
                    product?.downloadUrl

                  return (
                    <tr key={String(order.id)} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 max-w-xs truncate">
                        {productName}
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {formatDate(String(order.createdAt))}
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-semibold whitespace-nowrap">
                        {formatAmount((order.amount as number) || 0)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={String(order.status)} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {canDownload && (
                          <a
                            href={product!.downloadUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl px-4 py-2 text-sm transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
