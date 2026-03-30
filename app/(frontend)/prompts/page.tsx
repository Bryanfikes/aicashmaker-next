import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Prompt Marketplace — Buy & Sell ChatGPT, Claude & Midjourney Prompts',
  description: 'Browse 20+ premium AI prompt packs for ChatGPT, Claude, Midjourney, and more. Ready-to-use prompts that generate real income.',
}

const MODEL_COLORS: Record<string, string> = {
  ChatGPT:   'bg-emerald-100 text-emerald-700',
  Midjourney:'bg-violet-100 text-violet-700',
  Claude:    'bg-amber-100 text-amber-700',
  Gemini:    'bg-sky-100 text-sky-700',
  Multiple:  'bg-sky-100 text-sky-700',
}

async function getPrompts() {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'prompts',
      where: { published: { equals: true } },
      limit: 100,
      sort: '-createdAt',
    })
    return result.docs
  } catch {
    return []
  }
}

export default async function PromptsPage() {
  const allPrompts = await getPrompts()
  const featured = allPrompts.filter((p: any) => p.featured)
  const rest = allPrompts.filter((p: any) => !p.featured)

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">AI Prompt Marketplace</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-violet-500/15 border border-violet-500/30 text-violet-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            Prompt Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            AI <span className="text-violet-400">Prompt</span> Marketplace
          </h1>
          <p className="text-slate-400 text-lg mb-10">
            Buy and sell the best AI prompts for ChatGPT, Claude, Midjourney, and every major AI model. Unlock outputs that actually convert.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#prompts" className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors no-underline">Browse Prompts</a>
            <Link href="/submit-product" className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors border border-white/20 no-underline">Sell Your Prompts</Link>
          </div>
          <div className="flex justify-center gap-8 mt-10 flex-wrap">
            {[
              [String(allPrompts.length) + '+', 'Prompt Packs'],
              ['All Models', 'ChatGPT, Claude, MJ & more'],
              ['Instant', 'Download after purchase'],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold text-white">{val}</div>
                <div className="text-xs text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillar quick-links */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-bold text-slate-400 flex-shrink-0 mr-1">Explore:</span>
          {[
            ['/tools', '🛠️ AI Tools'],
            ['/side-hustles', '💰 Side Hustles'],
            ['/automations', '⚡ Automations'],
            ['/blog', '📝 Income Guides'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-violet-400 hover:text-violet-600 transition-colors no-underline"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10" id="prompts">

        {/* Featured */}
        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6">Featured Packs</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {featured.map((p: any) => (
                <Link
                  key={p.slug}
                  href={`/prompts/${p.slug}`}
                  className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-violet-500/20 overflow-hidden no-underline hover:border-violet-400/40 transition-colors block"
                >
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-violet-600 to-violet-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">FEATURED</span>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${MODEL_COLORS[p.model] || 'bg-slate-600 text-slate-200'}`}>{p.model}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-2 pr-20">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">{p.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-violet-400">${p.price}</span>
                    {p.promptCount && <span className="text-xs text-slate-400">{p.promptCount}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Packs */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900">All Prompt Packs</h2>
          <span className="text-sm text-slate-400">Showing {allPrompts.length} packs</span>
        </div>

        {allPrompts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-semibold mb-2">Coming soon</p>
            <p className="text-sm">Premium prompt packs are being added now.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(rest.length > 0 ? rest : allPrompts).map((p: any) => (
              <div key={p.slug} className="bg-white border border-slate-200 rounded-2xl flex flex-col hover:border-violet-300 hover:shadow-md transition-all">
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${MODEL_COLORS[p.model] || 'bg-slate-100 text-slate-600'}`}>{p.model}</span>
                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded font-medium">{p.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-extrabold text-slate-900">${p.price}</span>
                    {p.promptCount && <span className="text-xs text-violet-600 font-semibold bg-violet-50 px-2 py-0.5 rounded">{p.promptCount}</span>}
                  </div>
                </div>
                <div className="px-4 py-3 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2">{p.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-3">{p.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-400 to-sky-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {(p.creatorName || 'A')[0]}
                      </div>
                      <span className="text-xs font-medium text-slate-600">{p.creatorName || 'AICashMaker'}</span>
                    </div>
                    {p.rating && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span className="text-amber-400">★</span>
                        <span>{p.rating}</span>
                        {p.reviewCount && <span>({p.reviewCount})</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <Link
                    href={`/prompts/${p.slug}`}
                    className="flex-1 text-center bg-white border border-slate-200 hover:border-violet-400 text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors no-underline"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/prompts/${p.slug}`}
                    className="flex-1 text-center bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg text-xs transition-colors no-underline"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sell section */}
      <section id="sell" className="bg-gradient-to-br from-slate-900 to-sky-950 py-16 px-4 text-center mt-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">Sell Your Prompts</h2>
          <p className="text-slate-400 text-base mb-8">List your prompts on AICashMaker and start earning. Keep 80% of every sale. Thousands of buyers are looking for exactly what you&apos;ve built.</p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              ['1', 'Create Your Pack', 'Bundle your best prompts into a cohesive pack around a niche or use case.'],
              ['2', 'Submit & Get Approved', 'Submit your pack for review. Most are approved within 48 hours.'],
              ['3', 'Start Earning', 'Get paid automatically. Keep 80% of every sale via Stripe direct deposit.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="bg-white/5 border border-white/10 rounded-xl p-5 text-left">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-black text-sm mb-3 mx-auto">{num}</div>
                <h4 className="text-white font-bold text-sm mb-1.5">{title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <Link href="/submit-product" className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors no-underline">
            Start Selling Your Prompts →
          </Link>
        </div>
      </section>
    </>
  )
}
