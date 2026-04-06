import { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import ToolCard from '@/components/ToolCard'
import AdUnit from '@/components/AdUnit'

export const metadata: Metadata = {
  title: 'AICashMaker — Make Money with AI Tools',
  description: 'Discover the best AI tools for making money online. Reviews, side hustle guides, prompts, and automation templates — updated weekly.',
}

export const revalidate = 3600 // ISR: regenerate hourly

async function getFeaturedTools() {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'tools',
      where: { and: [{ featured: { equals: true } }, { published: { equals: true } }] },
      limit: 6,
      sort: '-rating',
    })
    return result.docs
  } catch {
    return []
  }
}

async function getLatestPosts() {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'blog-posts',
      where: { published: { equals: true } },
      limit: 3,
      sort: '-publishedAt',
    })
    return result.docs
  } catch {
    return []
  }
}

const sideHustles = [
  { icon: '✍️', title: 'AI Content Writing', income: '$2k–$8k/mo', href: '/side-hustles/ai-content-writing', color: 'bg-sky-50 border-sky-200' },
  { icon: '🎬', title: 'AI Video Creation', income: '$3k–$12k/mo', href: '/side-hustles/ai-video-creation', color: 'bg-violet-50 border-violet-200' },
  { icon: '📈', title: 'AI SEO Agency', income: '$5k–$20k/mo', href: '/side-hustles/ai-seo-agency', color: 'bg-emerald-50 border-emerald-200' },
  { icon: '🤖', title: 'AI Automation Consulting', income: '$8k–$30k/mo', href: '/side-hustles/ai-automation-consulting', color: 'bg-amber-50 border-amber-200' },
  { icon: '📱', title: 'AI Social Media Agency', income: '$3k–$10k/mo', href: '/side-hustles/ai-social-media', color: 'bg-rose-50 border-rose-200' },
  { icon: '💬', title: 'Prompt Engineering', income: '$2k–$15k/mo', href: '/side-hustles/prompt-engineering', color: 'bg-indigo-50 border-indigo-200' },
]

export default async function HomePage() {
  const [featuredTools, latestPosts] = await Promise.all([getFeaturedTools(), getLatestPosts()])

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-sky-400 text-sm font-semibold">170+ AI tools reviewed</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Make Real Money<br />
            <span className="text-sky-400">with AI Tools</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The #1 directory for AI tool reviews, side hustle guides, and income strategies. Stop scrolling. Start earning.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tools"
              className="btn btn-primary btn-lg text-base px-8 py-4 rounded-2xl font-bold"
            >
              Browse AI Tools
            </Link>
            <Link
              href="/side-hustles"
              className="inline-flex items-center justify-center font-bold text-base px-8 py-4 rounded-2xl border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Side Hustle Guides
            </Link>
          </div>

          {/* Trust bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
            {['170+ Tools Reviewed', '65+ Income Guides', 'Updated Weekly', 'Affiliate Disclosed'].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Billboard / Leaderboard — below hero, responsive */}
      <div className="py-3 px-4 bg-white border-b border-slate-100 overflow-hidden hidden lg:flex justify-center">
        <AdUnit size="billboard" placement="homepage" />
      </div>
      <div className="py-3 px-4 bg-white border-b border-slate-100 overflow-hidden hidden sm:flex lg:hidden justify-center">
        <AdUnit size="leaderboard" placement="homepage" />
      </div>

      {/* Featured Tools */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured AI Tools</h2>
              <p className="text-slate-500 mt-1 text-sm">Hand-picked tools with the highest income potential</p>
            </div>
            <Link href="/tools" className="text-sky-500 font-semibold text-sm hover:text-sky-600 flex items-center gap-1">
              View all tools →
            </Link>
          </div>

          {featuredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTools.map((tool: any) => (
                <ToolCard
                  key={tool.id}
                  name={tool.name}
                  slug={tool.slug}
                  tagline={tool.tagline}
                  description={tool.description}
                  icon={tool.icon}
                  iconGradient={tool.iconGradient}
                  category={typeof tool.category === 'object' ? tool.category?.name : tool.category}
                  pricingModel={tool.pricingModel}
                  price={tool.price}
                  rating={tool.rating}
                  reviewCount={tool.reviewCount}
                  incomeLow={tool.incomeLow}
                  incomeHigh={tool.incomeHigh}
                  featured={tool.featured}
                  affiliateLink={(tool as any).affiliateLink}
                />
              ))}
            </div>
          ) : (
            /* Fallback placeholder grid when DB is empty */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'ChatGPT Plus', slug: 'chatgpt-plus', tagline: 'The gold standard for AI writing, coding, and automation', icon: '🤖', iconGradient: 'linear-gradient(135deg,#10b981,#059669)', rating: 4.8, reviewCount: 2847, incomeLow: 3000, incomeHigh: 15000, price: '$20/mo', featured: true },
                { name: 'Midjourney', slug: 'midjourney', tagline: 'Create stunning AI images that sell on stock sites and Etsy', icon: '🎨', iconGradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', rating: 4.9, reviewCount: 3124, incomeLow: 2000, incomeHigh: 8000, price: '$10/mo' },
                { name: 'ElevenLabs', slug: 'elevenlabs', tagline: 'AI voices so realistic you can sell voiceover services for $150/hr', icon: '🎙️', iconGradient: 'linear-gradient(135deg,#f59e0b,#d97706)', rating: 4.7, reviewCount: 1893, incomeLow: 2000, incomeHigh: 10000, price: 'Free' },
              ].map(tool => (
                <ToolCard key={tool.slug} {...tool} description={tool.tagline} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard banner — between Featured Tools and Side Hustles */}
      <div className="py-5 px-4 overflow-hidden flex justify-center">
        <AdUnit size="leaderboard" placement="homepage" />
      </div>

      {/* Side Hustles */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">AI Side Hustle Guides</h2>
              <p className="text-slate-500 mt-1 text-sm">Step-by-step blueprints with real income ranges</p>
            </div>
            <Link href="/side-hustles" className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 flex items-center gap-1">
              View all guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sideHustles.map(({ icon, title, income, href, color }) => (
              <Link
                key={href}
                href={href}
                className={`group block p-5 rounded-2xl border ${color} hover:shadow-md hover:-translate-y-0.5 transition-all no-underline`}
              >
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-xs text-emerald-600 font-semibold">{income}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-sky-500 to-indigo-600">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Weekly AI Income Strategies
            </h2>
            <p className="text-sky-100 text-sm leading-relaxed">
              New tools, income opportunities, and real case studies — every Thursday. Free forever.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sky-100 text-xs">
              <span>✓ 12,000+ subscribers</span>
              <span>✓ No spam</span>
              <span>✓ Unsubscribe anytime</span>
            </div>
          </div>
          <div>
            <form
              className="flex flex-col gap-3"
              action="/api/newsletter/subscribe"
              method="POST"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-white/30 text-slate-900"
              />
              <button
                type="submit"
                className="btn btn-primary bg-white text-sky-600 hover:bg-sky-50 font-bold py-3 rounded-xl text-sm"
              >
                Get Free Weekly Strategies
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {(latestPosts.length > 0) && (
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Latest from the Blog</h2>
                <p className="text-slate-500 mt-1 text-sm">In-depth guides and case studies</p>
              </div>
              <Link href="/blog" className="text-amber-600 font-semibold text-sm hover:text-amber-700 flex items-center gap-1">
                View all posts →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline"
                >
                  <div className="p-5">
                    <div className="text-xs text-amber-600 font-semibold mb-2 uppercase tracking-wide">
                      {post.category || 'Guide'}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <div className="mt-3 text-xs text-slate-400">
                      {post.readTimeMins ? `${post.readTimeMins} min read` : ''}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
