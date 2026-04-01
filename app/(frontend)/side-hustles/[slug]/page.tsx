import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

const DIFFICULTY_MAP: Record<string, { label: string; color: string; border: string; desc: string }> = {
  beginner:     { label: 'Beginner',     color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200', desc: 'No prior experience needed' },
  intermediate: { label: 'Intermediate', color: 'bg-amber-100   text-amber-700',   border: 'border-amber-200',   desc: 'Some skills helpful' },
  advanced:     { label: 'Advanced',     color: 'bg-red-100     text-red-700',     border: 'border-red-200',     desc: 'Strong skill set required' },
}

async function getHustle(slug: string) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'side-hustles',
      where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
      limit: 1,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

async function getRelated(difficulty: string, currentSlug: string) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'side-hustles',
      where: {
        and: [
          { published: { equals: true } },
          { slug: { not_equals: currentSlug } },
        ],
      },
      limit: 3,
      sort: '-incomeHigh',
    })
    return result.docs
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const hustle = await getHustle(slug)
  if (!hustle) return { title: 'Guide Not Found' }

  const income = hustle.incomeLow && hustle.incomeHigh
    ? `$${Number(hustle.incomeLow).toLocaleString()}–$${Number(hustle.incomeHigh).toLocaleString()}/month`
    : 'money'
  const title = `${hustle.name as string} — How to Make ${income} with AI`
  const description = hustle.metaDescription as string
    || `${hustle.tagline as string} Learn the exact steps to start ${hustle.name as string} with AI tools. Startup cost: ${(hustle.startupCost as string) || '$0–$50'}. Time to first dollar: ${(hustle.timeToFirstDollar as string) || '1–4 weeks'}.`

  return {
    title,
    description,
    keywords: [
      hustle.name as string,
      `${hustle.name as string} with AI`,
      'AI side hustle',
      'make money with AI',
      `how to start ${hustle.name as string}`,
      'AI income ideas',
    ].join(', '),
    openGraph: { title, description, type: 'article', siteName: 'AICashMaker' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `/side-hustles/${slug}` },
  }
}

export async function generateStaticParams() { return [] }

export default async function SideHustlePage({ params }: Props) {
  const { slug } = await params
  const hustle = await getHustle(slug)
  if (!hustle) notFound()

  const gradient = (hustle.gradient as string | null) || 'linear-gradient(135deg,#0ea5e9,#0284c7)'
  const difficulty = DIFFICULTY_MAP[hustle.difficulty as string] || DIFFICULTY_MAP.beginner
  const incomeRange = hustle.incomeLow && hustle.incomeHigh
    ? `$${Number(hustle.incomeLow).toLocaleString()}–$${Number(hustle.incomeHigh).toLocaleString()}/mo`
    : 'Varies'
  const related = await getRelated(hustle.difficulty as string, slug)

  // JSON-LD HowTo schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Start ${hustle.name as string}`,
    description: hustle.tagline as string,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: (hustle.startupCost as string)?.replace(/[^0-9]/g, '') || '0',
    },
    supply: [{ '@type': 'HowToSupply', name: 'AI tools (see guide)' }],
    totalTime: `P${(hustle.timeToFirstDollar as string)?.includes('week') ? (hustle.timeToFirstDollar as string).match(/\d+/)?.[0] ?? '2' : '4'}W`,
  }

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Gradient top bar */}
      <div className="h-1.5 w-full" style={{ background: gradient }} />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span>›</span>
            <Link href="/side-hustles" className="hover:text-slate-600 no-underline">Side Hustles</Link>
            <span>›</span>
            <span className="text-slate-600 truncate max-w-[200px]">{hustle.name as string}</span>
          </nav>
          <span className="text-xs text-slate-400 hidden sm:block">{incomeRange}/month potential</span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-14 px-4 text-center text-white relative overflow-hidden" style={{ background: gradient }}>
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-5xl mb-4">{hustle.icon as string || '💰'}</div>
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border bg-white/15 border-white/30 text-white`}>
              {difficulty.label}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/15 border border-white/30 text-white">
              {incomeRange}/month
            </span>
            {hustle.timeToFirstDollar && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/15 border border-white/30 text-white">
                First $ in {hustle.timeToFirstDollar as string}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight drop-shadow-sm">
            {hustle.name as string}
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto leading-relaxed">
            {hustle.tagline as string}
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
          {[
            { icon: '💰', label: 'Income Range', value: incomeRange },
            { icon: '⚡', label: 'Time to First $', value: (hustle.timeToFirstDollar as string) || '1–4 weeks' },
            { icon: '💳', label: 'Startup Cost', value: (hustle.startupCost as string) || '$0' },
            { icon: '⏰', label: 'Time/Week', value: (hustle.timeCommitment as string) || '5–20 hrs' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex flex-col items-center justify-center py-5 px-3 text-center">
              <span className="text-xl mb-1">{icon}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
              <span className="text-sm font-extrabold text-slate-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_320px] gap-12 items-start">

          {/* ── Left: Guide Content ── */}
          <div className="min-w-0">

            {/* Opportunity callout */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 mb-8 flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">{hustle.icon as string || '💰'}</div>
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Income Opportunity</p>
                <p className="text-white font-bold text-base mb-1">{hustle.name as string}: {incomeRange}/month</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {difficulty.label} · Startup cost {(hustle.startupCost as string) || '$0'} · First dollar in {(hustle.timeToFirstDollar as string) || '1–4 weeks'}
                </p>
              </div>
            </div>

            {/* HTML content */}
            {(hustle.contentHtml as string | null) ? (
              <div
                className="prose prose-slate max-w-none
                  prose-headings:font-extrabold prose-headings:text-slate-900
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100
                  prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-li:text-slate-600
                  prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-800
                  prose-blockquote:border-l-4 prose-blockquote:border-emerald-400 prose-blockquote:bg-emerald-50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic
                  prose-table:text-sm
                  prose-th:bg-slate-50 prose-th:font-bold
                  prose-td:align-top"
                dangerouslySetInnerHTML={{ __html: hustle.contentHtml as string }}
              />
            ) : (
              <p className="text-slate-400 italic">Full guide coming soon.</p>
            )}

            {/* Related hustles */}
            {related.length > 0 && (
              <section className="mt-14 pt-10 border-t border-slate-100">
                <h2 className="text-xl font-extrabold text-slate-900 mb-5">More Ways to Make Money with AI</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {related.map((r: any) => {
                    const rGradient = r.gradient || 'linear-gradient(135deg,#0ea5e9,#0284c7)'
                    const rIncome = r.incomeLow && r.incomeHigh
                      ? `$${Number(r.incomeLow).toLocaleString()}–$${Number(r.incomeHigh).toLocaleString()}/mo`
                      : null
                    return (
                      <Link
                        key={r.slug}
                        href={`/side-hustles/${r.slug}`}
                        className="block bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all no-underline group"
                      >
                        <div className="h-16 flex items-center justify-center text-2xl" style={{ background: rGradient }}>
                          {r.icon || '💰'}
                        </div>
                        <div className="p-4">
                          <p className="text-sm font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">{r.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-2 mb-2">{r.tagline}</p>
                          {rIncome && <span className="text-xs font-extrabold text-emerald-600">{rIncome}</span>}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* ── Right: Sticky Sidebar ── */}
          <aside className="mt-10 lg:mt-0">
            <div className="sticky top-24 space-y-4">

              {/* Quick facts card */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-1.5 w-full" style={{ background: gradient }} />
                <div className="p-5">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Quick Facts</p>
                  <div className="space-y-3">
                    {([
                      ['💰', 'Income Range', incomeRange],
                      ['⚡', 'First Dollar', (hustle.timeToFirstDollar as string) || '1–4 weeks'],
                      ['💳', 'Startup Cost', (hustle.startupCost as string) || '$0'],
                      ['⏰', 'Time/Week', (hustle.timeCommitment as string) || '5–20 hrs'],
                      ['📊', 'Difficulty', difficulty.label],
                    ] as [string, string, string][]).map(([icon, label, value]) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-500">
                          <span>{icon}</span>
                          <span className="text-xs">{label}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-100 px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${difficulty.color} ${difficulty.border}`}>
                    {difficulty.label} · {difficulty.desc}
                  </span>
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="rounded-2xl overflow-hidden">
                <div className="h-1.5 w-full" style={{ background: gradient }} />
                <div className="bg-slate-900 px-5 py-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Free Weekly Strategies</p>
                  <p className="text-sm font-bold text-white mb-1">Get the AI Income Newsletter</p>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    New money-making strategies, tool reviews, and income reports every week.
                  </p>
                  <Link
                    href="/newsletter"
                    className="block text-center font-bold py-3 rounded-xl text-sm transition-colors no-underline text-white"
                    style={{ background: gradient }}
                  >
                    Subscribe Free →
                  </Link>
                </div>
              </div>

              {/* Marketplace cross-sell */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Speed Up Your Start</p>
                <div className="space-y-2">
                  {[
                    { href: '/automations', icon: '⚡', label: 'Automation Templates', desc: 'Save hours every week' },
                    { href: '/prompts', icon: '✨', label: 'AI Prompt Packs', desc: 'Ready-to-use AI workflows' },
                    { href: '/tools', icon: '🛠️', label: 'AI Tools Directory', desc: 'Find the right tools' },
                  ].map(({ href, icon, label, desc }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors no-underline group"
                    >
                      <span className="text-lg w-8 text-center flex-shrink-0">{icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">{label}</p>
                        <p className="text-[11px] text-slate-400">{desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* All hustles nav */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">All Side Hustles</p>
                <Link
                  href="/side-hustles"
                  className="flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-sky-600 no-underline transition-colors"
                >
                  <span>Browse all 10 guides</span>
                  <span>→</span>
                </Link>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
