import React from 'react'
import { getPayload } from '@/lib/payload'

// ── Palette (inline styles — no Tailwind in Payload admin context) ───────────
const C = {
  bg0:       '#020617',  // slate-950
  bg1:       '#0a1028',  // raised surface
  bg2:       '#0f172a',  // card
  bg3:       '#111c36',  // input / panel
  border:    'rgba(255,255,255,0.06)',
  borderEm:  'rgba(16,185,129,0.25)',
  text:      '#e2e8f0',  // slate-200
  textMid:   '#94a3b8',  // slate-400
  textDim:   '#475569',  // slate-600
  emerald:   '#10b981',
  emeraldBr: '#34d399',
  sky:       '#0ea5e9',
  violet:    '#8b5cf6',
  pink:      '#ec4899',
  amber:     '#f59e0b',
  red:       '#ef4444',
  white:     '#ffffff',
}

// ── Data ─────────────────────────────────────────────────────────────────────

async function fetchStats() {
  try {
    const payload = await getPayload()

    const [
      orders, affiliates, subscribers, toolSubs, productSubs,
      tools, blogPosts, prompts, automations, sideHustles, advertisements,
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
      payload.find({ collection: 'advertisements', where: { status: { equals: 'active' } }, limit: 0, overrideAccess: true }),
    ])

    const [recentOrders, topAffiliates, paidOrders, pendingSubs, users] = await Promise.all([
      payload.find({ collection: 'orders', limit: 8, sort: '-createdAt', overrideAccess: true }),
      payload.find({ collection: 'affiliates', limit: 6, sort: '-totalEarned', overrideAccess: true }),
      payload.find({ collection: 'orders', where: { status: { equals: 'paid' } }, limit: 1000, overrideAccess: true }),
      payload.find({ collection: 'tool-submissions', where: { status: { equals: 'pending' } }, limit: 0, overrideAccess: true }),
      payload.find({ collection: 'users', limit: 0, overrideAccess: true }),
    ])

    const totalRevenue = paidOrders.docs.reduce((s: number, o: any) => s + (o.amount || 0), 0)
    const totalPlatformFee = paidOrders.docs.reduce((s: number, o: any) => s + (o.platformFee || 0), 0)
    const totalAffiliatePaid = topAffiliates.docs.reduce((s: number, a: any) => s + (a.totalPaid || 0), 0)

    const now = new Date()
    const months: { label: string; revenue: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        label: d.toLocaleString('en-US', { month: 'short' }),
        revenue: paidOrders.docs.filter((o: any) => {
          const od = new Date(o.createdAt)
          return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth()
        }).reduce((s: number, o: any) => s + (o.amount || 0), 0),
      })
    }

    return {
      totalRevenue, totalPlatformFee, totalAffiliatePaid,
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
      pendingSubsCount: pendingSubs.totalDocs,
      activeAds: advertisements.totalDocs,
      usersCount: users.totalDocs,
      recentOrders: recentOrders.docs,
      topAffiliates: topAffiliates.docs,
      months,
      maxMonth: Math.max(...months.map(m => m.revenue), 1),
    }
  } catch (e) {
    console.error('AdminDashboard stats error:', e)
    return null
  }
}

function dollars(cents: number) {
  const d = cents / 100
  if (d >= 1000) return '$' + (d / 1000).toFixed(1) + 'k'
  return '$' + d.toFixed(0)
}

function fullDollars(cents: number) {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = {
  wrap: {
    padding: '24px 28px',
    minHeight: '100vh',
    background: C.bg0,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  } as React.CSSProperties,

  card: {
    background: C.bg2,
    border: `1px solid ${C.border}`,
    borderRadius: '16px',
    padding: '20px 22px',
    position: 'relative',
    overflow: 'hidden',
  } as React.CSSProperties,

  h2: {
    fontSize: '13px',
    fontWeight: 700,
    color: C.white,
    margin: 0,
    letterSpacing: '-0.01em',
  } as React.CSSProperties,

  label: {
    fontSize: '10px',
    fontWeight: 700,
    color: C.textDim,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  } as React.CSSProperties,

  a: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'block',
  } as React.CSSProperties,
}

// ── Component ─────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  const stats = await fetchStats()
  const pending = (stats?.pendingSubsCount || 0) + (stats?.productSubsCount || 0)

  return (
    <div style={s.wrap}>

      {/* ── Page header ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: C.white, margin: 0, letterSpacing: '-0.02em' }}>
            AICashMaker
          </h1>
          <p style={{ fontSize: '13px', color: C.textMid, margin: '3px 0 0', fontWeight: 500 }}>
            Platform Overview · Live Data
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {pending > 0 && (
            <a
              href="/admin/collections/tool-submissions"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '10px',
                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
                color: C.amber, fontSize: '12px', fontWeight: 700, textDecoration: 'none',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.amber, display: 'inline-block' }} />
              {pending} pending
            </a>
          )}
          <a
            href="/admin-dashboard"
            style={{
              padding: '7px 14px', borderRadius: '10px',
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)',
              color: C.emeraldBr, fontSize: '12px', fontWeight: 700, textDecoration: 'none',
            }}
          >
            Full Dashboard ↗
          </a>
          <a
            href="/admin/collections/advertisements/create"
            style={{
              padding: '7px 14px', borderRadius: '10px',
              background: 'linear-gradient(135deg,#10b981,#059669)',
              color: C.white, fontSize: '12px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
            }}
          >
            + New Ad
          </a>
        </div>
      </div>

      {/* ── KPI Row ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Gross Revenue', value: fullDollars(stats?.totalRevenue || 0), sub: `${stats?.paidOrdersCount || 0} paid orders`, color: C.emerald, glow: 'rgba(16,185,129,0.08)' },
          { label: 'Platform Net', value: fullDollars(stats?.totalPlatformFee || 0), sub: '20% platform cut', color: C.sky, glow: 'rgba(14,165,233,0.08)' },
          { label: 'Affiliate Paid', value: fullDollars(stats?.totalAffiliatePaid || 0), sub: `${stats?.affiliatesCount || 0} partners`, color: C.violet, glow: 'rgba(139,92,246,0.08)' },
          { label: 'Email List', value: (stats?.subscribersCount || 0).toLocaleString(), sub: 'newsletter subscribers', color: C.pink, glow: 'rgba(236,72,153,0.08)' },
        ].map(({ label, value, sub, color, glow }) => (
          <div key={label} style={{ ...s.card, background: `linear-gradient(135deg, ${glow}, ${C.bg2})` }}>
            <div style={{ ...s.label, marginBottom: '10px' }}>{label}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color, marginBottom: '4px', letterSpacing: '-0.02em' }}>{value}</div>
            <div style={{ fontSize: '11px', color: C.textDim, fontWeight: 500 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Row 2: Revenue chart + Content inventory + Ad stats ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>

        {/* Revenue sparkline */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={s.h2}>Monthly Revenue</h2>
              <p style={{ fontSize: '11px', color: C.textDim, margin: '3px 0 0' }}>Last 6 months</p>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: C.emerald, background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '20px' }}>
              {fullDollars(stats?.totalRevenue || 0)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
            {(stats?.months || []).map(({ label, revenue }) => {
              const pct = stats?.maxMonth ? (revenue / stats.maxMonth) * 100 : 0
              return (
                <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '9px', color: C.textDim, fontFamily: 'monospace' }}>
                    {revenue > 0 ? dollars(revenue) : ''}
                  </span>
                  <div style={{ width: '100%', position: 'relative', height: '56px', display: 'flex', alignItems: 'flex-end' }}>
                    <div
                      style={{
                        width: '100%',
                        borderRadius: '5px 5px 0 0',
                        background: revenue > 0 ? 'linear-gradient(180deg,#34d399,#10b981)' : C.bg3,
                        height: `${revenue > 0 ? Math.max(pct, 4) : 3}%`,
                        minHeight: revenue > 0 ? '4px' : '2px',
                        transition: 'height 0.3s',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '10px', color: C.textDim, fontWeight: 600 }}>{label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Content inventory */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={s.h2}>Content</h2>
            <span style={{ fontSize: '10px', color: C.textDim }}>Published</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'AI Tools', val: stats?.toolsCount || 0, href: '/admin/collections/tools', color: C.sky },
              { label: 'Blog Posts', val: stats?.blogPostsCount || 0, href: '/admin/collections/blog-posts', color: C.violet },
              { label: 'Prompts', val: stats?.promptsCount || 0, href: '/admin/collections/prompts', color: C.pink },
              { label: 'Automations', val: stats?.automationsCount || 0, href: '/admin/collections/automations', color: C.emerald },
              { label: 'Side Hustles', val: stats?.sideHustlesCount || 0, href: '/admin/collections/side-hustles', color: C.amber },
            ].map(({ label, val, href, color }) => {
              const max = Math.max(stats?.toolsCount || 0, stats?.blogPostsCount || 0, stats?.promptsCount || 0, stats?.automationsCount || 0, stats?.sideHustlesCount || 0, 1)
              return (
                <a key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                  <span style={{ fontSize: '11px', color: C.textMid, width: '72px', flexShrink: 0, fontWeight: 500 }}>{label}</span>
                  <div style={{ flex: 1, height: '4px', background: C.bg3, borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(val / max) * 100}%`, background: color, borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: C.white, width: '20px', textAlign: 'right' }}>{val}</span>
                </a>
              )
            })}
          </div>
        </div>

        {/* Advertising & Submissions */}
        <div style={s.card}>
          <h2 style={{ ...s.h2, marginBottom: '16px' }}>Platform</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Active Ads', value: stats?.activeAds || 0, href: '/admin/collections/advertisements', color: C.emerald, badge: 'LIVE' },
              { label: 'Orders', value: stats?.ordersCount || 0, href: '/admin/collections/orders', color: C.sky, badge: null },
              { label: 'Affiliates', value: stats?.affiliatesCount || 0, href: '/admin/collections/affiliates', color: C.violet, badge: null },
              { label: 'Pending Review', value: pending, href: '/admin/collections/tool-submissions', color: pending > 0 ? C.amber : C.textDim, badge: pending > 0 ? 'ACTION' : null },
              { label: 'Users', value: stats?.usersCount || 0, href: '/admin/collections/users', color: C.textMid, badge: null },
            ].map(({ label, value, href, color, badge }) => (
              <a key={label} href={href} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 10px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}>
                <span style={{ fontSize: '12px', color: C.textMid, fontWeight: 500 }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {badge && (
                    <span style={{ fontSize: '9px', fontWeight: 800, background: color === C.amber ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)', color, padding: '2px 6px', borderRadius: '10px', letterSpacing: '0.06em' }}>{badge}</span>
                  )}
                  <span style={{ fontSize: '13px', fontWeight: 800, color }}>{value.toLocaleString()}</span>
                </div>
              </a>
            ))}
          </div>
          <a
            href="/ad-preview"
            style={{
              display: 'block', marginTop: '12px', textAlign: 'center',
              padding: '7px', borderRadius: '8px',
              background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
              color: '#a78bfa', fontSize: '11px', fontWeight: 700, textDecoration: 'none',
            }}
          >
            Preview Ad Mockups →
          </a>
        </div>
      </div>

      {/* ── Row 3: Orders table + Affiliate leaderboard ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '12px', marginBottom: '16px' }}>

        {/* Orders table */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={s.h2}>Recent Orders</h2>
            <a href="/admin/collections/orders" style={{ fontSize: '11px', color: C.sky, textDecoration: 'none', fontWeight: 600 }}>View all →</a>
          </div>
          {!stats?.recentOrders?.length ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: C.textDim, fontSize: '13px' }}>
              No orders yet
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Buyer', 'Type', 'Status', 'Amount', 'Date'].map(h => (
                      <th key={h} style={{ ...s.label, padding: '0 12px 10px 0', textAlign: 'left', fontWeight: 800 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.slice(0, 8).map((o: any) => (
                    <tr key={o.id} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: '9px 12px 9px 0', fontSize: '12px', color: C.text, maxWidth: '140px' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{o.buyerEmail}</span>
                      </td>
                      <td style={{ padding: '9px 12px 9px 0', fontSize: '11px', color: C.textMid }}>{o.orderType || '—'}</td>
                      <td style={{ padding: '9px 12px 9px 0' }}>
                        <span style={{
                          fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '20px', letterSpacing: '0.06em',
                          background: o.status === 'paid' ? 'rgba(16,185,129,0.15)' : o.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                          color: o.status === 'paid' ? C.emerald : o.status === 'pending' ? C.amber : C.red,
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: '9px 12px 9px 0', fontSize: '12px', fontWeight: 700, color: C.emerald }}>{fullDollars(o.amount || 0)}</td>
                      <td style={{ padding: '9px 0', fontSize: '11px', color: C.textDim, whiteSpace: 'nowrap' }}>
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Affiliate leaderboard */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={s.h2}>Affiliates</h2>
            <a href="/admin/collections/affiliates" style={{ fontSize: '11px', color: C.sky, textDecoration: 'none', fontWeight: 600 }}>Manage →</a>
          </div>
          {!stats?.topAffiliates?.length ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ color: C.textDim, fontSize: '13px', margin: '0 0 10px' }}>No affiliates yet</p>
              <a href="/admin/collections/affiliates/create" style={{ color: C.emerald, fontSize: '12px', textDecoration: 'none', fontWeight: 600 }}>+ Create first affiliate →</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {stats.topAffiliates.map((aff: any, i: number) => {
                const maxE = Math.max(...stats.topAffiliates.map((a: any) => a.totalEarned || 0), 1)
                const pct = ((aff.totalEarned || 0) / maxE) * 100
                const rankBg = i === 0 ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' : i === 1 ? 'linear-gradient(135deg,#94a3b8,#64748b)' : i === 2 ? 'linear-gradient(135deg,#b45309,#92400e)' : C.bg3
                return (
                  <div key={aff.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: rankBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, color: C.white, flexShrink: 0, marginTop: '2px' }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{aff.displayName}</span>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: C.violet, marginLeft: '8px', flexShrink: 0 }}>{fullDollars(aff.totalEarned || 0)}</span>
                      </div>
                      <div style={{ height: '3px', background: C.bg3, borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: i === 0 ? 'linear-gradient(90deg,#8b5cf6,#ec4899)' : C.violet, borderRadius: '2px' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10px', color: C.textDim }}>{aff.totalClicks || 0} clicks · {aff.totalConversions || 0} conv</span>
                        <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '10px', background: aff.status === 'active' ? 'rgba(16,185,129,0.12)' : C.bg3, color: aff.status === 'active' ? C.emerald : C.textDim }}>{aff.status}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 4: Quick actions ─── */}
      <div style={s.card}>
        <h2 style={{ ...s.h2, marginBottom: '14px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {[
            { label: 'New Blog Post', desc: 'Publish article', href: '/admin/collections/blog-posts/create', icon: '📝', accent: C.sky },
            { label: 'Add AI Tool', desc: 'Tools directory', href: '/admin/collections/tools/create', icon: '🛠️', accent: C.emerald },
            { label: 'Add Prompt', desc: 'Prompt pack', href: '/admin/collections/prompts/create', icon: '✨', accent: C.violet },
            { label: 'Add Automation', desc: 'Workflow template', href: '/admin/collections/automations/create', icon: '⚡', accent: C.pink },
            { label: 'New Affiliate', desc: 'Create partner', href: '/admin/collections/affiliates/create', icon: '🤝', accent: C.violet },
            { label: 'New Ad Unit', desc: 'Ad campaign', href: '/admin/collections/advertisements/create', icon: '◈', accent: C.emerald },
            { label: 'Ad Mockups', desc: 'Preview all sizes', href: '/ad-preview', icon: '🖼️', accent: C.violet },
            { label: 'Subscribers', desc: `${(stats?.subscribersCount || 0).toLocaleString()} emails`, href: '/admin/collections/newsletter-subscribers', icon: '✉️', accent: C.pink },
            { label: 'Review Queue', desc: `${pending} pending`, href: '/admin/collections/tool-submissions', icon: '🔔', accent: C.amber },
            { label: 'Live Site', desc: 'aicashmaker.com', href: '/', icon: '⬡', accent: C.textMid },
          ].map(({ label, desc, href, icon, accent }) => (
            <a
              key={label}
              href={href}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '12px 14px', borderRadius: '12px',
                background: C.bg3, border: `1px solid ${C.border}`,
                textDecoration: 'none', transition: 'border-color 0.15s',
              }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: C.white, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</p>
                <p style={{ fontSize: '10px', color: C.textDim, margin: '2px 0 0', fontWeight: 500 }}>{desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}
