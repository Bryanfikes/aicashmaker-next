import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'

export const revalidate = 3600

interface Props {
  params: { slug: string }
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hustle = await getHustle(params.slug)
  if (!hustle) return { title: 'Guide Not Found' }
  return {
    title: `${hustle.name} — How to Make ${hustle.incomeLow ? `$${hustle.incomeLow.toLocaleString()}` : 'Money'}+/Month`,
    description: hustle.tagline,
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'side-hustles',
      where: { published: { equals: true } },
      limit: 200,
    })
    return result.docs.map((h: any) => ({ slug: h.slug }))
  } catch {
    return []
  }
}

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner Friendly', color: 'bg-emerald-100 text-emerald-700' },
  intermediate: { label: 'Intermediate', color: 'bg-amber-100 text-amber-700' },
  advanced: { label: 'Advanced', color: 'bg-red-100 text-red-700' },
}

export default async function SideHustlePage({ params }: Props) {
  const hustle = await getHustle(params.slug)
  if (!hustle) notFound()

  const incomeRange = hustle.incomeLow && hustle.incomeHigh
    ? `$${hustle.incomeLow.toLocaleString()}–$${hustle.incomeHigh.toLocaleString()}/mo`
    : null

  const difficulty = DIFFICULTY_LABELS[hustle.difficulty] || DIFFICULTY_LABELS.beginner
  const gradient = hustle.gradient || 'linear-gradient(135deg, #0ea5e9, #0284c7)'

  const heroStats = [
    { label: 'Income Range', value: incomeRange || 'Varies', icon: '💰' },
    { label: 'First Dollar', value: hustle.timeToFirstDollar || '1–4 weeks', icon: '⏱️' },
    { label: 'Startup Cost', value: hustle.startupCost || '$0–$50', icon: '💳' },
    { label: 'Difficulty', value: difficulty.label, icon: '📊' },
  ]

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <Link href="/side-hustles" className="hover:text-slate-600 no-underline">Side Hustles</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">{hustle.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-10 pb-12 px-4" style={{ background: gradient }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="text-4xl mb-4">{hustle.icon}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">{hustle.name}</h1>
          <p className="text-white/80 text-base max-w-xl mx-auto">{hustle.tagline}</p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-0">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4">
          {heroStats.map(({ label, value, icon }) => (
            <div key={label} className="flex flex-col items-center justify-center py-5 px-3 border-r border-slate-100 last:border-r-0">
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-xs text-slate-500 mb-1">{label}</div>
              <div className="text-sm font-bold text-slate-900 text-center">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_280px] gap-10">
          {/* Main content */}
          <div>
            {/* Steps */}
            {hustle.steps?.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6">Step-by-Step Blueprint</h2>
                <div className="space-y-5">
                  {hustle.steps.map((step: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-white" style={{ background: gradient }}>
                        {i + 1}
                      </div>
                      <div className="flex-1 pb-5 border-b border-slate-100 last:border-b-0">
                        <h3 className="text-sm font-bold text-slate-900 mb-1.5">{step.title}</h3>
                        {step.description && (
                          <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                        )}
                        {step.tip && (
                          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                            <span className="text-xs font-semibold text-amber-700">💡 Pro tip: </span>
                            <span className="text-xs text-amber-800">{step.tip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Body content */}
            {hustle.body && (
              <div className="prose-content mb-10">
                <div dangerouslySetInnerHTML={{ __html: hustle.body }} />
              </div>
            )}

            {/* Income table */}
            {hustle.incomeTable?.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-extrabold text-slate-900 mb-5">Income Breakdown by Experience Level</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 border border-slate-200">Level</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 border border-slate-200">Monthly Income</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 border border-slate-200">Time Required</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 border border-slate-200">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hustle.incomeTable.map((row: any, i: number) => (
                        <tr key={i} className="even:bg-slate-50">
                          <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-900">{row.level}</td>
                          <td className="px-4 py-3 border border-slate-200 font-bold text-emerald-600">{row.income}</td>
                          <td className="px-4 py-3 border border-slate-200 text-slate-600">{row.timeRequired}</td>
                          <td className="px-4 py-3 border border-slate-200 text-slate-500 text-xs">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pro tips */}
            {hustle.proTips?.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-extrabold text-slate-900 mb-5">Pro Tips</h2>
                <div className="space-y-3">
                  {hustle.proTips.map((tip: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                      <span className="text-emerald-500 text-lg mt-0.5">✓</span>
                      <p className="text-sm text-slate-700 leading-relaxed">{tip.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-20 space-y-4">
              {/* Quick stats */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Facts</h3>
                <div className="space-y-3">
                  {[
                    ['Income Range', incomeRange || 'Varies'],
                    ['Time to First $', hustle.timeToFirstDollar || '1–4 weeks'],
                    ['Startup Cost', hustle.startupCost || '$0'],
                    ['Difficulty', difficulty.label],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-2">
                      <span className="text-xs text-slate-500">{label}</span>
                      <span className="text-xs font-semibold text-slate-900 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools needed */}
              {hustle.recommendedTools?.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Tools You'll Need</h3>
                  <div className="space-y-2">
                    {hustle.recommendedTools.map((tool: any, i: number) => {
                      const t = typeof tool === 'object' ? tool : { name: tool, slug: '' }
                      return (
                        <Link
                          key={i}
                          href={t.slug ? `/tools/${t.slug}` : '/tools'}
                          className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 no-underline"
                        >
                          <span className="text-sky-400">→</span>
                          {t.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="rounded-2xl p-5 text-white text-center" style={{ background: gradient }}>
                <div className="text-2xl mb-2">{hustle.icon}</div>
                <h3 className="text-sm font-bold mb-2">Ready to Start?</h3>
                <p className="text-xs text-white/80 mb-4">Get the tools and start earning this week.</p>
                <Link
                  href="/newsletter"
                  className="block text-xs font-bold py-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors no-underline text-white"
                >
                  Get Weekly Strategies →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
