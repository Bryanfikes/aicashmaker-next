import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Automation Templates — Make.com, Zapier & n8n Workflows',
  description: 'Browse 20+ ready-to-deploy AI automation templates for Make.com, Zapier, n8n, and more. Import once, save hundreds of hours every month.',
}

const PLATFORM_STYLES: Record<string, { badge: string; dot: string }> = {
  'Make.com':   { badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  'Zapier':     { badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  'n8n':        { badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
  'Custom API': { badge: 'bg-sky-100 text-sky-700',       dot: 'bg-sky-500' },
}

const COMPLEXITY_COLORS: Record<string, string> = {
  Beginner:     'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced:     'bg-red-100 text-red-700',
}

async function getAutomations() {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'automations',
      where: { published: { equals: true } },
      limit: 100,
      sort: '-createdAt',
    })
    return result.docs
  } catch {
    return []
  }
}

export default async function AutomationsPage() {
  const all = await getAutomations()
  const featured = all.filter((a: any) => a.featured)
  const rest = all.filter((a: any) => !a.featured)
  const display = rest.length > 0 ? rest : all

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">AI Automations</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 py-20 px-4 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative">
          <div className="inline-block bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            Automation Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            AI <span className="text-emerald-400">Automation</span> Marketplace
          </h1>
          <p className="text-slate-400 text-lg mb-10">
            Ready-to-deploy automations for Make.com, Zapier, n8n, and more. Import once, save hundreds of hours every month.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-10">
            <a href="#automations" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors no-underline">Browse Automations</a>
            <Link href="/submit-product" className="border border-white/30 text-white hover:bg-white/10 font-bold px-6 py-3 rounded-xl text-sm transition-colors no-underline">Submit a Workflow</Link>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            {['Make.com', 'Zapier', 'n8n', 'Custom API', 'Airtable', 'Notion'].map(p => (
              <span key={p} className="bg-white/8 border border-white/12 rounded-lg px-4 py-2 text-xs font-bold text-slate-300">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Pillar quick-links */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 flex-shrink-0 mr-1">Explore:</span>
          {[
            ['/tools', '🛠️ AI Tools'],
            ['/side-hustles', '💰 Side Hustles'],
            ['/prompts', '✨ Prompts'],
            ['/blog', '📝 Income Guides'],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors no-underline">
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10" id="automations">

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            [String(all.length) + '+', 'Automation Templates'],
            ['4', 'Platforms Supported'],
            ['10+', 'Use Case Categories'],
            ['80%', 'Creator Revenue Share'],
          ].map(([val, label]) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-emerald-600">{val}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6">Featured Automations</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {featured.map((a: any) => {
                const ps = PLATFORM_STYLES[a.platform] || PLATFORM_STYLES['Custom API']
                return (
                  <Link key={a.slug} href={`/automations/${a.slug}`} className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-emerald-500/20 overflow-hidden no-underline hover:border-emerald-400/40 transition-colors block">
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">FEATURED</span>
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ps.badge}`}>{a.platform}</span>
                      <span className="text-xs text-slate-400">{a.category}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-white mb-2 pr-20">{a.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">{a.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-emerald-400">${a.price}</span>
                      {a.timeSaved && <span className="text-xs text-slate-400">⏱ {a.timeSaved}</span>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* All automations */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900">All Automation Templates</h2>
          <span className="text-sm text-slate-400">Showing {all.length} templates</span>
        </div>

        {all.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-semibold mb-2">Coming soon</p>
            <p className="text-sm">Automation templates are being added now.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {display.map((a: any) => {
              const ps = PLATFORM_STYLES[a.platform] || PLATFORM_STYLES['Custom API']
              const cc = COMPLEXITY_COLORS[a.complexity] || COMPLEXITY_COLORS.Beginner
              const features: { feature: string }[] = a.features || []
              return (
                <div key={a.slug} className="bg-white border border-slate-200 rounded-2xl flex flex-col hover:border-emerald-300 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ps.badge}`}>{a.platform}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cc}`}>{a.complexity}</span>
                    </div>
                    <span className="text-xl font-extrabold text-slate-900">${a.price}</span>
                  </div>
                  <div className="px-4 py-3 flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{a.category}</p>
                    <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2">{a.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{a.excerpt}</p>
                    {features.slice(0, 2).map((f, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-500 mb-1">
                        <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                        <span className="line-clamp-1">{f.feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pb-4 flex gap-2">
                    <Link href={`/automations/${a.slug}`} className="flex-1 text-center bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors no-underline">
                      Preview
                    </Link>
                    <Link href={`/automations/${a.slug}`} className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-xs transition-colors no-underline">
                      Get Template
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Sell section */}
      <section className="bg-gradient-to-br from-slate-900 to-emerald-950 py-16 px-4 text-center mt-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">Sell Your Automations</h2>
          <p className="text-slate-400 text-base mb-8">Built a workflow that saves hours every week? Sell it here. Keep 80% of every sale. Thousands of businesses are looking for exactly what you&apos;ve built.</p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              ['1', 'Export Your Workflow', 'Export your Make.com, Zapier, or n8n template as a shareable file or JSON.'],
              ['2', 'Submit for Review', 'We review every template for quality. Most are approved within 48 hours.'],
              ['3', 'Earn Passively', '80% of every sale goes directly to you via Stripe. Set it and forget it.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="bg-white/5 border border-white/10 rounded-xl p-5 text-left">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-sm mb-3 mx-auto">{num}</div>
                <h4 className="text-white font-bold text-sm mb-1.5">{title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <Link href="/submit-product" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors no-underline">
            Submit Your Automation →
          </Link>
        </div>
      </section>
    </>
  )
}
