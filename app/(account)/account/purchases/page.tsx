import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'

export const metadata = {
  title: 'My Purchases',
}

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

function formatOrderType(type: string) {
  const map: Record<string, string> = {
    product: 'Product',
    'featured-listing': 'Featured Listing',
    'newsletter-sponsorship': 'Newsletter',
    'full-review': 'Full Review',
    bundle: 'Bundle',
  }
  return map[type] || type
}

function TypeBadge({ type }: { type: string }) {
  const isProduct = type === 'product'
  const isBundle = type === 'bundle'
  const cls = isProduct
    ? 'bg-sky-50 text-sky-700'
    : isBundle
    ? 'bg-amber-50 text-amber-700'
    : 'bg-amber-50 text-amber-700'
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      {formatOrderType(type)}
    </span>
  )
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

export default async function PurchasesPage() {
  let orders: Record<string, unknown>[] = []

  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) redirect('/login')

    const [byBuyer, byEmail] = await Promise.all([
      payload.find({
        collection: 'orders',
        where: { buyer: { equals: user.id } },
        overrideAccess: true,
        depth: 1,
        sort: '-createdAt',
        limit: 500,
      }),
      payload.find({
        collection: 'orders',
        where: { buyerEmail: { equals: (user as { email: string }).email } },
        overrideAccess: true,
        depth: 1,
        sort: '-createdAt',
        limit: 500,
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

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Gradient page header */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">My Purchases</h1>
        <p className="text-sm text-slate-400 mt-1">
          {orders.length === 0
            ? 'No orders yet'
            : `${orders.length} order${orders.length === 1 ? '' : 's'} total`}
        </p>
      </div>

      <div className="p-8 flex-1">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-4">
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
              Browse products
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Product</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Amount</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
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
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <span className="truncate block max-w-[200px]">{productName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <TypeBadge type={String(order.orderType)} />
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
          </div>
        )}
      </div>
    </div>
  )
}
