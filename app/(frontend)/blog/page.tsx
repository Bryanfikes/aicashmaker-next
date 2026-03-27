import { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Blog — AI Income Strategies, Guides & Case Studies',
  description: 'In-depth guides on making money with AI — from freelancing to building an AI agency. Updated weekly.',
}

export const revalidate = 3600

const FALLBACK_POSTS = [
  { id: '1', slug: '10-ways-to-make-money-with-chatgpt', title: '10 Ways to Make Money with ChatGPT in 2025', excerpt: 'From freelance writing to building SaaS products, here are the most profitable ways to monetize ChatGPT right now.', category: 'ChatGPT', readTimeMins: 8, publishedAt: '2025-01-15' },
  { id: '2', slug: 'how-to-sell-ai-prompts', title: 'How to Sell AI Prompts for $500–$5,000/Month', excerpt: 'The complete guide to packaging, pricing, and selling AI prompts on PromptBase, Etsy, and your own store.', category: 'Prompts', readTimeMins: 6, publishedAt: '2025-01-10' },
  { id: '3', slug: 'make-money-midjourney', title: 'How to Make Money with Midjourney: 7 Proven Methods', excerpt: 'Stock photos, print-on-demand, client commissions — here\'s exactly how creators are earning with AI art.', category: 'Image AI', readTimeMins: 7, publishedAt: '2025-01-05' },
  { id: '4', slug: 'best-ai-tools-for-freelancers', title: 'Best AI Tools for Freelancers in 2025 (Ranked)', excerpt: 'The top AI tools that help freelancers 10x their output, raise rates, and land better clients.', category: 'Tools', readTimeMins: 9, publishedAt: '2024-12-28' },
  { id: '5', slug: 'build-an-ai-agency', title: 'How to Build an AI Agency from $0 (Full Blueprint)', excerpt: 'The exact steps to start, price, and scale an AI agency that earns $10k–$30k per month.', category: 'Agency', readTimeMins: 12, publishedAt: '2024-12-20' },
  { id: '6', slug: 'best-ai-affiliate-programs', title: 'Best AI Affiliate Programs Paying 30–40% Recurring Commission', excerpt: 'The highest-paying AI affiliate programs ranked by commission rate, cookie duration, and conversion rate.', category: 'Affiliate', readTimeMins: 5, publishedAt: '2024-12-15' },
]

const CATEGORY_COLORS: Record<string, string> = {
  ChatGPT: 'bg-emerald-100 text-emerald-700',
  Prompts: 'bg-violet-100 text-violet-700',
  'Image AI': 'bg-pink-100 text-pink-700',
  Tools: 'bg-sky-100 text-sky-700',
  Agency: 'bg-amber-100 text-amber-700',
  Affiliate: 'bg-orange-100 text-orange-700',
  Guide: 'bg-slate-100 text-slate-700',
}

async function getPosts() {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'blog-posts',
      where: { published: { equals: true } },
      limit: 50,
      sort: '-publishedAt',
    })
    return result.docs
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()
  const displayPosts = posts.length > 0 ? posts : FALLBACK_POSTS
  const [featured, ...rest] = displayPosts

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white pt-12 pb-10 px-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">Blog</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">AI Income Blog</h1>
          <p className="text-slate-500 text-base max-w-2xl">
            In-depth guides, case studies, and strategies for making money with AI — updated every week.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Featured post */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline mb-10"
        >
          <div className="sm:grid sm:grid-cols-[1fr_2fr] gap-0">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 h-48 sm:h-full flex items-center justify-center text-5xl">
              📝
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[(featured as any).category] || CATEGORY_COLORS.Guide}`}>
                  {(featured as any).category || 'Guide'}
                </span>
                <span className="text-xs text-slate-400">Featured</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors leading-snug">
                {featured.title}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
              <div className="text-xs text-slate-400">
                {(featured as any).readTimeMins ? `${(featured as any).readTimeMins} min read` : ''}
              </div>
            </div>
          </div>
        </Link>

        {/* Post grid */}
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">All Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post: any) => (
            <Link
              key={post.id || post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Guide}`}>
                  {post.category || 'Guide'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {post.readTimeMins ? `${post.readTimeMins} min read` : ''}
                </span>
                <span className="text-xs font-semibold text-sky-500 group-hover:text-sky-600">Read →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
