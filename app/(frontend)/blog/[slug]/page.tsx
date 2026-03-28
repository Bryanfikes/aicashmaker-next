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
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export async function generateStaticParams() { return [] }

const CATEGORY_COLORS: Record<string, string> = {
  ChatGPT: 'bg-emerald-100 text-emerald-700',
  Prompts: 'bg-violet-100 text-violet-700',
  'Image AI': 'bg-pink-100 text-pink-700',
  Tools: 'bg-sky-100 text-sky-700',
  Agency: 'bg-amber-100 text-amber-700',
  Affiliate: 'bg-orange-100 text-orange-700',
  Guide: 'bg-slate-100 text-slate-700',
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const authorName = typeof post.author === 'object' ? post.author?.name : 'AICashMaker'
  const categoryColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Guide

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <Link href="/blog" className="hover:text-slate-600 no-underline">Blog</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600 line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            {post.category && (
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColor}`}>
                {post.category}
              </span>
            )}
            {post.readTimeMins && (
              <span className="text-xs text-slate-400">{post.readTimeMins} min read</span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-slate-500 leading-relaxed mb-6">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-xs font-bold">
              {authorName?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{authorName}</div>
              {post.publishedAt && (
                <div className="text-xs text-slate-400">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article body */}
        <article className="prose-content">
          {post.body ? (
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          ) : (
            <p className="text-slate-500 italic">Content coming soon.</p>
          )}
        </article>

        {/* Related tools CTA */}
        {post.relatedTools?.length > 0 && (
          <div className="mt-12 border-t border-slate-100 pt-10">
            <h2 className="text-xl font-extrabold text-slate-900 mb-5">Tools Mentioned in This Article</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {post.relatedTools.map((tool: any) => {
                const t = typeof tool === 'object' ? tool : { id: tool, name: 'Tool', slug: '' }
                return (
                  <Link
                    key={t.id}
                    href={`/tools/${t.slug}`}
                    className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-4 hover:border-sky-300 hover:shadow-md transition-all no-underline group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-lg flex-shrink-0">
                      {t.icon || '🤖'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.tagline}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Back to blog */}
        <div className="mt-10 pt-6 border-t border-slate-100">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-500 hover:text-sky-600 no-underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </>
  )
}
