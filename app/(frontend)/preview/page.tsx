/**
 * Temporary UI preview page — remove before production.
 * Shows dashboard, account, and affiliate portal layouts with mock data.
 */
import Link from 'next/link'

const LightningLogo = () => (
  <div className="flex items-center gap-2">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#0ea5e9" stroke="#0ea5e9" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="text-lg font-extrabold text-white tracking-tight">
      AI<span className="text-sky-400">Cash</span>Maker
    </span>
  </div>
)

function Sidebar({ title, nav, badge, name, initials, gradient }: {
  title: string
  nav: { label: string; active?: boolean }[]
  badge?: string
  name: string
  initials: string
  gradient: string
}) {
  return (
    <aside className="w-64 shrink-0 bg-slate-900 min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-slate-800">
        <LightningLogo />
        <p className="text-xs text-slate-500 mt-0.5">{title}</p>
      </div>
      <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
          style={{ background: gradient }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          {badge && (
            <span className="inline-flex items-center gap-1 text-xs bg-sky-500/20 text-sky-400 font-semibold px-2 py-0.5 rounded-full mt-0.5">
              {badge}
            </span>
          )}
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
              item.active ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'
            }`}
          >
            <div className="w-4 h-4 rounded bg-current opacity-60" />
            {item.label}
          </div>
        ))}
      </nav>
      <div className="px-3 pb-5 border-t border-slate-800 pt-3">
        <div className="flex items-center gap-3 px-3 py-2 text-xs text-slate-500">← Back to site</div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400">
          <div className="w-4 h-4 rounded bg-current opacity-60" /> Sign out
        </div>
      </div>
    </aside>
  )
}

function PageHeader({ title, sub, cta }: { title: string; sub: string; cta?: string }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-white">{title}</h1>
        <p className="text-sm text-slate-400 mt-1">{sub}</p>
      </div>
      {cta && (
        <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-xl text-sm">
          {cta}
        </button>
      )}
    </div>
  )
}

function StatCard({ icon, value, label, sub, bg, iconColor }: {
  icon: string; value: string; label: string; sub: string; bg: string; iconColor: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4 text-xl`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-700 mt-0.5">{label}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6 space-y-16">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Dashboard UI Preview</h1>
        <p className="text-slate-500 mt-2 text-sm">Visual preview of all three portals. Delete this page before launch.</p>
        <div className="flex gap-3 justify-center mt-4 flex-wrap">
          <Link href="/login" className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-xl text-sm">Login Page</Link>
        </div>
      </div>

      {/* ── CREATOR DASHBOARD ── */}
      <section>
        <h2 className="text-lg font-bold text-slate-700 mb-3 uppercase tracking-wide text-sm">Creator Dashboard</h2>
        <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 flex" style={{ height: 600 }}>
          <Sidebar
            title="Creator Dashboard"
            name="Alex Chen"
            initials="AC"
            gradient="linear-gradient(135deg,#8b5cf6,#7c3aed)"
            badge="✓ Verified"
            nav={[
              { label: 'Overview', active: true },
              { label: 'Products' },
              { label: 'Earnings' },
              { label: 'Profile' },
            ]}
          />
          <div className="flex-1 overflow-auto bg-slate-50">
            <PageHeader title="Welcome back, Alex" sub="Here's how your products are performing." cta="Add Product" />
            <div className="p-8">
              <div className="grid grid-cols-4 gap-5 mb-8">
                <StatCard icon="💰" value="$3,840" label="Total Earnings" sub="80% after platform fee" bg="bg-emerald-50" iconColor="text-emerald-600" />
                <StatCard icon="🛒" value="48" label="Total Sales" sub="Completed orders" bg="bg-sky-50" iconColor="text-sky-600" />
                <StatCard icon="📦" value="6" label="Live Products" sub="All approved" bg="bg-violet-50" iconColor="text-violet-600" />
                <StatCard icon="📊" value="$80" label="Avg. Per Sale" sub="Your avg. creator payout" bg="bg-amber-50" iconColor="text-amber-600" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Recent Sales</span>
                  <span className="text-sm text-sky-500">View all</span>
                </div>
                {[
                  { product: 'Ultimate ChatGPT Prompt Pack', buyer: 'sarah@email.com', amount: '+$72', status: 'fulfilled', color: 'bg-emerald-50 text-emerald-700' },
                  { product: 'AI Content Template Bundle', buyer: 'john@email.com', amount: '+$48', status: 'paid', color: 'bg-sky-50 text-sky-700' },
                  { product: 'Midjourney Mastery Course', buyer: 'kate@email.com', amount: '+$120', status: 'fulfilled', color: 'bg-emerald-50 text-emerald-700' },
                ].map((row) => (
                  <div key={row.buyer} className="px-6 py-4 flex items-center justify-between border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{row.product}</p>
                      <p className="text-xs text-slate-400">{row.buyer} · Mar 28, 2026</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-emerald-600">{row.amount}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${row.color}`}>{row.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOMER PORTAL ── */}
      <section>
        <h2 className="text-lg font-bold text-slate-700 mb-3 uppercase tracking-wide text-sm">Customer Portal</h2>
        <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 flex" style={{ height: 580 }}>
          <Sidebar
            title="My Account"
            name="Sarah Johnson"
            initials="SJ"
            gradient="linear-gradient(135deg,#0ea5e9,#0284c7)"
            badge="Customer"
            nav={[
              { label: 'Overview', active: true },
              { label: 'My Purchases' },
              { label: 'Settings' },
            ]}
          />
          <div className="flex-1 overflow-auto bg-slate-50">
            <PageHeader title="Welcome back, Sarah" sub="Here are your recent purchases." />
            <div className="p-8">
              <div className="grid grid-cols-3 gap-5 mb-8">
                <StatCard icon="🛍️" value="7" label="Total Purchases" sub="All time" bg="bg-sky-50" iconColor="text-sky-600" />
                <StatCard icon="💳" value="$319" label="Total Spent" sub="Across all products" bg="bg-emerald-50" iconColor="text-emerald-600" />
                <StatCard icon="⬇️" value="5" label="Downloads Available" sub="Ready to access" bg="bg-violet-50" iconColor="text-violet-600" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Recent Purchases</span>
                  <span className="text-sm text-sky-500">View all</span>
                </div>
                {[
                  { product: 'Ultimate ChatGPT Prompt Pack', amount: '$89', status: 'fulfilled', canDownload: true },
                  { product: 'AI SEO Agency Blueprint', amount: '$149', status: 'fulfilled', canDownload: true },
                  { product: 'Midjourney Starter Kit', amount: '$49', status: 'pending', canDownload: false },
                ].map((row) => (
                  <div key={row.product} className="px-6 py-4 flex items-center justify-between border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{row.product}</p>
                      <p className="text-xs text-slate-400">Mar 28, 2026</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-700">{row.amount}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${row.status === 'fulfilled' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{row.status}</span>
                      {row.canDownload && <button className="bg-emerald-500 text-white text-xs font-semibold rounded-xl px-3 py-1.5">⬇ Download</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AFFILIATE PORTAL ── */}
      <section>
        <h2 className="text-lg font-bold text-slate-700 mb-3 uppercase tracking-wide text-sm">Affiliate Portal</h2>
        <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 flex" style={{ height: 640 }}>
          <Sidebar
            title="Affiliate Portal"
            name="Marcus Williams"
            initials="MW"
            gradient="linear-gradient(135deg,#0ea5e9,#0369a1)"
            badge="Active · 30% commission"
            nav={[
              { label: 'Overview', active: true },
              { label: 'My Links' },
              { label: 'Referrals' },
              { label: 'Payouts' },
              { label: 'Settings' },
            ]}
          />
          <div className="flex-1 overflow-auto bg-slate-50">
            <PageHeader title="Welcome back, Marcus" sub="Here's how your referrals are performing." />
            <div className="p-8">
              <div className="grid grid-cols-4 gap-5 mb-6">
                <StatCard icon="👆" value="1,247" label="Total Clicks" sub="Lifetime referral clicks" bg="bg-sky-50" iconColor="text-sky-600" />
                <StatCard icon="✅" value="38" label="Conversions" sub="Completed sales" bg="bg-violet-50" iconColor="text-violet-600" />
                <StatCard icon="📈" value="3.1%" label="Conversion Rate" sub="Clicks to sales" bg="bg-sky-50" iconColor="text-sky-600" />
                <StatCard icon="💰" value="$1,026" label="Total Earned" sub="Lifetime commissions" bg="bg-emerald-50" iconColor="text-emerald-600" />
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Pending Earnings</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Approved commissions awaiting payout</p>
                </div>
                <p className="text-2xl font-bold text-emerald-700">$342.00</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm font-semibold text-slate-900 mb-3">Your Referral Code</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-900 rounded-xl px-4 py-3 font-mono text-sky-400 text-sm tracking-widest">
                    MARCUS30
                  </div>
                  <button className="bg-sky-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm">Copy Code</button>
                </div>
                <p className="text-xs text-slate-400 mt-2">Your link: <span className="font-mono text-slate-600">aicashmaker.com?ref=MARCUS30</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center text-xs text-slate-400 pb-6">
        Remove <code className="bg-slate-100 px-1 py-0.5 rounded">/preview</code> page before going live.
      </div>
    </div>
  )
}
