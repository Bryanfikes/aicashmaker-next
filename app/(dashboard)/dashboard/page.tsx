import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Product, Order, Creator } from '@/payload-types'

export const metadata = { title: 'Overview' }

export default async function DashboardOverviewPage() {
  let creator: Creator | null = null
  let products: Product[] = []
  let orders: Order[] = []

  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) redirect('/login')

    if (user.creator) {
      const creatorId = typeof user.creator === 'object' ? user.creator.id : user.creator

      creator = await payload.findByID({
        collection: 'creators',
        id: creatorId,
        overrideAccess: true,
      }) as Creator

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
          limit: 100,
        })
        orders = ordersResult.docs as Order[]
      }
    }
  } catch {
    redirect('/login')
  }

  const totalEarnings = orders.reduce((sum, o) => sum + (o.creatorPayout || 0), 0)
  const totalSales = orders.length
  const approvedProducts = products.filter((p) => p.approved).length
  const pendingProducts = products.filter((p) => !p.approved).length
  const recentOrders = orders.slice(0, 5)

  const stats = [
    {
      label: 'Total Earnings',
      value: formatPrice(totalEarnings),
      sub: '80% of sales after platform fee',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Sales',
      value: totalSales.toString(),
      sub: 'Completed orders',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: 'Live Products',
      value: approvedProducts.toString(),
      sub: pendingProducts > 0 ? `${pendingProducts} pending review` : 'All approved',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      icon: (
        <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'Avg. Per Sale',
      value: totalSales > 0 ? formatPrice(Math.round(totalEarnings / totalSales)) : '$0',
      sub: 'Your avg. creator payout',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ]

  const firstName = creator?.displayName?.split(' ')[0] ?? 'there'

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Gradient header strip */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Welcome back, {firstName}
            </h1>
            <p className="text-sm text-slate-400 mt-1">Here's how your products are performing.</p>
          </div>
          {products.length === 0 && (
            <a
              href="/submit-product"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl px-4 py-2 text-sm transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </a>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-sm font-medium text-slate-700 mt-0.5">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-extrabold tracking-tight text-slate-900">Recent Sales</h2>
            <a href="/dashboard/earnings" className="text-sm text-sky-500 hover:text-sky-600 font-medium transition-colors">
              View all
            </a>
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700">No sales yet</p>
              <p className="text-xs text-slate-400 mt-1">Share your products to get your first sale.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order) => {
                const product = typeof order.product === 'object' ? order.product : null
                return (
                  <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {product ? (product as Product).name : 'Unknown product'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {order.buyerName || order.buyerEmail} · {formatDate(order.createdAt as string)}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-sm font-semibold text-emerald-600">
                        +{formatPrice(order.creatorPayout || 0)}
                      </p>
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${
                        order.status === 'fulfilled'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-sky-50 text-sky-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
