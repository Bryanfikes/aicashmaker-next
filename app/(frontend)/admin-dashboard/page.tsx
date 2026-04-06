import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { ADVERTISER_PRESETS } from '@/lib/ads'

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
    const [
      orders, affiliates, subscribers, toolSubs, productSubs,
      tools, blogPosts, prompts, automations, sideHustles, users,
    ] = await Promise.all([
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
      payload.find({ collection: 'users', limit: 0, overrideAccess: true }),
    ])

    const [recentOrders, topAffiliates, paidOrders, pendingSubs] = await Promise.all([
      payload.find({ collection: 'orders', limit: 12, sort: '-createdAt', overrideAccess: true }),
      payload.find({ collection: 'affiliates', limit: 8, sort: '-totalEarned', overrideAccess: true }),
      payload.find({ collection: 'orders', where: { status: { equals: 'paid' } }, limit: 1000, overrideAccess: true }),
      payload.find({ collection: 'tool-submissions', where: { status: { equals: 'pending' } }, limit: 0, overrideAccess: true }),
    ])

    const totalRevenue = paidOrders.docs.reduce((sum: number, o: any) => sum + (o.amount || 0), 0)
    const totalPlatformFee = paidOrders.docs.reduce((sum: number, o: any) => sum + (o.platformFee || 0), 0)
    const totalAffiliatePaid = topAffiliates.docs.reduce((sum: number, a: any) => sum + (a.totalPaid || 0), 0)

    // Build simple monthly revenue buckets (last 6 months) from paidOrders
    const now = new Date()
    const months: { label: string; revenue: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = d.toLocaleString('en-US', { month: 'short' })
      const revenue = paidOrders.docs.filter((o: any) => {
        const od = new Date(o.createdAt)
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth()
      }).reduce((sum: number, o: any) => sum + (o.amount || 0), 0)
      months.push({ label, revenue })
    }

    const maxMonthRevenue = Math.max(...months.map(m => m.revenue), 1)

    return {
      totalRevenue,
      totalPlatformFee,
      totalAffiliatePaid,
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
      usersCount: users.totalDocs,
      pendingSubsCount: pendingSubs.totalDocs,
      recentOrders: recentOrders.docs,
      topAffiliates: topAffiliates.docs,
      monthlyRevenue: months,
      maxMonthRevenue,
    }
  } catch (e) {
    console.error('Admin stats error:', e)
    return null
  }
}

async function getAdStats() {
  try {
    const payload = await getPayload()
    const [allAds, activeAds] = await Promise.all([
      payload.find({ collection: 'advertisements', limit: 50, sort: '-priority', overrideAccess: true }),
      payload.find({ collection: 'advertisements', where: { status: { equals: 'active' } }, limit: 50, sort: '-priority', overrideAccess: true }),
    ])
    return {
      totalAds: allAds.totalDocs,
      activeAds: activeAds.totalDocs,
      ads: allAds.docs as any[],
    }
  } catch {
    return { totalAds: 0, activeAds: 0, ads: [] }
  }
}

function fmt(cents: number) {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtShort(cents: number) {
  const dollars = cents / 100
  if (dollars >= 1000) return '$' + (dollars / 1000).toFixed(1) + 'k'
  return '$' + dollars.toFixed(0)
}

export default async function AdminDashboardPage() {
  const user = await getAdminUser()
  if (!user || user.role !== 'super-admin') redirect('/admin')

  const [stats, adStats] = await Promise.all([getStats(), getAdStats()])
  const pendingCount = (stats?.pendingSubsCount || 0) + (stats?.productSubsCount || 0)

  const navSections = [
    {
      label: 'Overview',
      items: [
        { icon: '◈', label: 'Dashboard', href: '/admin-dashboard', active: true },
        { icon: '⬡', label: 'Live Site', href: '/' },
        { icon: '⚙', label: 'Payload Admin', href: '/admin' },
      ],
    },
    {
      label: 'Commerce',
      items: [
        { icon: '◎', label: 'Orders', href: '/admin/collections/orders', badge: stats?.ordersCount },
        { icon: '◇', label: 'Products', href: '/admin/collections/products' },
        { icon: '◉', label: 'Creators', href: '/admin/collections/creators' },
      ],
    },
    {
      label: 'Growth',
      items: [
        { icon: '◈', label: 'Affiliates', href: '/admin/collections/affiliates', badge: stats?.affiliatesCount },
        { icon: '◎', label: 'Newsletter', href: '/admin/collections/newsletter-subscribers', badge: stats?.subscribersCount },
      ],
    },
    {
      label: 'Content',
      items: [
        { icon: '◇', label: 'AI Tools', href: '/admin/collections/tools', badge: stats?.toolsCount },
        { icon: '◈', label: 'Blog Posts', href: '/admin/collections/blog-posts', badge: stats?.blogPostsCount },
        { icon: '◉', label: 'Prompt Packs', href: '/admin/collections/prompts', badge: stats?.promptsCount },
        { icon: '◎', label: 'Automations', href: '/admin/collections/automations', badge: stats?.automationsCount },
        { icon: '◇', label: 'Side Hustles', href: '/admin/collections/side-hustles', badge: stats?.sideHustlesCount },
      ],
    },
    {
      label: 'Advertising',
      items: [
        { icon: '◈', label: 'Ad Manager', href: '/admin/collections/advertisements', badge: adStats.activeAds },
        { icon: '◎', label: 'New Ad Unit', href: '/admin/collections/advertisements/create' },
      ],
    },
    {
      label: 'Submissions',
      items: [
        { icon: '◉', label: 'Tool Submissions', href: '/admin/collections/tool-submissions', badge: stats?.toolSubsCount, alert: (stats?.toolSubsCount || 0) > 0 },
        { icon: '◎', label: 'Product Submissions', href: '/admin/collections/product-submissions', badge: stats?.productSubsCount, alert: (stats?.productSubsCount || 0) > 0 },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="w-56 flex-shrink-0 hidden lg:flex flex-col border-r border-white/6 bg-slate-900/60 sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/6">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">A</div>
            <div>
              <p className="text-sm font-extrabold text-white leading-none">AICashMaker</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Admin Console</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5">
          {navSections.map(section => (
            <div key={section.label}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1.5">{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors no-underline group ${
                      (item as any).active
                        ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none opacity-70">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {(item as any).badge !== undefined && (item as any).badge > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        (item as any).alert ? 'bg-amber-500/25 text-amber-400' : 'bg-white/8 text-slate-400'
                      }`}>
                        {(item as any).badge > 999 ? '999+' : (item as any).badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
              {(user.name || user.email || 'A')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Top bar */}
        <header className="border-b border-white/6 bg-slate-900/40 backdrop-blur-sm sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-base font-extrabold text-white leading-none">Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Live platform overview</p>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <Link
                href="/admin/collections/tool-submissions"
                className="flex items-center gap-1.5 text-xs bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg transition-colors no-underline font-semibold"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {pendingCount} pending
              </Link>
            )}
            <Link
              href="/admin/collections/affiliates/create"
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors no-underline"
            >
              + New Affiliate
            </Link>
          </div>
        </header>

        <div className="px-6 py-7 max-w-[1200px]">

          {/* ── KPI Cards ─── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
            {[
              {
                label: 'Gross Revenue',
                value: fmt(stats?.totalRevenue || 0),
                sub: `${stats?.paidOrdersCount || 0} paid orders`,
                color: 'text-emerald-400',
                border: 'border-emerald-500/20',
                glow: 'from-emerald-500/5 to-transparent',
                icon: '↑',
              },
              {
                label: 'Platform Net',
                value: fmt(stats?.totalPlatformFee || 0),
                sub: '20% platform fee',
                color: 'text-sky-400',
                border: 'border-sky-500/20',
                glow: 'from-sky-500/5 to-transparent',
                icon: '◎',
              },
              {
                label: 'Affiliate Payouts',
                value: fmt(stats?.totalAffiliatePaid || 0),
                sub: `${stats?.affiliatesCount || 0} active partners`,
                color: 'text-violet-400',
                border: 'border-violet-500/20',
                glow: 'from-violet-500/5 to-transparent',
                icon: '◈',
              },
              {
                label: 'Email List',
                value: (stats?.subscribersCount || 0).toLocaleString(),
                sub: 'Newsletter subscribers',
                color: 'text-pink-400',
                border: 'border-pink-500/20',
                glow: 'from-pink-500/5 to-transparent',
                icon: '◉',
              },
            ].map(({ label, value, sub, color, border, glow, icon }) => (
              <div key={label} className={`relative overflow-hidden bg-slate-900 border ${border} rounded-2xl p-5`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${glow} pointer-events-none`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                    <span className={`text-base ${color} opacity-50`}>{icon}</span>
                  </div>
                  <p className={`text-2xl font-extrabold ${color} mb-1`}>{value}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Revenue Chart + Content Inventory ─── */}
          <div className="grid xl:grid-cols-5 gap-5 mb-5">

            {/* Revenue bar chart (3 cols) */}
            <div className="xl:col-span-3 bg-slate-900 border border-white/6 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-bold text-white">Monthly Revenue</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Last 6 months · gross sales</p>
                </div>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg">
                  {fmt(stats?.totalRevenue || 0)} total
                </span>
              </div>
              <div className="flex items-end gap-3 h-32">
                {(stats?.monthlyRevenue || []).map(({ label, revenue }) => {
                  const pct = stats?.maxMonthRevenue ? (revenue / stats.maxMonthRevenue) * 100 : 0
                  return (
                    <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-mono">{revenue > 0 ? fmtShort(revenue) : ''}</span>
                      <div className="w-full relative flex items-end" style={{ height: '80px' }}>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all"
                          style={{ height: `${Math.max(pct, revenue > 0 ? 4 : 0)}%`, minHeight: revenue > 0 ? '4px' : '0' }}
                        />
                        {revenue === 0 && (
                          <div className="w-full h-0.5 bg-slate-800 rounded absolute bottom-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">{label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Content inventory (2 cols) */}
            <div className="xl:col-span-2 bg-slate-900 border border-white/6 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-white">Content</h2>
                <span className="text-xs text-slate-500">Published items</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'AI Tools', value: stats?.toolsCount || 0, href: '/admin/collections/tools', color: 'bg-sky-500' },
                  { label: 'Blog Posts', value: stats?.blogPostsCount || 0, href: '/admin/collections/blog-posts', color: 'bg-violet-500' },
                  { label: 'Prompt Packs', value: stats?.promptsCount || 0, href: '/admin/collections/prompts', color: 'bg-pink-500' },
                  { label: 'Automations', value: stats?.automationsCount || 0, href: '/admin/collections/automations', color: 'bg-emerald-500' },
                  { label: 'Side Hustles', value: stats?.sideHustlesCount || 0, href: '/admin/collections/side-hustles', color: 'bg-amber-500' },
                ].map(({ label, value, href, color }) => {
                  const max = Math.max(stats?.toolsCount || 0, stats?.blogPostsCount || 0, stats?.promptsCount || 0, stats?.automationsCount || 0, stats?.sideHustlesCount || 0, 1)
                  const pct = (value / max) * 100
                  return (
                    <Link key={label} href={href} className="no-underline flex items-center gap-3 group">
                      <span className="text-xs text-slate-400 w-24 group-hover:text-white transition-colors">{label}</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white w-6 text-right">{value}</span>
                    </Link>
                  )
                })}
              </div>
              {pendingCount > 0 && (
                <Link
                  href="/admin/collections/tool-submissions"
                  className="no-underline mt-5 flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-semibold text-amber-400">{pendingCount} submissions pending review</span>
                  </div>
                  <span className="text-amber-400 text-xs">→</span>
                </Link>
              )}
            </div>
          </div>

          {/* ── Orders Table + Affiliate Leaderboard ─── */}
          <div className="grid xl:grid-cols-5 gap-5 mb-5">

            {/* Orders (3 cols) */}
            <div className="xl:col-span-3 bg-slate-900 border border-white/6 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-white">Recent Orders</h2>
                <Link href="/admin/collections/orders" className="text-xs text-sky-400 hover:text-sky-300 no-underline">
                  View all →
                </Link>
              </div>
              {!stats?.recentOrders?.length ? (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-sm">No orders yet</p>
                  <p className="text-slate-600 text-xs mt-1">Orders appear here once customers make purchases</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/6">
                        {['Buyer', 'Type', 'Status', 'Amount', 'Date'].map(h => (
                          <th key={h} className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-3 pr-4 last:pr-0 last:text-right">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.slice(0, 10).map((order: any) => (
                        <tr key={order.id} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                          <td className="py-2.5 pr-4">
                            <p className="text-xs font-medium text-white truncate max-w-[140px]">{order.buyerEmail}</p>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className="text-xs text-slate-400">{order.orderType || '—'}</span>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              order.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400'
                              : order.status === 'pending' ? 'bg-amber-500/15 text-amber-400'
                              : order.status === 'refunded' ? 'bg-red-500/15 text-red-400'
                              : 'bg-slate-700 text-slate-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className="text-xs font-bold text-emerald-400">{fmt(order.amount || 0)}</span>
                          </td>
                          <td className="py-2.5 text-right">
                            <span className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Affiliates (2 cols) */}
            <div className="xl:col-span-2 bg-slate-900 border border-white/6 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-white">Affiliate Leaderboard</h2>
                <Link href="/admin/collections/affiliates" className="text-xs text-sky-400 hover:text-sky-300 no-underline">
                  Manage →
                </Link>
              </div>
              {!stats?.topAffiliates?.length ? (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-sm">No affiliates yet</p>
                  <Link href="/admin/collections/affiliates/create" className="text-xs text-emerald-400 hover:text-emerald-300 no-underline mt-2 block">
                    + Create first affiliate →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.topAffiliates.map((aff: any, i: number) => {
                    const maxEarned = Math.max(...stats.topAffiliates.map((a: any) => a.totalEarned || 0), 1)
                    const pct = ((aff.totalEarned || 0) / maxEarned) * 100
                    const rankColors = ['from-amber-400 to-yellow-300', 'from-slate-400 to-slate-300', 'from-amber-700 to-amber-600']
                    return (
                      <div key={aff.id} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black flex-shrink-0 mt-0.5 ${i < 3 ? `bg-gradient-to-br ${rankColors[i]}` : 'bg-slate-700'}`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-white truncate">{aff.displayName}</span>
                            <span className="text-xs font-bold text-violet-400 ml-2 flex-shrink-0">{fmt(aff.totalEarned || 0)}</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-1">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${i === 0 ? 'from-violet-500 to-pink-500' : 'from-violet-600 to-violet-400'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500">{aff.totalClicks || 0} clicks · {aff.totalConversions || 0} conv</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${aff.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                              {aff.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Quick Actions ─── */}
          <div className="bg-slate-900 border border-white/6 rounded-2xl p-6 mb-5">
            <h2 className="text-sm font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'New Blog Post', desc: 'Publish article', href: '/admin/collections/blog-posts/create', color: 'group-hover:border-sky-400/50', icon: '📝' },
                { label: 'Add AI Tool', desc: 'Tools directory', href: '/admin/collections/tools/create', color: 'group-hover:border-emerald-400/50', icon: '🛠️' },
                { label: 'Add Prompt Pack', desc: 'Prompt marketplace', href: '/admin/collections/prompts/create', color: 'group-hover:border-violet-400/50', icon: '✨' },
                { label: 'Add Automation', desc: 'Workflow templates', href: '/admin/collections/automations/create', color: 'group-hover:border-pink-400/50', icon: '⚡' },
                { label: 'New Affiliate', desc: 'Create partner', href: '/admin/collections/affiliates/create', color: 'group-hover:border-violet-400/50', icon: '🤝' },
                { label: 'Review Submissions', desc: `${pendingCount} pending`, href: '/admin/collections/tool-submissions', color: 'group-hover:border-amber-400/50', icon: '🔔' },
                { label: 'Subscribers', desc: `${(stats?.subscribersCount || 0).toLocaleString()} emails`, href: '/admin/collections/newsletter-subscribers', color: 'group-hover:border-pink-400/50', icon: '✉️' },
                { label: 'Ad Mockups', desc: 'Preview all ad sizes', href: '/ad-preview', color: 'group-hover:border-violet-400/50', icon: '🖼️' },
                { label: 'Payload CMS', desc: 'Full admin panel', href: '/admin', color: 'group-hover:border-slate-400/50', icon: '⚙️' },
              ].map(({ label, desc, href, icon, color }) => (
                <Link
                  key={label}
                  href={href}
                  className={`group no-underline bg-slate-800/60 hover:bg-slate-800 border border-white/5 ${color} rounded-xl p-4 flex items-start gap-3 transition-all`}
                >
                  <span className="text-xl mt-0.5 flex-shrink-0">{icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Advertising Manager ─── */}
          <div className="bg-slate-900 border border-white/6 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-white">Advertising Manager</h2>
                <p className="text-xs text-slate-500 mt-0.5">Voice Bonsai · BonsaiX · House Ads</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-lg">
                  {adStats.activeAds} active
                </span>
                <Link
                  href="/ad-preview"
                  className="text-xs bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 font-bold px-3 py-1.5 rounded-lg transition-colors no-underline border border-violet-500/20"
                >
                  Preview Ads
                </Link>
                <Link
                  href="/admin/collections/advertisements/create"
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors no-underline"
                >
                  + New Ad
                </Link>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Total Ads', value: adStats.totalAds || 0, sub: 'all units', color: 'text-sky-400', border: 'border-sky-500/20' },
                { label: 'Active', value: adStats.activeAds || 0, sub: 'running now', color: 'text-emerald-400', border: 'border-emerald-500/20' },
                { label: 'Impressions', value: adStats.ads.reduce((s: number, a: any) => s + (a.impressions || 0), 0).toLocaleString(), sub: 'total views', color: 'text-violet-400', border: 'border-violet-500/20' },
                { label: 'Clicks', value: adStats.ads.reduce((s: number, a: any) => s + (a.clicks || 0), 0).toLocaleString(), sub: 'total clicks', color: 'text-pink-400', border: 'border-pink-500/20' },
              ].map(({ label, value, sub, color, border }) => (
                <div key={label} className={`bg-slate-800/60 border ${border} rounded-xl p-3`}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-lg font-extrabold ${color}`}>{value}</p>
                  <p className="text-[10px] text-slate-600">{sub}</p>
                </div>
              ))}
            </div>

            {/* Ad Units table or empty state */}
            {adStats.ads.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                <p className="text-2xl mb-3">◈</p>
                <p className="text-sm font-semibold text-white mb-1">No ad units configured yet</p>
                <p className="text-xs text-slate-500 mb-4">House ads (Voice Bonsai + BonsaiX) are running automatically.<br />Create Payload ads to override them with custom campaigns.</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {[
                    { label: 'Voice Bonsai', advertiser: 'voice-bonsai', emoji: '🎙️', url: 'https://voicebonsai.com' },
                    { label: 'BonsaiX', advertiser: 'bonsaix', emoji: '🌿', url: 'https://bonsaix.ai' },
                  ].map(({ label, advertiser, emoji, url }) => {
                    const preset = ADVERTISER_PRESETS[advertiser]
                    return (
                      <div key={advertiser} className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${preset.bgGradient} p-3 flex items-center gap-3 w-64`}>
                        <span className="text-2xl">{emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-xs">{label}</p>
                          <p className="text-white/60 text-[10px] truncate">{url}</p>
                          <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">House Ad — Active</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Link
                  href="/admin/collections/advertisements/create"
                  className="inline-block mt-5 text-xs text-emerald-400 hover:text-emerald-300 no-underline font-semibold"
                >
                  + Create your first campaign →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/6">
                      {['Ad Name', 'Advertiser', 'Size', 'Placement', 'Status', 'Priority', 'Impressions', ''].map(h => (
                        <th key={h} className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-3 pr-4 last:pr-0">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {adStats.ads.slice(0, 10).map((ad: any) => {
                      const preset = ADVERTISER_PRESETS[ad.advertiser] ?? ADVERTISER_PRESETS.custom
                      return (
                        <tr key={ad.id} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                          <td className="py-2.5 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{preset.logoEmoji}</span>
                              <p className="text-xs font-medium text-white truncate max-w-[160px]">{ad.name}</p>
                            </div>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className="text-xs text-slate-400 capitalize">{preset.logoText}</span>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{ad.size}</span>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className="text-xs text-slate-400">{ad.placement}</span>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ad.status === 'active' ? 'bg-emerald-500/15 text-emerald-400'
                              : ad.status === 'paused' ? 'bg-amber-500/15 text-amber-400'
                              : ad.status === 'scheduled' ? 'bg-sky-500/15 text-sky-400'
                              : 'bg-slate-700 text-slate-400'
                            }`}>
                              {ad.status}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className="text-xs text-slate-400">{ad.priority}</span>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className="text-xs font-bold text-violet-400">{(ad.impressions || 0).toLocaleString()}</span>
                          </td>
                          <td className="py-2.5">
                            <Link href={`/admin/collections/advertisements/${ad.id}`} className="text-xs text-sky-400 hover:text-sky-300 no-underline">
                              Edit →
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {adStats.totalAds > 10 && (
                  <div className="mt-3 text-center">
                    <Link href="/admin/collections/advertisements" className="text-xs text-sky-400 hover:text-sky-300 no-underline">
                      View all {adStats.totalAds} ads →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Ad Size Reference */}
            <div className="mt-6 border-t border-white/6 pt-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">7 Supported Ad Sizes</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
                {[
                  { size: 'Leaderboard', dims: '728×90', placement: 'Below nav, global' },
                  { size: 'Billboard', dims: '970×250', placement: 'Homepage hero' },
                  { size: 'Med. Rectangle', dims: '300×250', placement: 'Inline / sidebar' },
                  { size: 'Lg. Rectangle', dims: '336×280', placement: 'Inline content' },
                  { size: 'Half Page', dims: '300×600', placement: 'Sidebar' },
                  { size: 'Mobile Banner', dims: '320×50', placement: 'Mobile only' },
                  { size: 'Skyscraper', dims: '160×600', placement: 'Wide sidebar' },
                ].map(({ size, dims, placement }) => (
                  <div key={size} className="bg-slate-800/60 border border-white/5 rounded-lg p-2 text-center">
                    <p className="text-[10px] font-bold text-white">{size}</p>
                    <p className="text-[10px] font-mono text-emerald-400 mt-0.5">{dims}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">{placement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
