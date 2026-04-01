import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import BuyButton from './BuyButton'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

const MODEL_STYLES: Record<string, { badge: string; border: string; accent: string; gradient: string }> = {
  ChatGPT:    { badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200', accent: 'text-emerald-600', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
  Claude:     { badge: 'bg-amber-100   text-amber-700',   border: 'border-amber-200',   accent: 'text-amber-600',   gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  Midjourney: { badge: 'bg-violet-100  text-violet-700',  border: 'border-violet-200',  accent: 'text-violet-600',  gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
  Gemini:     { badge: 'bg-sky-100     text-sky-700',     border: 'border-sky-200',     accent: 'text-sky-600',     gradient: 'linear-gradient(135deg,#0ea5e9,#0284c7)' },
  Multiple:   { badge: 'bg-indigo-100  text-indigo-700',  border: 'border-indigo-200',  accent: 'text-indigo-600',  gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
}

const DIFFICULTY_COLORS: Record<string, { color: string; border: string; desc: string }> = {
  Beginner:     { color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200', desc: 'No prior AI experience needed' },
  Intermediate: { color: 'bg-amber-100   text-amber-700',   border: 'border-amber-200',   desc: 'Basic AI familiarity helpful' },
  Advanced:     { color: 'bg-red-100     text-red-700',     border: 'border-red-200',     desc: 'Experience with AI prompting' },
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  Copywriting:    'linear-gradient(135deg,#f97316,#ea580c)',
  Business:       'linear-gradient(135deg,#0ea5e9,#0284c7)',
  Marketing:      'linear-gradient(135deg,#10b981,#059669)',
  SEO:            'linear-gradient(135deg,#6366f1,#4f46e5)',
  Content:        'linear-gradient(135deg,#8b5cf6,#7c3aed)',
  Freelancing:    'linear-gradient(135deg,#ec4899,#db2777)',
  Writing:        'linear-gradient(135deg,#14b8a6,#0d9488)',
  'Art & Design': 'linear-gradient(135deg,#a855f7,#9333ea)',
  Education:      'linear-gradient(135deg,#f59e0b,#d97706)',
  Ecommerce:      'linear-gradient(135deg,#06b6d4,#0891b2)',
  Tutorials:      'linear-gradient(135deg,#84cc16,#65a30d)',
}

async function getPrompt(slug: string) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'prompts',
      where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
      limit: 1,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

async function getRelatedPrompts(category: string, currentSlug: string) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'prompts',
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
  const prompt = await getPrompt(slug)
  if (!prompt) return { title: 'Prompt Pack Not Found' }

  const title = `${prompt.title as string} — ${prompt.promptCount as string || 'Premium'} ${prompt.model as string} Prompts`
  const description = `${prompt.excerpt as string} ${prompt.promptCount as string || 'Dozens of'} battle-tested ${prompt.model as string} prompts for ${prompt.category as string}. ${prompt.difficulty as string} level. One-time purchase — $${prompt.price as number}.`

  return {
    title,
    description,
    keywords: [
      prompt.title as string,
      `${prompt.model as string} prompts`,
      `${prompt.category as string} AI prompts`,
      'AI prompt pack',
      'ChatGPT prompts',
      'prompt engineering',
    ].join(', '),
    openGraph: { title, description, type: 'website', siteName: 'AICashMaker' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `/prompts/${slug}` },
  }
}

export async function generateStaticParams() { return [] }

export default async function PromptDetailPage({ params }: Props) {
  const { slug } = await params
  const prompt = await getPrompt(slug)
  if (!prompt) notFound()

  const model = prompt.model as string
  const modelStyle = MODEL_STYLES[model] || MODEL_STYLES.Multiple
  const difficulty = DIFFICULTY_COLORS[prompt.difficulty as string] || DIFFICULTY_COLORS.Beginner
  const gradient = (prompt.featuredImageGradient as string | null)
    || CATEGORY_GRADIENTS[prompt.category as string]
    || modelStyle.gradient
  const price = prompt.price as number
  const related = await getRelatedPrompts(prompt.category as string, slug)

  const included = [
    `${prompt.promptCount as string || 'Full collection of'} ready-to-use ${model} prompts`,
    'Copy-paste format — works immediately',
    'Customization guide for each prompt',
    'Lifetime access + free updates',
    `Optimized for ${model} (free & paid versions)`,
    `${prompt.category as string} use cases covered end-to-end`,
  ]

  const faqs = [
    {
      q: `Which version of ${model} do I need?`,
      a: `These prompts are optimized for ${model} and work with both the free and paid versions. A few advanced prompts perform better with the paid tier, which is noted in the guide.`,
    },
    {
      q: 'How do I use the prompts after purchase?',
      a: 'You get an instant download with all prompts in a clean, copy-paste format. Open your AI tool, paste the prompt, fill in the [bracketed variables], and run it. Most prompts produce usable output on the first try.',
    },
    {
      q: `Do I need ${prompt.difficulty as string === 'Beginner' ? 'any' : 'advanced'} experience with AI?`,
      a: difficulty.desc + (prompt.difficulty as string === 'Beginner'
        ? '. If you can type, you can use these prompts. Every prompt includes a plain-English explanation of what it does and when to use it.'
        : '. Each prompt includes context explaining when and how to use it effectively.'),
    },
    {
      q: 'What exactly do I get after purchase?',
      a: `Immediate access to the full prompt pack as a downloadable file. Includes all ${prompt.promptCount as string || 'prompts'}, usage instructions, customization tips, and real example outputs for each prompt.`,
    },
    {
      q: 'Is there a refund policy?',
      a: "Yes — 30-day money-back guarantee. If the prompts don't deliver value, email us and we'll refund you in full. No questions asked.",
    },
    {
      q: 'Can I use these for client work?',
      a: 'Absolutely. Your license covers personal use and work for your clients. For reselling the prompts themselves or agency-wide multi-seat use, contact us for a license.',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: prompt.title as string,
    description: prompt.excerpt as string,
    brand: { '@type': 'Brand', name: 'AICashMaker' },
    category: `${prompt.category as string} AI Prompts`,
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
      ratingValue: String(prompt.rating || '4.8'),
      reviewCount: String(prompt.reviewCount || '32'),
      bestRating: '5',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="h-1.5 w-full" style={{ background: gradient }} />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span>›</span>
            <Link href="/prompts" className="hover:text-slate-600 no-underline">Prompts</Link>
            <span>›</span>
            <span className="text-slate-600 truncate max-w-[200px]">{prompt.title as string}</span>
          </nav>
          <span className="text-xs text-slate-400 hidden sm:block">{prompt.promptCount as string || 'Premium pack'} · {model}</span>
        </div>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 truncate">{prompt.title as string}</p>
          <p className="text-lg font-extrabold text-slate-900">${price} <span className="text-xs font-normal text-slate-400">one-time</span></p>
        </div>
        <BuyButton
          promptSlug={slug}
          price={price}
          label="Buy Now"
          className="flex-shrink-0 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 pb-28 lg:pb-10">
        <div className="lg:grid lg:grid-cols-[1fr_340px] gap-12 items-start">

          {/* ── Left ── */}
          <div className="min-w-0">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${modelStyle.badge} ${modelStyle.border}`}>{model}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600">{prompt.category as string}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${difficulty.color} ${difficulty.border}`}>{prompt.difficulty as string}</span>
                {prompt.promptCount && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-violet-200 bg-violet-50 text-violet-700">{prompt.promptCount as string}</span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                {prompt.title as string}
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed border-l-4 border-violet-400 pl-4">
                {prompt.excerpt as string}
              </p>
              {prompt.rating && (
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-4">
                  <div className="flex text-amber-400">{'★'.repeat(Math.floor(Number(prompt.rating)))}</div>
                  <span className="font-bold text-slate-700">{String(prompt.rating)}</span>
                  {prompt.reviewCount && <span>({prompt.reviewCount as string} reviews)</span>}
                  <span className="text-slate-300">·</span>
                  <span>by {prompt.creatorName as string}</span>
                </div>
              )}
            </header>

            {/* Value bar */}
            <div className="grid grid-cols-3 gap-3 mb-8 p-4 bg-gradient-to-r from-slate-50 to-violet-50 rounded-2xl border border-slate-100">
              {[
                { icon: '✨', label: 'Prompts', value: prompt.promptCount as string || 'Full Pack' },
                { icon: '🤖', label: 'AI Model', value: model },
                { icon: '💰', label: 'One-Time Price', value: `$${price}` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-xl mb-0.5">{icon}</p>
                  <p className="text-sm font-extrabold text-slate-900">{value}</p>
                  <p className="text-[11px] text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            {/* HTML content */}
            {(prompt.contentHtml as string | null) ? (
              <div
                className="prose prose-slate max-w-none
                  prose-headings:font-extrabold prose-headings:text-slate-900
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-li:text-slate-600
                  prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-800
                  prose-blockquote:border-l-4 prose-blockquote:border-violet-400 prose-blockquote:bg-violet-50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic
                  prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
                dangerouslySetInnerHTML={{ __html: prompt.contentHtml as string }}
              />
            ) : (
              <p className="text-slate-400 italic">Full content coming soon.</p>
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
                <h2 className="text-xl font-extrabold text-slate-900 mb-5">More {prompt.category as string} Packs</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {related.map((r: any) => {
                    const rs = MODEL_STYLES[r.model] || MODEL_STYLES.Multiple
                    return (
                      <Link
                        key={r.slug}
                        href={`/prompts/${r.slug}`}
                        className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-violet-300 hover:shadow-sm transition-all no-underline"
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rs.badge} ${rs.border}`}>{r.model}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 mb-1 line-clamp-2">{r.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{r.excerpt}</p>
                        <span className="text-sm font-extrabold text-violet-600">${r.price}</span>
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

              {/* Buy card */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
                <div className="h-2 w-full" style={{ background: gradient }} />
                <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-extrabold text-slate-900">${price}</span>
                    <span className="text-base text-slate-400 line-through">$149</span>
                    <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
                      {Math.round((1 - price / 149) * 100)}% off
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-5">One-time payment · Instant download · Lifetime access</p>

                  <BuyButton promptSlug={slug} price={price} />

                  <div className="flex items-center justify-center gap-4 mt-3 mb-5">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400"><span>🔒</span> Secure checkout</span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400"><span>⚡</span> Instant access</span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400"><span>↩</span> 30-day refund</span>
                  </div>

                  <div className="border-t border-slate-100 pt-5">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">What&apos;s Included</p>
                    <ul className="space-y-2">
                      {included.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-violet-500 flex-shrink-0 mt-0.5 font-bold">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 space-y-2.5">
                  {([
                    ['AI Model', model],
                    ['Category', prompt.category as string],
                    ['Difficulty', prompt.difficulty as string],
                    ['Pack Size', prompt.promptCount as string || '—'],
                    ['Creator', prompt.creatorName as string || 'AICashMaker Editorial'],
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
                    {['bg-violet-400','bg-emerald-400','bg-sky-400','bg-amber-400'].map((c, i) => (
                      <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>
                        {['K','M','R','J'][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 mb-0.5">
                      {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-xs">★</span>)}
                    </div>
                    <p className="text-[11px] text-slate-500">{prompt.reviewCount as string || '32'}+ customers · {String(prompt.rating || '4.8')} avg rating</p>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl px-5 py-4 flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🛡️</span>
                <div>
                  <p className="text-sm font-bold text-violet-800">30-Day Money-Back Guarantee</p>
                  <p className="text-xs text-violet-700 mt-0.5 leading-relaxed">
                    If these prompts don&apos;t save you time and improve your output, we&apos;ll refund you in full.
                  </p>
                </div>
              </div>

              {/* Explore nav */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">More Tools to Grow</p>
                <div className="space-y-0.5">
                  {([
                    ['/automations', '⚡', 'Automation Templates'],
                    ['/tools', '🛠️', 'AI Tools Directory'],
                    ['/side-hustles', '💰', 'Side Hustle Guides'],
                    ['/blog', '📝', 'Income Guides'],
                  ] as [string, string, string][]).map(([href, icon, label]) => (
                    <Link key={href} href={href} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all no-underline group">
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
                  <p className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-1">Earn Passive Income</p>
                  <p className="text-sm font-bold text-white mb-0.5">Sell Your Prompt Packs</p>
                  <p className="text-xs text-slate-400 mb-3">Keep 80% of every sale. Submit once, earn forever.</p>
                  <Link href="/submit-product" className="block text-center bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 rounded-lg text-xs transition-colors no-underline">
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
