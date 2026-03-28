import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

async function getTool(slug: string) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'tools',
      where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
      limit: 1,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

async function getRelatedTools(slug: string, categoryId?: string) {
  try {
    const payload = await getPayload()
    const where: any = { and: [{ published: { equals: true } }, { slug: { not_equals: slug } }] }
    if (categoryId) where.and.push({ category: { equals: categoryId } })
    const result = await payload.find({ collection: 'tools', where, limit: 3, sort: '-rating' })
    return result.docs
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) return { title: 'Tool Not Found' }
  return {
    title: `${tool.name} Review — Is It Worth It for Making Money?`,
    description: tool.description || tool.tagline,
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload()
    const result = await payload.find({ collection: 'tools', where: { published: { equals: true } }, limit: 500 })
    return result.docs.map((t: any) => ({ slug: t.slug }))
  } catch {
    return []
  }
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
      ))}
      {half && <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z" /></svg>}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} width="16" height="16" viewBox="0 0 24 24" fill="#e2e8f0"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
      ))}
    </div>
  )
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) notFound()

  const categoryId = typeof tool.category === 'object' ? tool.category?.id : tool.category
  const categoryName = typeof tool.category === 'object' ? tool.category?.name : 'AI Tools'
  const relatedTools = await getRelatedTools(slug, categoryId)

  const gradient = tool.iconGradient || 'linear-gradient(135deg, #0ea5e9, #0284c7)'
  const incomeRange = tool.incomeLow && tool.incomeHigh
    ? `$${tool.incomeLow.toLocaleString()}–$${tool.incomeHigh.toLocaleString()}/mo`
    : null

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <Link href="/tools" className="hover:text-slate-600 no-underline">Tools</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">{tool.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_320px] gap-10">
          {/* Main content */}
          <div className="min-w-0">
            {/* Tool header */}
            <div className="flex items-start gap-5 mb-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: gradient }}
              >
                {tool.icon || '🤖'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{tool.name}</h1>
                  {tool.featured && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Featured</span>
                  )}
                </div>
                <p className="text-slate-500 text-base mb-3">{tool.tagline}</p>
                <div className="flex items-center flex-wrap gap-4">
                  {tool.rating && (
                    <div className="flex items-center gap-2">
                      <StarRating rating={tool.rating} />
                      <span className="text-sm font-semibold text-slate-900">{tool.rating.toFixed(1)}</span>
                      {tool.reviewCount && <span className="text-sm text-slate-400">({tool.reviewCount} reviews)</span>}
                    </div>
                  )}
                  {categoryName && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">{categoryName}</span>
                  )}
                  {tool.pricingModel && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 capitalize">
                      {tool.pricingModel.replace('-', ' ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Income potential highlight */}
            {incomeRange && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg">💰</div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-0.5">Income Potential</div>
                    <div className="text-xl font-extrabold text-emerald-700">{incomeRange}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Review body */}
            {tool.reviewBody && (
              <div className="prose-content mb-10">
                {/* Rich text rendered as HTML — in production use @payloadcms/richtext-lexical/react */}
                <div dangerouslySetInnerHTML={{ __html: tool.reviewBody }} />
              </div>
            )}

            {/* Pros & Cons */}
            {(tool.pros?.length > 0 || tool.cons?.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-5 mb-10">
                {tool.pros?.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                      <span>✓</span> Pros
                    </h3>
                    <ul className="list-none m-0 p-0 space-y-2">
                      {tool.pros.map((pro: any, i: number) => (
                        <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          {pro.item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tool.cons?.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                      <span>✗</span> Cons
                    </h3>
                    <ul className="list-none m-0 p-0 space-y-2">
                      {tool.cons.map((con: any, i: number) => (
                        <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          {con.item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Ways to make money */}
            {tool.moneyMethods?.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-extrabold text-slate-900 mb-5">Ways to Make Money with {tool.name}</h2>
                <div className="space-y-4">
                  {tool.moneyMethods.map((method: any, i: number) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm flex-shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 mb-1">{method.title}</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">{method.description}</p>
                          {method.incomeRange && (
                            <span className="inline-block mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                              {method.incomeRange}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related tools */}
            {relatedTools.length > 0 && (
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-5">Related Tools</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedTools.map((t: any) => (
                    <Link
                      key={t.id}
                      href={`/tools/${t.slug}`}
                      className="block bg-white border border-slate-200 rounded-2xl p-4 hover:border-sky-300 hover:shadow-md transition-all no-underline group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: t.iconGradient || gradient }}>
                          {t.icon || '🤖'}
                        </div>
                        <span className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{t.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{t.tagline}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:block">
            <div className="sticky top-20 space-y-4">
              {/* CTA card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="text-center mb-4">
                  <div className="text-2xl font-extrabold text-slate-900 mb-1">
                    {tool.price || (tool.pricingModel === 'free' ? 'Free' : 'See Pricing')}
                  </div>
                  {tool.pricingModel && (
                    <div className="text-xs text-slate-400 capitalize">{tool.pricingModel.replace('-', ' ')}</div>
                  )}
                </div>

                {tool.affiliateLink && (
                  <a
                    href={`/go/${tool.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full py-3 rounded-xl text-sm font-bold text-center block mb-3 no-underline"
                  >
                    Try {tool.name} →
                  </a>
                )}

                {/* Pricing tiers */}
                {tool.pricingTiers?.length > 0 && (
                  <div className="space-y-2 mt-4 border-t border-slate-100 pt-4">
                    {tool.pricingTiers.map((tier: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">{tier.tierName}</span>
                        <span className="text-xs font-semibold text-slate-900">{tier.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Income snapshot */}
              {incomeRange && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Income Range</div>
                  <div className="text-lg font-extrabold text-emerald-700">{incomeRange}</div>
                  <div className="text-xs text-emerald-600 mt-1">Reported by active users</div>
                </div>
              )}

              {/* Affiliate disclosure */}
              <p className="text-[10px] text-slate-400 leading-relaxed px-1">
                Affiliate disclosure: We may earn a commission if you purchase through our links. This doesn't affect our reviews.{' '}
                <Link href="/affiliate-disclosure" className="underline">Learn more</Link>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
