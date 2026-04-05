import { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import ToolCard from '@/components/ToolCard'
import AdUnit from '@/components/AdUnit'

export const metadata: Metadata = {
  title: 'AI Tool Reviews — Best AI Tools for Making Money',
  description: 'Honest reviews of 170+ AI tools ranked by income potential. Find the best AI tools for freelancing, content creation, and building an AI business.',
}

export const revalidate = 3600

const PRICING_FILTERS = ['All', 'Free', 'Freemium', 'Paid', 'Free Trial']
const CATEGORY_FILTERS = ['All', 'Writing', 'Image', 'Video', 'Audio', 'SEO', 'Automation', 'Productivity']

async function getTools(category?: string, pricing?: string) {
  try {
    const payload = await getPayload()

    const where: any = { published: { equals: true } }
    if (pricing && pricing !== 'All') {
      where.pricingModel = { equals: pricing.toLowerCase().replace(' ', '-') }
    }

    const result = await payload.find({
      collection: 'tools',
      where,
      limit: 100,
      sort: '-featured,-rating',
    })
    return result.docs
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'categories',
      limit: 50,
      sort: 'name',
    })
    return result.docs
  } catch {
    return []
  }
}

// Fallback static tools shown when DB is empty
const FALLBACK_TOOLS = [
  { id: '1', name: 'ChatGPT Plus', slug: 'chatgpt-plus', url: 'https://chat.openai.com', tagline: 'The gold standard for AI writing, coding & automation', description: 'ChatGPT Plus gives you GPT-4 access, faster responses, and plugins for maximum productivity.', icon: '🤖', iconGradient: 'linear-gradient(135deg,#10b981,#059669)', pricingModel: 'paid', price: '$20/mo', rating: 4.8, reviewCount: 2847, incomeLow: 3000, incomeHigh: 15000, featured: true, badge: 'Top Pick' },
  { id: '2', name: 'Midjourney', slug: 'midjourney', url: 'https://www.midjourney.com', tagline: 'Create stunning AI images that sell on stock sites and Etsy', description: 'The leading AI image generator for creating commercial-quality artwork at scale.', icon: '🎨', iconGradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', pricingModel: 'paid', price: '$10/mo', rating: 4.9, reviewCount: 3124, incomeLow: 2000, incomeHigh: 8000, featured: true, badge: 'Best Seller' },
  { id: '3', name: 'Claude Pro', slug: 'claude-pro', url: 'https://claude.ai', tagline: 'Superior long-form reasoning for complex client work', description: 'Anthropic\'s flagship AI with 200K context window — ideal for research and analysis.', icon: '⚡', iconGradient: 'linear-gradient(135deg,#f97316,#ea580c)', pricingModel: 'paid', price: '$20/mo', rating: 4.7, reviewCount: 1456, incomeLow: 2000, incomeHigh: 10000, featured: true },
  { id: '4', name: 'ElevenLabs', slug: 'elevenlabs', url: 'https://elevenlabs.io', tagline: 'AI voices so realistic you can sell voiceover services for $150/hr', description: 'Generate ultra-realistic AI voices for audiobooks, podcasts, and video narration.', icon: '🎙️', iconGradient: 'linear-gradient(135deg,#f59e0b,#d97706)', pricingModel: 'freemium', price: 'Free', rating: 4.7, reviewCount: 1893, incomeLow: 2000, incomeHigh: 10000 },
  { id: '5', name: 'Jasper AI', slug: 'jasper-ai', url: 'https://www.jasper.ai', tagline: 'Enterprise-grade AI writing for agencies and content teams', description: 'AI writing tool built for marketing teams with brand voice training and SEO mode.', icon: '✍️', iconGradient: 'linear-gradient(135deg,#0ea5e9,#0284c7)', pricingModel: 'paid', price: '$49/mo', rating: 4.5, reviewCount: 2103, incomeLow: 3000, incomeHigh: 12000 },
  { id: '6', name: 'HeyGen', slug: 'heygen', url: 'https://www.heygen.com', tagline: 'Create professional AI avatar videos in minutes', description: 'Turn scripts into talking-head videos with realistic AI avatars — no camera needed.', icon: '🎬', iconGradient: 'linear-gradient(135deg,#ec4899,#db2777)', pricingModel: 'freemium', price: 'Free', rating: 4.6, reviewCount: 987, incomeLow: 3000, incomeHigh: 15000 },
  { id: '7', name: 'Surfer SEO', slug: 'surfer-seo', url: 'https://surferseo.com', tagline: 'AI-powered content optimization that ranks on page 1', description: 'Real-time SEO guidance while you write — used by 150,000+ content marketers.', icon: '📈', iconGradient: 'linear-gradient(135deg,#22c55e,#16a34a)', pricingModel: 'paid', price: '$89/mo', rating: 4.6, reviewCount: 1654, incomeLow: 5000, incomeHigh: 20000 },
  { id: '8', name: 'Canva AI', slug: 'canva-ai', url: 'https://www.canva.com', tagline: 'AI design tools that turn you into a professional graphic designer', description: 'Magic Studio, AI image generation, and one-click design resize — all in Canva.', icon: '🎨', iconGradient: 'linear-gradient(135deg,#06b6d4,#0891b2)', pricingModel: 'freemium', price: 'Free', rating: 4.5, reviewCount: 4231, incomeLow: 1000, incomeHigh: 5000 },
  { id: '9', name: 'Notion AI', slug: 'notion-ai', url: 'https://www.notion.so', tagline: 'AI that works inside your workspace to 10x your productivity', description: 'Write, summarize, brainstorm, and automate inside Notion with built-in AI.', icon: '📝', iconGradient: 'linear-gradient(135deg,#6366f1,#4f46e5)', pricingModel: 'freemium', price: 'Free', rating: 4.4, reviewCount: 3876, incomeLow: 500, incomeHigh: 3000 },
]

export default async function ToolsPage() {
  const [tools, categories] = await Promise.all([getTools(), getCategories()])
  const displayTools = tools.length > 0 ? tools : FALLBACK_TOOLS

  return (
    <>
      {/* Page hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white pt-12 pb-10 px-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">AI Tools</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">AI Tool Reviews</h1>
          <p className="text-slate-500 text-base max-w-2xl">
            {displayTools.length}+ AI tools reviewed and ranked by income potential. Updated weekly.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="lg:grid lg:grid-cols-[200px_1fr] gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Pricing</h3>
                <ul className="list-none p-0 m-0 space-y-1">
                  {PRICING_FILTERS.map(f => (
                    <li key={f}>
                      <Link
                        href={f === 'All' ? '/tools' : `/tools?pricing=${f.toLowerCase()}`}
                        className="block text-sm text-slate-600 hover:text-sky-600 py-1.5 px-2 rounded-lg hover:bg-sky-50 no-underline transition-colors"
                      >
                        {f}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Category</h3>
                <ul className="list-none p-0 m-0 space-y-1">
                  {(categories.length > 0 ? categories.map((c: any) => c.name) : CATEGORY_FILTERS).map((name: string) => (
                    <li key={name}>
                      <Link
                        href={name === 'All' ? '/tools' : `/tools?category=${name.toLowerCase()}`}
                        className="block text-sm text-slate-600 hover:text-sky-600 py-1.5 px-2 rounded-lg hover:bg-sky-50 no-underline transition-colors"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Tools grid */}
          <div>
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500">{displayTools.length} tools</p>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Sort:</span>
                <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-sky-300 bg-white">
                  <option>Top Rated</option>
                  <option>Income: High to Low</option>
                  <option>Price: Low to High</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayTools.map((tool: any) => (
                <ToolCard
                  key={tool.id || tool.slug}
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
                  badge={(tool as any).badge}
                  featured={tool.featured}
                  affiliateLink={(tool as any).affiliateLink}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Get listed CTA */}
        <div className="mt-10 bg-gradient-to-r from-sky-50 to-slate-50 border border-sky-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900 mb-1">Have an AI tool, prompt pack, or coaching course?</p>
            <p className="text-xs text-slate-500">Get in front of 10,000+ monthly visitors actively looking to buy and use AI tools.</p>
          </div>
          <Link
            href="/list-your-product"
            className="flex-shrink-0 inline-flex items-center text-sm font-bold px-5 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors no-underline"
          >
            Get Listed →
          </Link>
        </div>

        {/* Leaderboard banner — below tools grid */}
        <div className="pt-8 pb-2 overflow-hidden flex justify-center">
          <AdUnit size="leaderboard" placement="tools" />
        </div>
      </div>
    </>
  )
}
