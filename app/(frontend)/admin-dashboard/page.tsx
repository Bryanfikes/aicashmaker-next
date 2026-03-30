import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

async function getAdminUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) return null
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${siteUrl}/api/users/me`, {
      headers: { Authorization: `JWT ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json() as { user?: { role?: string; name?: string; email?: string } }
    return data.user || null
  } catch {
    return null
  }
}

async function getStats() {
  try {
    const payload = await getPayload()
    const [orders, affiliates, subscribers, toolSubs, productSubs, tools, blogPosts, prompts, automations, sideHustles] = await Promise.all([
      payload.find({ collection: 'orders', limit: 0, overrideAccess: true }),
      payload.find({ collection: 'affiliates', limit: 0, overrideAccess: true }),
      payload.find({ collection: 'newsletter-subscribers', limit: 0, overrideAccess: true }),
      payload.find({ collection: 'tool-submissions', limit: 0, overrideAccess: true }),
      payload.find({ collection: 'product-submissions', limit: 0, overrideAccess: true }),
      payload.find({ collection: 'tools', limit: 0, overrideAccess: true }),
      payload.find({ collection: 'blog-posts', where: { published: { equals: true } }, limit: 0, overrideAccess: true }),
      payload.find({ collection: 'prompts', where: { published: { equals: true } }, limit: 0, overrideAccess: true }),
      payload.find({ collection: 'automations', where: { published: { equals: true } }, limit: 0, overrideAccess: true }),
      payload.find({ collection: 'side-hustles', limit: 0, overrideAccess: true }),
    ])

    const recentOrders = await payload.find({
      collection: 'orders',
      limit: 10,
      sort: '-createdAt',
      overrideAccess: true,
    })

    const topAffiliates = await payload.find({
      collection: 'affiliates',
      limit: 5,
      sort: '-totalEarned',
      overrideAccess: true,
    })

    // Calculate revenue from paid orders
    const paidOrders = await payload.find({
      collection: 'orders',
      where: { status: { equals: 'paid' } },
      limit: 1000,
      overrideAccess: true,
    })
    const totalRevenue = paidOrders.docs.reduce((sum: number, o: any) => sum + (o.amount || 0), 0)
    const totalPlatformFee = paidOrders.docs.reduce((sum: number, o: any) => sum + (o.platformFee || 0), 0)

    const pendingSubs = await payload.find({
      collection: 'tool-submissions',
      where: { status: { equals: 'pending' } },
      limit: 0,
      overrideAccess: true,
    })

    return {
      totalRevenue,
      totalPlatformFee,
      ordersCount: orders.totalDocs,
      paidOrdersCount: paidOrders.totalDocs,
      affiliatesCount: affiliates.totalDocs,
      subscribersCount: subscribers.totalDocs,
      toolSubsCount: toolSubs.totalDocs,
      productSubsCount: productSubs.totalDocs,
      toolsCount: tools.totalDocs,
      blogPostsCount: blogPosts.totalDocs,
      promptsCount: prompts.totalDocs,
      automationsCount: automations.totalDocs,
      sideHustlesCount: sideHustles.totalDocs,
      pendingSubsCount: (pendingSubs as any).totalDocs || 0,
      recentOrders: recentOrders.docs,
      topAffiliates: topAffiliates.docs,
    }
  } catch (e) {
    console.error('Admin stats error:', e)
    return null
  }
}

function fmt(cents: number) {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default async function AdminDashboardPage() {
  const user = await getAdminUser()
  if (!user || user.role !== 'super-admin') {
    redirect('/admin')
  }

  const stats = await getStats()

  const statCards = [
    { label: 'Total Revenue', value: fmt(stats?.totalRevenue || 0), sub: `${stats?.paidOrdersCount || 0} paid orders`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Platform Revenue', value: fmt(stats?.totalPlatformFee || 0), sub: '20% platform fee', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { label: 'Active Affiliates', value: String(stats?.affiliatesCount || 0), sub: 'Registered partners', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    { label: 'Email Subscribers', value: (stats?.subscribersCount || 0).toLocaleString(), sub: 'Newsletter list', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  ]

  const contentStats = [
    { label: 'AI Tools', value: stats?.toolsCount || 0, href: '/admin/collections/tools', icon: '🛠️' },
    { label: 'Blog Posts', value: stats?.blogPostsCount || 0, href: '/admin/collections/blog-posts', icon: '📝' },
    { label: 'Prompt Packs', value: stats?.promptsCount || 0, href: '/admin/collections/prompts', icon: '✨' },
    { label: 'Automations', value: stats?.automationsCount || 0, href: '/admin/collections/automations', icon: '⚡' },
    { label: 'Side Hustles', value: stats?.sideHustlesCount || 0, href: '/admin/collections/side-hustles', icon: '💰' },
    { label: 'Pending Reviews', value: (stats?.toolSubsCount || 0) + (stats?.productSubsCount || 0), href: '/admin/collections/tool-submissions', icon: '🔔', highlight: true },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top nav */}
      <header className="border-b border-white/8 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-white font-black text-sm">A</div>
            <span className="font-bold text-white">AICashMaker Admin</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Welcome, {user.name || user.email}</span>
            <Link href="/admin" className="text-xs bg-white/8 hover:bg-white/12 text-slate-300 px-3 py-1.5 rounded-lg transition-colors no-underline">
              Payload Admin →
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Overview</h1>
            <p className="text-slate-400 text-sm mt-1">Live data from your AICashMaker platform</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/collections/tool-submissions" className="flex items-center gap-2 text-xs bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/25 px-3 py-2 rounded-lg transition-colors no-underline">
              <span>🔔</span>
              <span>{(stats?.toolSubsCount || 0) + (stats?.productSubsCount || 0)} pending reviews</span>
            </Link>
            <Link href="/admin/collections/affiliates/create" className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg transition-colors no-underline font-semibold">
              + New Affiliate
            </Link>
          </div>
        </div>

        {/* Revenue stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, sub, color, bg }) => (
            <div key={label} className={`bg-slate-900 border rounded-2xl p-5 ${bg}`}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
              <p className={`text-3xl font-extrabold ${color} mb-1`}>{value}</p>
              <p className="text-xs text-slate-500">{sub}</p>
            </div>
          ))}
        </div>

        {/* Content inventory */}
        <div className="bg-slate-900 border border-white/8 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Content Inventory</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {contentStats.map(({ label, value, href, icon, highlight }) => (
              <Link key={label} href={href} className={`no-underline rounded-xl p-4 text-center transition-all hover:scale-105 ${highlight && value > 0 ? 'bg-amber-500/15 border border-amber-500/25' : 'bg-slate-800 border border-white/5'}`}>
                <div className="text-2xl mb-1">{icon}</div>
                <div className={`text-2xl font-extrabold ${highlight && value > 0 ? 'text-amber-400' : 'text-white'}`}>{value}</div>
                <div className={`text-xs mt-1 ${highlight && value > 0 ? 'text-amber-300' : 'text-slate-400'}`}>{label}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Orders */}
          <div className="bg-slate-900 border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Recent Orders</h2>
              <Link href="/admin/collections/orders" className="text-xs text-sky-400 hover:text-sky-300 no-underline">View all →</Link>
            </div>
            {!stats?.recentOrders?.length ? (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">No orders yet</p>
                <p className="text-slate-600 text-xs mt-1">Orders will appear here once customers make purchases</p>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentOrders.slice(0, 8).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${order.status === 'paid' ? 'bg-emerald-400' : order.status === 'pending' ? 'bg-amber-400' : 'bg-slate-500'}`} />
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">{order.buyerEmail}</p>
                        <p className="text-xs text-slate-500">{order.orderType}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-bold text-emerald-400">{fmt(order.amount || 0)}</p>
                      <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Affiliates */}
          <div className="bg-slate-900 border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Top Affiliates</h2>
              <Link href="/admin/collections/affiliates" className="text-xs text-sky-400 hover:text-sky-300 no-underline">Manage →</Link>
            </div>
            {!stats?.topAffiliates?.length ? (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">No affiliates yet</p>
                <Link href="/admin/collections/affiliates/create" className="text-xs text-emerald-400 hover:text-emerald-300 no-underline mt-2 block">
                  + Create your first affiliate →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.topAffiliates.map((aff: any, i: number) => (
                  <div key={aff.id} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white truncate">{aff.displayName}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${aff.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                          {aff.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{aff.totalClicks || 0} clicks · {aff.totalConversions || 0} conversions · {aff.commissionRate}%</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-violet-400">{fmt(aff.totalEarned || 0)}</p>
                      <p className="text-xs text-slate-500">earned</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 border border-white/8 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Create Blog Post', desc: 'Publish new content', href: '/admin/collections/blog-posts/create', icon: '📝', color: 'border-sky-500/20 hover:border-sky-400/40' },
              { label: 'Add AI Tool', desc: 'Add to tools directory', href: '/admin/collections/tools/create', icon: '🛠️', color: 'border-emerald-500/20 hover:border-emerald-400/40' },
              { label: 'Review Submissions', desc: `${(stats?.toolSubsCount || 0) + (stats?.productSubsCount || 0)} pending`, href: '/admin/collections/tool-submissions', icon: '🔔', color: 'border-amber-500/20 hover:border-amber-400/40' },
              { label: 'Manage Affiliates', desc: `${stats?.affiliatesCount || 0} partners`, href: '/admin/collections/affiliates', icon: '🤝', color: 'border-violet-500/20 hover:border-violet-400/40' },
              { label: 'Add Prompt Pack', desc: 'Add to marketplace', href: '/admin/collections/prompts/create', icon: '✨', color: 'border-violet-500/20 hover:border-violet-400/40' },
              { label: 'Add Automation', desc: 'Add workflow template', href: '/admin/collections/automations/create', icon: '⚡', color: 'border-emerald-500/20 hover:border-emerald-400/40' },
              { label: 'Newsletter List', desc: `${(stats?.subscribersCount || 0).toLocaleString()} subscribers`, href: '/admin/collections/newsletter-subscribers', icon: '✉️', color: 'border-pink-500/20 hover:border-pink-400/40' },
              { label: 'View Live Site', desc: 'Open aicashmaker.com', href: '/', icon: '🌐', color: 'border-slate-500/20 hover:border-slate-400/40' },
            ].map(({ label, desc, href, icon, color }) => (
              <Link
                key={label}
                href={href}
                className={`no-underline bg-slate-800 border ${color} rounded-xl p-4 flex items-start gap-3 transition-all hover:bg-slate-700/50`}
              >
                <span className="text-xl mt-0.5">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
