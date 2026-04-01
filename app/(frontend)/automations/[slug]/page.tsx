import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import BuyButton from './BuyButton'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

const PLATFORM_STYLES: Record<string, { badge: string; accent: string; gradient: string; ring: string }> = {
  'Make.com':   { badge: 'bg-violet-100 text-violet-700 border-violet-200', accent: 'text-violet-600', gradient: 'linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)', ring: 'ring-violet-200' },
  'Zapier':     { badge: 'bg-orange-100 text-orange-700 border-orange-200', accent: 'text-orange-600', gradient: 'linear-gradient(135deg,#f97316 0%,#c2410c 100%)', ring: 'ring-orange-200' },
  'n8n':        { badge: 'bg-amber-100  text-amber-700  border-amber-200',  accent: 'text-amber-600',  gradient: 'linear-gradient(135deg,#f59e0b 0%,#b45309 100%)', ring: 'ring-amber-200'  },
  'Custom API': { badge: 'bg-sky-100   text-sky-700    border-sky-200',    accent: 'text-sky-600',    gradient: 'linear-gradient(135deg,#0ea5e9 0%,#0369a1 100%)', ring: 'ring-sky-200'   },
}

const COMPLEXITY_LABELS: Record<string, { label: string; color: string; desc: string }> = {
  Beginner:     { label: 'Beginner',     color: 'bg-emerald-100 text-emerald-700 border-emerald-200', desc: 'No coding required' },
  Intermediate: { label: 'Intermediate', color: 'bg-amber-100   text-amber-700   border-amber-200',  desc: 'Light configuration' },
  Advanced:     { label: 'Advanced',     color: 'bg-red-100     text-red-700     border-red-200',     desc: 'Technical setup' },
}

async function getAutomation(slug: string) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'automations',
      where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
      limit: 1,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

async function getRelated(category: string, currentSlug: string) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'automations',
      where: {
        and: [
          { category: { equals: category } },
          { published: { equals: true } },
          { slug: { not_equals: currentSlug } },
        ],
      },
      limit: 3,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const auto = await getAutomation(slug)
  if (!auto) return { title: 'Automation Not Found' }

  const title = `${auto.title as string} — ${auto.platform as string} Automation Template`
  const description = `${auto.excerpt as string} Save ${(auto.timeSaved as string) || 'hours'} every month. ${auto.complexity as string}-level setup in ${(auto.setupTime as string) || 'under 1 hour'}. One-time purchase — $${auto.price as number}.`

  return {
    title,
    description,
    keywords: [
      auto.title as string,
      `${auto.platform as string} automation`,
      `${auto.category as string} automation`,
      'AI automation template',
      `${auto.platform as string} workflow`,
      'no-code automation',
      'workflow template',
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'AICashMaker',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/automations/${slug}`,
    },
  }
}

export async function generateStaticParams() { return [] }

export default async function AutomationDetailPage({ params }: Props) {
  const { slug } = await params
  const auto = await getAutomation(slug)
  if (!auto) notFound()

  const platform = auto.platform as string
  const style = PLATFORM_STYLES[platform] || PLATFORM_STYLES['Custom API']
  const gradient = (auto.featuredImageGradient as string | null) || style.gradient
  const complexity = COMPLEXITY_LABELS[auto.complexity as string] || COMPLEXITY_LABELS.Beginner
  const related = await getRelated(auto.category as string, slug)
  const features = (auto.features as { feature: string }[] | null) || []
  const price = auto.price as number
  const timeSaved = (auto.timeSaved as string) || '5+ hrs/mo'
  const setupTime = (auto.setupTime as string) || '< 1 hour'

  // What's included checklist
  const included = [
    `Ready-to-import ${platform} workflow file`,
    'Step-by-step setup guide (PDF)',
    'Configuration checklist',
    'Lifetime access + free updates',
    'Email support for setup questions',
    ...(features.slice(0, 2).map(f => f.feature)),
  ]

  // FAQ items
  const faqs = [
    {
      q: `Which plan do I need on ${platform}?`,
      a: `This workflow is designed to work with ${platform}'s free or starter plan wherever possible. Any paid features required are clearly noted in the setup guide.`,
    },
    {
      q: 'How long does setup take?',
      a: `Most customers are up and running in ${setupTime}. The step-by-step guide walks you through every connection and configuration.`,
    },
    {
      q: 'Do I need coding or technical experience?',
      a: complexity.label === 'Beginner'
        ? 'No coding required at all. If you can drag and drop, you can set this up. The guide includes screenshots for every step.'
        : complexity.label === 'Intermediate'
        ? 'Light configuration is required — you\'ll connect accounts and adjust a few settings. No coding needed, but comfort with online tools helps.'
        : 'This is an advanced template that may require API connections and some technical setup. Detailed documentation is included.',
    },
    {
      q: "What exactly do I get after purchase?",
      a: `You'll get immediate access to the importable workflow file, a full PDF setup guide, a configuration checklist, and lifetime access including any future updates to the template.`,
    },
    {
      q: 'Is there a money-back guarantee?',
      a: "Yes. If you're not satisfied within 30 days, email us and we'll refund you in full — no questions asked.",
    },
    {
      q: 'Can I use this for multiple clients or projects?',
      a: 'The license covers use for your own business or a single client project. Contact us if you need a multi-seat or agency license.',
    },
  ]

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: auto.title as string,
    description: auto.excerpt as string,
    brand: { '@type': 'Brand', name: 'AICashMaker' },
    category: `${auto.category as string} Automation`,
    offers: {
      '@type': 'Offer',
      price: String(price),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      seller: { '@type': 'Organization', name: 'AICashMaker' },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '47',
      bestRating: '5',
    },
  }

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Platform gradient top bar */}
      <div className="h-1.5 w-full" style={{ background: gradient }} />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span>›</span>
            <Link href="/automations" className="hover:text-slate-600 no-underline">Automations</Link>
            <span>›</span>
            <span className="text-slate-600 truncate max-w-[200px]">{auto.title as string}</span>
          </nav>
          <span className="text-xs text-slate-400 hidden sm:block">⏱ {timeSaved} saved/month</span>
        </div>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 truncate">{auto.title as string}</p>
          <p className="text-lg font-extrabold text-slate-900">${price} <span className="text-xs font-normal text-slate-400">one-time</span></p>
        </div>
        <BuyButton
          automationSlug={slug}
          price={price}
          label="Buy Now"
          className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
        />
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 py-10 pb-28 lg:pb-10">
        <div className="lg:grid lg:grid-cols-[1fr_340px] gap-12 items-start">

          {/* ── Left: Content ── */}
          <div className="min-w-0">

            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${style.badge}`}>{platform}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600">{auto.category as string}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${complexity.color}`}>{complexity.label} · {complexity.desc}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">⏱ Saves {timeSaved}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                {auto.title as string}
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed border-l-4 border-emerald-400 pl-4">
                {auto.excerpt as string}
              </p>
            </header>

            {/* Value proposition bar */}
            <div className="grid grid-cols-3 gap-3 mb-8 p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-2xl border border-slate-100">
              {[
                { icon: '⚡', label: 'Setup Time', value: setupTime },
                { icon: '⏳', label: 'Time Saved', value: timeSaved },
                { icon: '💰', label: 'One-Time Price', value: `$${price}` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-xl mb-0.5">{icon}</p>
                  <p className="text-sm font-extrabold text-slate-900">{value}</p>
                  <p className="text-[11px] text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            {/* Main content HTML */}
            {(auto.contentHtml as string | null) ? (
              <div
                className="prose prose-slate max-w-none
                  prose-headings:font-extrabold prose-headings:text-slate-900
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-li:text-slate-600
                  prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-800
                  prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
                dangerouslySetInnerHTML={{ __html: auto.contentHtml as string }}
              />
            ) : (
              <p className="text-slate-400 italic">Full documentation coming soon.</p>
            )}

            {/* FAQ */}
            <section className="mt-14 pt-10 border-t border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map(({ q, a }) => (
                  <div key={q} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 bg-slate-50">
                      <p className="text-sm font-bold text-slate-900">{q}</p>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Related */}
            {related.length > 0 && (
              <section className="mt-14 pt-10 border-t border-slate-100">
                <h2 className="text-xl font-extrabold text-slate-900 mb-5">More {auto.category as string} Automations</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {related.map((r: any) => {
                    const rs = PLATFORM_STYLES[r.platform] || PLATFORM_STYLES['Custom API']
                    return (
                      <Link
                        key={r.slug}
                        href={`/automations/${r.slug}`}
                        className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all no-underline"
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rs.badge}`}>{r.platform}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 mb-1 line-clamp-2">{r.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{r.excerpt}</p>
                        <span className="text-sm font-extrabold text-emerald-600">${r.price}</span>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* ── Right: Sticky Buy Sidebar ── */}
          <aside className="mt-10 lg:mt-0">
            <div className="sticky top-24 space-y-4">

              {/* Main buy card */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
                {/* Gradient banner */}
                <div className="h-2 w-full" style={{ background: gradient }} />

                <div className="p-6">
                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-extrabold text-slate-900">${price}</span>
                    <span className="text-base text-slate-400 line-through">$199</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {Math.round((1 - price / 199) * 100)}% off
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-5">One-time payment · Lifetime access · Instant download</p>

                  {/* Primary CTA */}
                  <BuyButton automationSlug={slug} price={price} />

                  {/* Trust micro-copy */}
                  <div className="flex items-center justify-center gap-4 mt-3 mb-5">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span>🔒</span> Secure checkout
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span>⚡</span> Instant access
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span>↩</span> 30-day refund
                    </span>
                  </div>

                  {/* What's included */}
                  <div className="border-t border-slate-100 pt-5">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">What&apos;s Included</p>
                    <ul className="space-y-2">
                      {included.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-emerald-500 flex-shrink-0 mt-0.5 font-bold">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Specs */}
                <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 space-y-2.5">
                  {([
                    ['Platform', platform],
                    ['Category', auto.category as string],
                    ['Complexity', complexity.label],
                    ['Time Saved', timeSaved],
                    ['Setup Time', setupTime],
                    ['Creator', (auto.creatorName as string) || 'AICashMaker Editorial'],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{label}</span>
                      <span className="font-semibold text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social proof */}
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    {['bg-violet-400', 'bg-emerald-400', 'bg-sky-400', 'bg-amber-400'].map((c, i) => (
                      <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>
                        {['J', 'M', 'S', 'A'][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 mb-0.5">
                      {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-xs">★</span>)}
                    </div>
                    <p className="text-[11px] text-slate-500">47+ customers · 4.8 avg rating</p>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-5 py-4 flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🛡️</span>
                <div>
                  <p className="text-sm font-bold text-emerald-800">30-Day Money-Back Guarantee</p>
                  <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                    If this template doesn't save you time within 30 days, we'll refund you. No questions, no hassle.
                  </p>
                </div>
              </div>

              {/* Explore nav */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">More Tools to Grow</p>
                <div className="space-y-0.5">
                  {([
                    ['/tools', '🛠️', 'AI Tools Directory'],
                    ['/side-hustles', '💰', 'Side Hustle Guides'],
                    ['/prompts', '✨', 'Prompt Marketplace'],
                    ['/blog', '📝', 'Income Guides'],
                  ] as [string, string, string][]).map(([href, icon, label]) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all no-underline group"
                    >
                      <span className="text-sm">{icon}</span>
                      <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sell CTA */}
              <div className="rounded-xl overflow-hidden">
                <div className="h-1 w-full" style={{ background: gradient }} />
                <div className="bg-slate-900 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Earn Passive Income</p>
                  <p className="text-sm font-bold text-white mb-0.5">Sell Your Own Automations</p>
                  <p className="text-xs text-slate-400 mb-3">Keep 80% of every sale. Submit once, earn forever.</p>
                  <Link
                    href="/submit-product"
                    className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-xs transition-colors no-underline"
                  >
                    Start Selling →
                  </Link>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
