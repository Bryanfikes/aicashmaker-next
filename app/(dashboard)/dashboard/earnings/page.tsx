import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Product, Order } from '@/payload-types'

export const metadata = { title: 'Earnings' }

export default async function DashboardEarningsPage() {
  let orders: Order[] = []
  let products: Product[] = []

  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) redirect('/login')

    if (user.creator) {
      const creatorId = typeof user.creator === 'object' ? user.creator.id : user.creator

      const productsResult = await payload.find({
        collection: 'products',
        where: { creator: { equals: creatorId } },
        overrideAccess: true,
        limit: 100,
      })
      products = productsResult.docs as Product[]

      const productIds = products.map((p) => p.id)
      if (productIds.length > 0) {
        const ordersResult = await payload.find({
          collection: 'orders',
          where: {
            and: [
              { orderType: { equals: 'product' } },
              { product: { in: productIds } },
              { status: { in: ['paid', 'fulfilled'] } },
            ],
          },
          overrideAccess: true,
          sort: '-createdAt',
          limit: 500,
          depth: 1,
        })
        orders = ordersResult.docs as Order[]
      }
    }
  } catch {
    redirect('/login')
  }

  const totalEarnings = orders.reduce((sum, o) => sum + (o.creatorPayout || 0), 0)
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0)
  const platformFees = orders.reduce((sum, o) => sum + (o.platformFee || 0), 0)

  // Per-product breakdown
  const byProduct = products.map((product) => {
    const productOrders = orders.filter((o) => {
      const pid = typeof o.product === 'object' ? o.product?.id : o.product
      return pid === product.id
    })
    const earned = productOrders.reduce((sum, o) => sum + (o.creatorPayout || 0), 0)
    return { product, orders: productOrders, earned }
  }).filter((row) => row.orders.length > 0)
    .sort((a, b) => b.earned - a.earned)

  const summaryCards = [
    {
      label: 'Gross Revenue',
      value: formatPrice(totalRevenue),
      sub: 'Total customer spend',
      color: 'text-slate-900',
      bg: 'bg-sky-50',
      iconColor: 'text-sky-600',
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: 'Platform Fee (20%)',
      value: formatPrice(platformFees),
      sub: 'AICashMaker cut',
      color: 'text-slate-500',
      bg: 'bg-slate-100',
      iconColor: 'text-slate-400',
      icon: (
        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      ),
    },
    {
      label: 'Your Earnings (80%)',
      value: formatPrice(totalEarnings),
      sub: `Across ${orders.length} sale${orders.length !== 1 ? 's' : ''}`,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Gradient header strip */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Earnings</h1>
        <p className="text-sm text-slate-400 mt-1">Your revenue across all products.</p>
      </div>

      <div className="p-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {summaryCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                {card.icon}
              </div>
              <p className={`text-2xl font-extrabold ${card.color}`}>{card.value}</p>
              <p className="text-sm font-medium text-slate-700 mt-0.5">{card.label}</p>
              <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* By product */}
        {byProduct.length > 0 && (
          <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white mb-8">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-extrabold tracking-tight text-slate-900">Earnings by Product</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {byProduct.map(({ product, orders: productOrders, earned }) => (
                <div key={product.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{product.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {productOrders.length} sale{productOrders.length !== 1 ? 's' : ''} · {formatPrice(product.price)} each
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-extrabold text-emerald-600 text-sm">{formatPrice(earned)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">your cut</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All transactions */}
        <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-extrabold tracking-tight text-slate-900">All Transactions</h2>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700">No transactions yet</p>
              <p className="text-xs text-slate-400 mt-1">Share your products to earn!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-6 py-4 font-medium text-slate-500">Date</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-500">Product</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-500">Buyer</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-500">Sale price</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-500">Your cut</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => {
                    const product = typeof order.product === 'object' ? order.product as Product : null
                    return (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {formatDate(order.createdAt as string)}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {product?.name ?? '—'}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {order.buyerName || order.buyerEmail}
                        </td>
                        <td className="px-6 py-4 text-slate-900">
                          {formatPrice(order.amount)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-emerald-600">
                          +{formatPrice(order.creatorPayout || 0)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                            order.status === 'fulfilled'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-sky-50 text-sky-700'
                          }`}>
                            {order.status}
                          </span>
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
    </div>
  )
}
