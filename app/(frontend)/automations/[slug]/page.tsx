import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

const PLATFORM_STYLES: Record<string, { badge: string; accent: string; gradient: string }> = {
  'Make.com':   { badge: 'bg-violet-100 text-violet-700', accent: 'text-violet-600', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
  'Zapier':     { badge: 'bg-orange-100 text-orange-700', accent: 'text-orange-600', gradient: 'linear-gradient(135deg,#f97316,#ea580c)' },
  'n8n':        { badge: 'bg-amber-100 text-amber-700',   accent: 'text-amber-600',  gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  'Custom API': { badge: 'bg-sky-100 text-sky-700',       accent: 'text-sky-600',    gradient: 'linear-gradient(135deg,#0ea5e9,#0284c7)' },
}

const COMPLEXITY_COLORS: Record<string, string> = {
  Beginner:     'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced:     'bg-red-100 text-red-700',
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
  return {
    title: `${auto.title} — ${auto.platform} Automation Template`,
    description: auto.excerpt as string,
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
  const complexityColor = COMPLEXITY_COLORS[auto.complexity as string] || COMPLEXITY_COLORS.Beginner
  const related = await getRelated(auto.category as string, slug)
  const features = (auto.features as { feature: string }[] | null) || []

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span>›</span>
            <Link href="/automations" className="hover:text-slate-600 no-underline">Automations</Link>
            <span>›</span>
            <span className="text-slate-600 line-clamp-1">{auto.title as string}</span>
          </nav>
        </div>
      </div>

      <div className="h-1.5 w-full" style={{ background: gradient }} />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_320px] gap-12">

          {/* Main */}
          <div className="min-w-0">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.badge}`}>{platform}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{auto.category as string}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${complexityColor}`}>{auto.complexity as string}</span>
                {auto.timeSaved && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">⏱ {auto.timeSaved as string} saved</span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                {auto.title as string}
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed mb-6 border-l-4 border-emerald-300 pl-4">
                {auto.excerpt as string}
              </p>
              {features.length > 0 && (
                <ul className="space-y-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                      {f.feature}
                    </li>
                  ))}
                </ul>
              )}
            </header>

            {(auto.contentHtml as string | null) ? (
              <div
                className="prose prose-slate max-w-none prose-headings:font-extrabold prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: auto.contentHtml as string }}
              />
            ) : (
              <p className="text-slate-400 italic">Content coming soon.</p>
            )}

            {/* Related */}
            {related.length > 0 && (
              <section className="mt-16 pt-10 border-t border-slate-100">
                <h2 className="text-lg font-extrabold text-slate-900 mb-5">More {auto.category as string} Automations</h2>
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
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rs.badge}`}>{r.platform}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 mb-1 line-clamp-2">{r.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-2">{r.excerpt}</p>
                        <span className="text-sm font-extrabold text-emerald-600">${r.price}</span>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="mt-10 lg:mt-0">
            <div className="sticky top-24 space-y-5">

              {/* Buy card */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-2" style={{ background: gradient }} />
                <div className="p-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-extrabold text-slate-900">${auto.price as number}</span>
                    <span className="text-sm text-slate-400">one-time</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Instant download · Works with free plan</p>
                  <Link
                    href="/submit-product"
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-colors no-underline mb-3"
                  >
                    Get Template →
                  </Link>
                  <p className="text-xs text-center text-slate-400">Import in minutes · Full setup guide included</p>
                </div>
                <div className="border-t border-slate-100 px-5 py-4 space-y-2">
                  {[
                    ['Platform', platform],
                    ['Category', auto.category as string],
                    ['Complexity', auto.complexity as string],
                    ['Time Saved', (auto.timeSaved as string) || 'Varies'],
                    ['Setup Time', (auto.setupTime as string) || '< 1 hour'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{label}</span>
                      <span className="font-semibold text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar nav */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Explore More</p>
                <div className="space-y-1">
                  {[
                    ['/tools', '🛠️', 'AI Tools Directory'],
                    ['/side-hustles', '💰', 'Side Hustle Guides'],
                    ['/prompts', '✨', 'Prompt Marketplace'],
                    ['/blog', '📝', 'Income Guides'],
                  ].map(([href, icon, label]) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all no-underline group"
                    >
                      <span className="text-base">{icon}</span>
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sell CTA */}
              <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-2xl p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Sell Your Automations</p>
                <p className="text-sm font-bold text-white mb-1">Earn 80% of every sale</p>
                <p className="text-xs text-slate-400 mb-4">Submit your workflow templates and reach thousands of buyers.</p>
                <Link
                  href="/submit-product"
                  className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-xs transition-colors no-underline"
                >
                  Start Selling →
                </Link>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
