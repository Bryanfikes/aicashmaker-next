import { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Blog — AI Income Strategies, Guides & Case Studies',
  description: 'In-depth guides on making money with AI — from freelancing to building an AI agency. Updated weekly.',
}

export const revalidate = 3600

const FALLBACK_POSTS = [
  { id: '1', slug: '10-ways-to-make-money-with-chatgpt', title: '10 Ways to Make Money with ChatGPT in 2025', excerpt: 'From freelance writing to building SaaS products, here are the most profitable ways to monetize ChatGPT right now.', category: 'AI Side Hustles', readTimeMinutes: 8, publishedAt: '2025-01-15', featuredImageGradient: 'linear-gradient(135deg,#10b981,#059669)' },
  { id: '2', slug: 'how-to-sell-ai-prompts', title: 'How to Sell AI Prompts for $500–$5,000/Month', excerpt: 'The complete guide to packaging, pricing, and selling AI prompts on PromptBase, Etsy, and your own store.', category: 'AI Side Hustles', readTimeMinutes: 6, publishedAt: '2025-01-10', featuredImageGradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
  { id: '3', slug: 'make-money-midjourney', title: 'How to Make Money with Midjourney: 7 Proven Methods', excerpt: 'Stock photos, print-on-demand, client commissions — here\'s exactly how creators are earning with AI art.', category: 'AI Tools', readTimeMinutes: 7, publishedAt: '2025-01-05', featuredImageGradient: 'linear-gradient(135deg,#ec4899,#db2777)' },
  { id: '4', slug: 'best-ai-tools-for-freelancers', title: 'Best AI Tools for Freelancers in 2025 (Ranked)', excerpt: 'The top AI tools that help freelancers 10x their output, raise rates, and land better clients.', category: 'Best AI Tools', readTimeMinutes: 9, publishedAt: '2024-12-28', featuredImageGradient: 'linear-gradient(135deg,#0ea5e9,#0284c7)' },
  { id: '5', slug: 'build-an-ai-agency', title: 'How to Build an AI Agency from $0 (Full Blueprint)', excerpt: 'The exact steps to start, price, and scale an AI agency that earns $10k–$30k per month.', category: 'AI Side Hustles', readTimeMinutes: 12, publishedAt: '2024-12-20', featuredImageGradient: 'linear-gradient(135deg,#f97316,#ea580c)' },
  { id: '6', slug: 'best-ai-affiliate-programs', title: 'Best AI Affiliate Programs Paying 30–40% Recurring Commission', excerpt: 'The highest-paying AI affiliate programs ranked by commission rate, cookie duration, and conversion rate.', category: 'AI Marketing', readTimeMinutes: 5, publishedAt: '2024-12-15', featuredImageGradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
]

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
  { href: '/tools', label: 'AI Tools', icon: '🤖', desc: '170+ tools reviewed' },
  { href: '/side-hustles', label: 'Side Hustles', icon: '💼', desc: '65+ income guides' },
  { href: '/prompts', label: 'Prompt Packs', icon: '⚡', desc: 'Ready-to-sell prompts' },
  { href: '/automations', label: 'Automations', icon: '🔄', desc: 'Plug-and-play workflows' },
]

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function BlogPage() {
  const posts = await getPosts()
  const displayPosts = posts.length > 0 ? posts : FALLBACK_POSTS
  const [featured, second, ...rest] = displayPosts

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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">AI Income Blog</h1>
              <p className="text-slate-500 text-base max-w-2xl">
                In-depth guides, case studies, and income strategies for making money with AI — updated every week.
              </p>
            </div>
            <Link
              href="/submit-tool"
              className="shrink-0 inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors no-underline"
            >
              + Submit a Tool
            </Link>
          </div>
        </div>
      </section>

      {/* Pillar page quick links */}
      <div className="border-b border-slate-100 bg-white px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Explore:</span>
            {PILLAR_LINKS.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-colors no-underline"
              >
                <span>{icon}</span> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Featured post — full width hero */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline mb-4"
          >
            <div className="sm:grid sm:grid-cols-[1fr_2fr]">
              <div
                className="h-48 sm:h-full min-h-[200px] flex items-center justify-center text-5xl"
                style={{ background: (featured as any).featuredImageGradient || 'linear-gradient(135deg,#0ea5e9,#0284c7)' }}
              >
                📝
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[(featured as any).category] || 'bg-slate-100 text-slate-700'}`}>
                    {(featured as any).category || 'Guide'}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Featured</span>
                  {(featured as any).readTimeMinutes && (
                    <span className="text-xs text-slate-400">{(featured as any).readTimeMinutes} min read</span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors leading-snug">
                  {featured.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  {(featured as any).publishedAt && (
                    <span className="text-xs text-slate-400">{formatDate((featured as any).publishedAt)}</span>
                  )}
                  <span className="text-xs font-bold text-sky-500 group-hover:text-sky-600">Read Article →</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Second featured post — smaller hero alongside grid start */}
        {second && (
          <Link
            href={`/blog/${second.slug}`}
            className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline mb-10"
          >
            <div className="sm:grid sm:grid-cols-[120px_1fr]">
              <div
                className="h-24 sm:h-full flex items-center justify-center text-3xl"
                style={{ background: (second as any).featuredImageGradient || 'linear-gradient(135deg,#8b5cf6,#7c3aed)' }}
              >
                📝
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[(second as any).category] || 'bg-slate-100 text-slate-700'}`}>
                    {(second as any).category || 'Guide'}
                  </span>
                  {(second as any).readTimeMinutes && (
                    <span className="text-xs text-slate-400">{(second as any).readTimeMinutes} min read</span>
                  )}
                </div>
                <h2 className="text-base font-extrabold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors leading-snug line-clamp-2">
                  {second.title}
                </h2>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{second.excerpt}</p>
              </div>
            </div>
          </Link>
        )}

        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filter:</span>
          {['All', 'AI Side Hustles', 'AI Tools', 'Best AI Tools', 'AI Automation', 'AI Marketing', 'Tutorials', 'Income Reports'].map((cat, i) => (
            <button
              key={cat}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${i === 0 ? 'bg-sky-500 text-white border-sky-500' : 'border-slate-200 text-slate-600 hover:border-sky-400 hover:text-sky-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Post grid */}
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">All Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {rest.map((post: any) => (
            <Link
              key={post.id || post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline"
            >
              <div
                className="h-28 flex items-center justify-center text-3xl"
                style={{ background: post.featuredImageGradient || 'linear-gradient(135deg,#0ea5e9,#0284c7)' }}
              >
                📝
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-slate-100 text-slate-700'}`}>
                    {post.category || 'Guide'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {post.readTimeMinutes ? `${post.readTimeMinutes} min read` : ''}
                    {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ''}
                  </span>
                  <span className="text-xs font-semibold text-sky-500 group-hover:text-sky-600">Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Submit a Tool CTA banner */}
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl p-8 mb-12 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="text-xl font-extrabold mb-1">Found an AI tool that makes money?</h3>
              <p className="text-white/80 text-sm max-w-lg">
                Submit it to AICashMaker and get it in front of 10,000+ monthly readers actively looking for their next income stream.
              </p>
            </div>
            <Link
              href="/submit-tool"
              className="shrink-0 inline-flex items-center gap-2 bg-white text-sky-600 font-bold px-6 py-3 rounded-xl text-sm hover:bg-sky-50 transition-colors no-underline"
            >
              + Submit a Tool
            </Link>
          </div>
        </div>

        {/* Pillar page interlinks */}
        <div className="mb-12">
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Keep Exploring</h2>
          <p className="text-slate-500 text-sm mb-6">Everything you need to start making money with AI — tools, guides, prompts, and automations.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PILLAR_LINKS.map(({ href, label, icon, desc }) => (
              <Link
                key={href}
                href={href}
                className="group block bg-white border border-slate-200 rounded-2xl p-5 hover:border-sky-300 hover:shadow-md hover:-translate-y-0.5 transition-all no-underline"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-1">{label}</h3>
                <p className="text-xs text-slate-500">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Get New Guides Every Week</h3>
              <p className="text-slate-500 text-sm">Join 5,000+ readers getting the best AI income strategies straight to their inbox.</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 w-56"
                />
                <Link
                  href="/newsletter"
                  className="shrink-0 bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors no-underline"
                >
                  Subscribe
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
