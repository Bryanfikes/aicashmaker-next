import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'blog-posts',
      where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
      limit: 1,
      depth: 2,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

async function getRelatedPosts(currentSlug: string, category: string) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          { published: { equals: true } },
          { slug: { not_equals: currentSlug } },
          { category: { equals: category } },
        ],
      },
      limit: 3,
      sort: '-publishedAt',
    })
    return result.docs
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
  }
}

export async function generateStaticParams() { return [] }

const CATEGORY_COLORS: Record<string, string> = {
  'AI Side Hustles': 'bg-emerald-100 text-emerald-700',
  'AI Tools': 'bg-sky-100 text-sky-700',
  'Best AI Tools': 'bg-sky-100 text-sky-700',
  'AI SEO': 'bg-violet-100 text-violet-700',
  'AI Automation': 'bg-amber-100 text-amber-700',
  'AI Marketing': 'bg-orange-100 text-orange-700',
  'Tutorials': 'bg-pink-100 text-pink-700',
  'Income Reports': 'bg-emerald-100 text-emerald-700',
}

const PILLAR_LINKS = [
  { href: '/tools', label: 'Browse AI Tools', icon: '🤖', sub: '170+ reviewed & ranked' },
  { href: '/side-hustles', label: 'Side Hustle Guides', icon: '💼', sub: '65+ income blueprints' },
  { href: '/prompts', label: 'Prompt Packs', icon: '⚡', sub: 'Ready-to-sell prompts' },
  { href: '/automations', label: 'Automation Templates', icon: '🔄', sub: 'Plug-and-play workflows' },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const authorName = post.authorName || (typeof post.author === 'object' ? (post.author as any)?.name : null) || 'AICashMaker Editorial'
  const categoryColor = CATEGORY_COLORS[post.category] || 'bg-slate-100 text-slate-700'
  const gradient = post.featuredImageGradient || 'linear-gradient(135deg,#0ea5e9,#0284c7)'
  const relatedPosts = await getRelatedPosts(slug, post.category)

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-slate-600 no-underline">Blog</Link>
            <span>›</span>
            <span className="text-slate-600 line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero gradient banner */}
      <div className="h-2 w-full" style={{ background: gradient }} />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_300px] gap-12">

          {/* ── Main article ── */}
          <div className="min-w-0">
            {/* Article header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {post.category && (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${categoryColor}`}>
                    {post.category}
                  </span>
                )}
                {post.readTimeMinutes && (
                  <span className="text-xs text-slate-400">{post.readTimeMinutes} min read</span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg text-slate-500 leading-relaxed mb-6 border-l-4 border-sky-300 pl-4">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: gradient }}
                >
                  {authorName.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{authorName}</div>
                  {post.publishedAt && (
                    <div className="text-xs text-slate-400">{formatDate(post.publishedAt)}</div>
                  )}
                </div>
              </div>
            </header>

            {/* Article body */}
            <article className="prose-content mb-10">
              {post.body ? (
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
              ) : (
                <div className="space-y-4 text-slate-600">
                  <p>Full article content is coming soon. In the meantime, explore our pillar guides below.</p>
                </div>
              )}
            </article>

            {/* Mid-article Submit A Tool CTA */}
            <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl p-6 mb-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-extrabold text-slate-900 mb-1">Use an AI tool that earns money?</p>
                  <p className="text-xs text-slate-500">Submit it to AICashMaker and get featured in front of 10,000+ monthly readers.</p>
                </div>
                <Link
                  href="/submit-tool"
                  className="shrink-0 inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors no-underline"
                >
                  + Submit a Tool
                </Link>
              </div>
            </div>

            {/* Tools mentioned */}
            {post.toolsMentioned?.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-extrabold text-slate-900 mb-5">Tools Mentioned in This Article</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {post.toolsMentioned.map((tool: any) => {
                    const t = typeof tool === 'object' ? tool : { id: tool, name: 'Tool', slug: '' }
                    const href = t.affiliateLink ? `/go/${t.slug}` : `/tools/${t.slug}`
                    return (
                      <Link
                        key={t.id}
                        href={href}
                        target={t.affiliateLink ? '_blank' : undefined}
                        rel={t.affiliateLink ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-4 hover:border-sky-300 hover:shadow-md transition-all no-underline group"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: t.iconGradient || 'linear-gradient(135deg,#0ea5e9,#0284c7)' }}
                        >
                          {t.icon || '🤖'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{t.name}</div>
                          {t.tagline && <div className="text-xs text-slate-400 line-clamp-1">{t.tagline}</div>}
                        </div>
                        {t.affiliateLink && (
                          <span className="text-xs font-bold text-sky-500 shrink-0">Try it →</span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Pillar page interlinks */}
            <div className="bg-slate-900 rounded-2xl p-6 mb-10">
              <h3 className="text-sm font-extrabold text-white tracking-tight mb-1">Keep Exploring</h3>
              <p className="text-xs text-slate-400 mb-5">Everything you need to start earning with AI — in one place.</p>
              <div className="grid grid-cols-2 gap-3">
                {PILLAR_LINKS.map(({ href, label, icon, sub }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-start gap-2.5 bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-colors no-underline"
                  >
                    <span className="text-lg shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">{label}</div>
                      <div className="text-[10px] text-slate-400">{sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-extrabold text-slate-900 mb-5">Related Articles</h2>
                <div className="space-y-4">
                  {relatedPosts.map((rp: any) => (
                    <Link
                      key={rp.id}
                      href={`/blog/${rp.slug}`}
                      className="group flex items-start gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:border-sky-300 hover:shadow-md transition-all no-underline"
                    >
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{ background: rp.featuredImageGradient || 'linear-gradient(135deg,#0ea5e9,#0284c7)' }}
                      >
                        📝
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 mb-1">{rp.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{rp.excerpt}</p>
                        <div className="text-xs text-slate-400 mt-1">
                          {rp.readTimeMinutes ? `${rp.readTimeMinutes} min read` : ''}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom nav */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-500 hover:text-sky-600 no-underline">
                ← Back to Blog
              </Link>
              <Link href="/submit-tool" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-600 no-underline border border-slate-200 hover:border-sky-300 px-4 py-2 rounded-xl transition-colors">
                + Submit a Tool
              </Link>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-5">

              {/* Submit a Tool — sidebar CTA */}
              <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl p-5 text-white text-center">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="text-sm font-extrabold mb-2 tracking-tight">Submit a Tool</h3>
                <p className="text-xs text-white/80 mb-4 leading-relaxed">
                  Know an AI tool that earns money? Get it featured in front of 10,000+ monthly readers.
                </p>
                <Link
                  href="/submit-tool"
                  className="block bg-white text-sky-600 font-bold py-2.5 rounded-xl text-xs hover:bg-sky-50 transition-colors no-underline"
                >
                  + Submit a Tool
                </Link>
              </div>

              {/* Pillar page nav */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-xs font-extrabold text-slate-900 tracking-tight uppercase mb-4">Explore Guides</h3>
                <div className="space-y-2">
                  {PILLAR_LINKS.map(({ href, label, icon, sub }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors no-underline group"
                    >
                      <span className="text-xl shrink-0">{icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{label}</div>
                        <div className="text-[10px] text-slate-400">{sub}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tools mentioned — sidebar version */}
              {post.toolsMentioned?.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-xs font-extrabold text-slate-900 tracking-tight uppercase mb-4">Tools in This Article</h3>
                  <div className="space-y-3">
                    {post.toolsMentioned.slice(0, 5).map((tool: any) => {
                      const t = typeof tool === 'object' ? tool : { id: tool, name: 'Tool', slug: '' }
                      const href = t.affiliateLink ? `/go/${t.slug}` : `/tools/${t.slug}`
                      return (
                        <Link
                          key={t.id}
                          href={href}
                          target={t.affiliateLink ? '_blank' : undefined}
                          rel={t.affiliateLink ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-2.5 group no-underline"
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                            style={{ background: t.iconGradient || 'linear-gradient(135deg,#0ea5e9,#0284c7)' }}
                          >
                            {t.icon || '🤖'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">{t.name}</div>
                            {t.price && <div className="text-[10px] text-slate-400">{t.price}</div>}
                          </div>
                          <span className="text-[10px] font-bold text-sky-500 shrink-0">→</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Newsletter signup */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="text-xs font-extrabold text-slate-900 tracking-tight mb-1">Weekly AI Income Tips</h3>
                <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">Join 5,000+ readers. New strategies every week.</p>
                <Link
                  href="/newsletter"
                  className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs text-center transition-colors no-underline"
                >
                  Subscribe Free →
                </Link>
              </div>

              {/* Affiliate disclosure */}
              <p className="text-[10px] text-slate-400 leading-relaxed px-1">
                Affiliate disclosure: We may earn a commission if you purchase through our links. This never affects our reviews or rankings.{' '}
                <Link href="/affiliate-disclosure" className="underline">Learn more</Link>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
