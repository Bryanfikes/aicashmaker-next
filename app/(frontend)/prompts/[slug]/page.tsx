import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

const MODEL_COLORS: Record<string, string> = {
  ChatGPT: 'bg-emerald-100 text-emerald-700',
  Claude: 'bg-amber-100 text-amber-700',
  Midjourney: 'bg-violet-100 text-violet-700',
  Gemini: 'bg-sky-100 text-sky-700',
  Multiple: 'bg-sky-100 text-sky-700',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-red-100 text-red-700',
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  Copywriting:   'linear-gradient(135deg,#f97316,#ea580c)',
  Business:      'linear-gradient(135deg,#0ea5e9,#0284c7)',
  Marketing:     'linear-gradient(135deg,#10b981,#059669)',
  SEO:           'linear-gradient(135deg,#6366f1,#4f46e5)',
  Content:       'linear-gradient(135deg,#8b5cf6,#7c3aed)',
  Freelancing:   'linear-gradient(135deg,#ec4899,#db2777)',
  Writing:       'linear-gradient(135deg,#14b8a6,#0d9488)',
  'Art & Design':'linear-gradient(135deg,#a855f7,#9333ea)',
  Education:     'linear-gradient(135deg,#f59e0b,#d97706)',
  Ecommerce:     'linear-gradient(135deg,#06b6d4,#0891b2)',
  Tutorials:     'linear-gradient(135deg,#84cc16,#65a30d)',
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
  return {
    title: `${prompt.title} — ${prompt.promptCount || 'Premium'} AI Prompts`,
    description: prompt.excerpt,
  }
}

export async function generateStaticParams() { return [] }

export default async function PromptDetailPage({ params }: Props) {
  const { slug } = await params
  const [prompt, related] = await Promise.all([
    getPrompt(slug),
    getPrompt(slug).then(p => p ? getRelatedPrompts(p.category as string, slug) : []),
  ])

  if (!prompt) notFound()

  const gradient = (prompt.featuredImageGradient as string | null)
    || CATEGORY_GRADIENTS[prompt.category as string]
    || 'linear-gradient(135deg,#8b5cf6,#7c3aed)'

  const modelColor = MODEL_COLORS[prompt.model as string] || 'bg-slate-100 text-slate-600'
  const difficultyColor = DIFFICULTY_COLORS[prompt.difficulty as string] || DIFFICULTY_COLORS.Beginner

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span>›</span>
            <Link href="/prompts" className="hover:text-slate-600 no-underline">Prompts</Link>
            <span>›</span>
            <span className="text-slate-600 line-clamp-1">{prompt.title}</span>
          </nav>
        </div>
      </div>

      {/* Gradient bar */}
      <div className="h-1.5 w-full" style={{ background: gradient }} />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_320px] gap-12">

          {/* Main content */}
          <div className="min-w-0">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${modelColor}`}>{prompt.model as string}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{prompt.category as string}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${difficultyColor}`}>{prompt.difficulty as string}</span>
                {prompt.promptCount && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700">{prompt.promptCount as string}</span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                {prompt.title}
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed mb-4 border-l-4 border-violet-300 pl-4">
                {prompt.excerpt}
              </p>
              {prompt.rating && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="flex text-amber-400">{'★'.repeat(Math.floor(Number(prompt.rating)))}</div>
                  <span className="font-bold text-slate-700">{String(prompt.rating)}</span>
                  {prompt.reviewCount && <span>({prompt.reviewCount as string} reviews)</span>}
                  <span className="text-slate-300">·</span>
                  <span>by {prompt.creatorName as string}</span>
                </div>
              )}
            </header>

            {/* HTML content */}
            {(prompt.contentHtml as string | null) ? (
              <div
                className="prose prose-slate max-w-none prose-headings:font-extrabold prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: prompt.contentHtml as string }}
              />
            ) : (
              <p className="text-slate-400 italic">Content coming soon.</p>
            )}

            {/* Related packs */}
            {related.length > 0 && (
              <section className="mt-16 pt-10 border-t border-slate-100">
                <h2 className="text-lg font-extrabold text-slate-900 mb-5">More {prompt.category as string} Packs</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {related.map((r: any) => (
                    <Link
                      key={r.slug}
                      href={`/prompts/${r.slug}`}
                      className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-violet-300 hover:shadow-sm transition-all no-underline"
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${MODEL_COLORS[r.model] || 'bg-slate-100 text-slate-600'}`}>{r.model}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 mb-1 line-clamp-2">{r.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-2">{r.excerpt}</p>
                      <span className="text-sm font-extrabold text-violet-600">${r.price}</span>
                    </Link>
                  ))}
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
                    <span className="text-4xl font-extrabold text-slate-900">${prompt.price as number}</span>
                    <span className="text-sm text-slate-400">one-time</span>
                  </div>
                  {prompt.promptCount && (
                    <p className="text-sm text-slate-500 mb-4">{prompt.promptCount as string} · instant download</p>
                  )}
                  <Link
                    href="/submit-product"
                    className="block w-full text-center bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl text-sm transition-colors no-underline mb-3"
                  >
                    Get Instant Access →
                  </Link>
                  <p className="text-xs text-center text-slate-400">Instant download · Works with free AI models</p>
                </div>
                <div className="border-t border-slate-100 px-5 py-4 space-y-2">
                  {[
                    ['Model', prompt.model as string],
                    ['Category', prompt.category as string],
                    ['Difficulty', prompt.difficulty as string],
                    ['Prompts', prompt.promptCount as string || '—'],
                    ['Creator', prompt.creatorName as string],
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
                    ['/automations', '⚡', 'Automation Templates'],
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

              {/* Submit CTA */}
              <div className="bg-gradient-to-br from-slate-900 to-violet-950 rounded-2xl p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-2">Sell Your Prompts</p>
                <p className="text-sm font-bold text-white mb-1">Earn 80% of every sale</p>
                <p className="text-xs text-slate-400 mb-4">List your prompt packs and reach thousands of buyers.</p>
                <Link
                  href="/submit-product"
                  className="block text-center bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 rounded-lg text-xs transition-colors no-underline"
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
