import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

// Static data for the 9 featured tools — used when DB record doesn't exist yet
const STATIC_TOOLS: Record<string, any> = {
  'chatgpt-plus': {
    name: 'ChatGPT Plus', slug: 'chatgpt-plus', icon: '🤖',
    iconGradient: 'linear-gradient(135deg,#10b981,#059669)',
    tagline: 'The gold standard for AI writing, coding & automation',
    description: 'ChatGPT Plus gives you GPT-4 access, faster responses, plugins, and DALL·E image generation for maximum productivity and income potential.',
    pricingModel: 'paid', price: '$20/mo', rating: 4.8, reviewCount: 2847,
    incomeLow: 3000, incomeHigh: 15000, featured: true,
    websiteUrl: 'https://chat.openai.com', affiliateLink: 'https://chat.openai.com',
    category: { name: 'AI Writing Tools' },
    pros: [
      { item: 'GPT-4 and GPT-4o with faster response times' },
      { item: 'DALL·E image generation built in' },
      { item: 'Advanced data analysis and code interpreter' },
      { item: 'Custom GPTs marketplace with thousands of tools' },
      { item: 'Best-in-class instruction following for client work' },
    ],
    cons: [
      { item: '$20/mo cost may feel steep for beginners' },
      { item: 'Knowledge cutoff can lag behind current events' },
      { item: 'Can produce confident-sounding but wrong answers' },
    ],
    moneyMethods: [
      { title: 'AI Freelance Writing', description: 'Write blog posts, email sequences, and ad copy for clients in a fraction of the time. Charge $0.10–$0.20/word while producing content at 5x speed.', incomeLow: 3000, incomeHigh: 10000 },
      { title: 'Custom GPT Creation', description: 'Build and sell custom GPTs on the GPT Store or as standalone tools for specific industries. Charge $50–$500 setup plus a monthly retainer.', incomeLow: 1000, incomeHigh: 5000 },
      { title: 'AI Coding & App Development', description: 'Use ChatGPT to write and debug code. Build MVPs for clients or sell small automation scripts and tools.', incomeLow: 2000, incomeHigh: 15000 },
      { title: 'AI Consulting & Training', description: 'Teach businesses how to integrate ChatGPT into their workflows. Charge $150–$500/hr for workshops and implementation consulting.', incomeLow: 3000, incomeHigh: 12000 },
    ],
    updatedNote: 'Updated April 2025',
  },
  'midjourney': {
    name: 'Midjourney', slug: 'midjourney', icon: '🎨',
    iconGradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
    tagline: 'Create stunning AI images that sell on stock sites and Etsy',
    description: 'The leading AI image generator for creating commercial-quality artwork at scale. Used by designers, marketers, and creators worldwide.',
    pricingModel: 'paid', price: '$10/mo', rating: 4.9, reviewCount: 3124,
    incomeLow: 2000, incomeHigh: 8000, featured: true,
    websiteUrl: 'https://www.midjourney.com', affiliateLink: 'https://www.midjourney.com',
    category: { name: 'AI Image Tools' },
    pros: [
      { item: 'Best image quality of any AI image generator' },
      { item: 'Consistent artistic styles and brand aesthetics' },
      { item: 'Strong community and Discord-based workflow' },
      { item: 'Commercial use rights included' },
      { item: 'New web interface for easier use' },
    ],
    cons: [
      { item: 'Discord-based workflow has a learning curve' },
      { item: 'Struggles with text in images' },
      { item: 'No free tier — paid plans only' },
    ],
    moneyMethods: [
      { title: 'Etsy Digital Art Sales', description: 'Create and sell AI-generated art prints, wall art, and digital downloads on Etsy. Top sellers earn $2,000–$8,000/mo passively.', incomeLow: 500, incomeHigh: 8000 },
      { title: 'Stock Image Licensing', description: 'Upload AI art to stock sites like Adobe Stock, Shutterstock, and Pond5. Earn royalties on every download.', incomeLow: 200, incomeHigh: 3000 },
      { title: 'Social Media Content Agency', description: 'Create branded social media visuals for clients. Charge $500–$2,000/month per client for a content package.', incomeLow: 2000, incomeHigh: 8000 },
      { title: 'Print-on-Demand Products', description: 'Apply Midjourney designs to t-shirts, mugs, and phone cases on Printify or Redbubble. Zero inventory required.', incomeLow: 300, incomeHigh: 3000 },
    ],
    updatedNote: 'Updated April 2025',
  },
  'claude-pro': {
    name: 'Claude Pro', slug: 'claude-pro', icon: '⚡',
    iconGradient: 'linear-gradient(135deg,#f97316,#ea580c)',
    tagline: 'Superior long-form reasoning for complex client work',
    description: "Anthropic's flagship AI with a 200K context window — ideal for deep research, long-form writing, document analysis, and complex reasoning tasks.",
    pricingModel: 'paid', price: '$20/mo', rating: 4.7, reviewCount: 1456,
    incomeLow: 2000, incomeHigh: 10000, featured: true,
    websiteUrl: 'https://claude.ai', affiliateLink: 'https://claude.ai',
    category: { name: 'AI Writing Tools' },
    pros: [
      { item: '200K token context window — analyze entire books or codebases' },
      { item: 'Best-in-class for nuanced, thoughtful writing' },
      { item: 'Excellent at following complex multi-step instructions' },
      { item: 'Strong ethical guardrails without being overly restrictive' },
      { item: 'Superior coding and debugging capabilities' },
    ],
    cons: [
      { item: 'No image generation capability' },
      { item: 'Smaller plugin/tool ecosystem than ChatGPT' },
      { item: 'Can be slower on very long context tasks' },
    ],
    moneyMethods: [
      { title: 'Long-Form Content Production', description: 'Write in-depth guides, white papers, and reports for B2B clients. Claude\'s nuanced writing commands premium rates of $500–$2,000 per piece.', incomeLow: 2000, incomeHigh: 8000 },
      { title: 'Document Analysis Services', description: 'Analyze contracts, financial reports, and research papers for clients. Charge by the hour or per document for expert AI-assisted analysis.', incomeLow: 1500, incomeHigh: 6000 },
      { title: 'AI Coding & Development', description: "Use Claude's code generation for full-stack development, debugging, and code review services for clients and agencies.", incomeLow: 3000, incomeHigh: 10000 },
    ],
    updatedNote: 'Updated April 2025',
  },
  'elevenlabs': {
    name: 'ElevenLabs', slug: 'elevenlabs', icon: '🎙️',
    iconGradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
    tagline: 'AI voices so realistic you can sell voiceover services for $150/hr',
    description: 'Generate ultra-realistic AI voices for audiobooks, podcasts, YouTube videos, and professional voiceover services.',
    pricingModel: 'freemium', price: 'Free / $5+/mo', rating: 4.7, reviewCount: 1893,
    incomeLow: 2000, incomeHigh: 10000,
    websiteUrl: 'https://elevenlabs.io', affiliateLink: 'https://elevenlabs.io',
    category: { name: 'AI Voice Tools' },
    pros: [
      { item: 'Most realistic AI voices on the market' },
      { item: 'Clone your own voice in minutes' },
      { item: 'Supports 29+ languages' },
      { item: 'Free tier available for testing' },
      { item: 'API access for automation and SaaS products' },
    ],
    cons: [
      { item: 'Free tier is limited to 10,000 characters/month' },
      { item: 'Voice cloning requires clear audio samples' },
      { item: 'Some voices sound slightly robotic on fast speech' },
    ],
    moneyMethods: [
      { title: 'Voiceover Services on Fiverr/Upwork', description: 'Sell professional voiceover services using ElevenLabs. Charge $50–$500 per project and deliver in hours, not days.', incomeLow: 1000, incomeHigh: 5000 },
      { title: 'Audiobook Narration', description: 'Narrate books for authors and publishers. ACX pays $100–$400 per finished hour. Use ElevenLabs to produce 10x faster.', incomeLow: 500, incomeHigh: 3000 },
      { title: 'YouTube Channel Narration', description: 'Create faceless YouTube channels with AI narration. Monetize through AdSense and sponsorships once you hit 1,000 subscribers.', incomeLow: 500, incomeHigh: 10000 },
      { title: 'Corporate Training Videos', description: 'Create voiceovers for corporate training, e-learning modules, and product demos. Charge $300–$1,500 per project.', incomeLow: 2000, incomeHigh: 8000 },
    ],
    updatedNote: 'Updated April 2025',
  },
  'jasper-ai': {
    name: 'Jasper AI', slug: 'jasper-ai', icon: '✍️',
    iconGradient: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
    tagline: 'Enterprise-grade AI writing for agencies and content teams',
    description: 'AI writing tool built specifically for marketing teams with brand voice training, SEO mode, and campaign templates.',
    pricingModel: 'paid', price: '$49/mo', rating: 4.5, reviewCount: 2103,
    incomeLow: 3000, incomeHigh: 12000,
    websiteUrl: 'https://www.jasper.ai', affiliateLink: 'https://www.jasper.ai',
    category: { name: 'AI Writing Tools' },
    pros: [
      { item: 'Built-in brand voice training across all outputs' },
      { item: 'Surfer SEO integration for optimized content' },
      { item: '50+ marketing-specific templates' },
      { item: 'Team collaboration features' },
      { item: 'Strong campaign and content calendar tools' },
    ],
    cons: [
      { item: 'More expensive than competitors at $49/mo' },
      { item: 'Steeper learning curve for beginners' },
      { item: 'Best value for agencies — overkill for solo users' },
    ],
    moneyMethods: [
      { title: 'Content Marketing Agency', description: 'Offer content creation packages to SMBs. Write blog posts, landing pages, and email sequences at scale. Charge $1,500–$5,000/mo per retainer.', incomeLow: 3000, incomeHigh: 12000 },
      { title: 'AI Copywriting Services', description: 'Write high-converting ad copy, email sequences, and sales pages for e-commerce and SaaS clients.', incomeLow: 2000, incomeHigh: 8000 },
    ],
    updatedNote: 'Updated April 2025',
  },
  'heygen': {
    name: 'HeyGen', slug: 'heygen', icon: '🎬',
    iconGradient: 'linear-gradient(135deg,#ec4899,#db2777)',
    tagline: 'Create professional AI avatar videos in minutes',
    description: 'Turn scripts into professional talking-head videos with realistic AI avatars — no camera, studio, or video editing skills required.',
    pricingModel: 'freemium', price: 'Free / $29+/mo', rating: 4.6, reviewCount: 987,
    incomeLow: 3000, incomeHigh: 15000,
    websiteUrl: 'https://www.heygen.com', affiliateLink: 'https://www.heygen.com',
    category: { name: 'AI Video Tools' },
    pros: [
      { item: 'Hyper-realistic AI avatars that look human' },
      { item: 'Clone your own avatar in minutes' },
      { item: 'Auto-translate videos into 40+ languages' },
      { item: 'No video editing skills needed' },
      { item: 'Professional results from a simple text script' },
    ],
    cons: [
      { item: 'Free tier limited to 1 minute per video' },
      { item: 'Avatars can look slightly off in close-ups' },
      { item: 'Rendering takes longer than real-time' },
    ],
    moneyMethods: [
      { title: 'Video Marketing Agency', description: 'Create explainer videos, product demos, and training content for clients. Charge $500–$3,000 per video.', incomeLow: 3000, incomeHigh: 15000 },
      { title: 'Multilingual Content Localization', description: 'Take existing videos and translate them into 40+ languages using HeyGen. Charge a premium for international content packages.', incomeLow: 2000, incomeHigh: 8000 },
      { title: 'YouTube Faceless Channel', description: 'Build a faceless educational YouTube channel using AI avatars. Monetize with ads and sponsorships.', incomeLow: 500, incomeHigh: 5000 },
    ],
    updatedNote: 'Updated April 2025',
  },
  'surfer-seo': {
    name: 'Surfer SEO', slug: 'surfer-seo', icon: '📈',
    iconGradient: 'linear-gradient(135deg,#22c55e,#16a34a)',
    tagline: 'AI-powered content optimization that ranks on page 1',
    description: 'Real-time SEO guidance while you write, with NLP-driven keyword analysis used by 150,000+ content marketers.',
    pricingModel: 'paid', price: '$89/mo', rating: 4.6, reviewCount: 1654,
    incomeLow: 5000, incomeHigh: 20000,
    websiteUrl: 'https://surferseo.com', affiliateLink: 'https://surferseo.com',
    category: { name: 'AI SEO Tools' },
    pros: [
      { item: 'Real-time content score as you write' },
      { item: 'NLP-driven keyword recommendations' },
      { item: 'Content audit to improve existing pages' },
      { item: 'SERP analyzer to reverse-engineer top results' },
      { item: 'Built-in AI writing with SEO optimization' },
    ],
    cons: [
      { item: 'Expensive at $89/mo — better suited for agencies' },
      { item: 'Data can feel overwhelming for beginners' },
      { item: 'Works best combined with strong writing skills' },
    ],
    moneyMethods: [
      { title: 'SEO Content Agency', description: 'Use Surfer to produce content that consistently ranks. Charge clients $2,000–$8,000/mo for a monthly SEO content retainer.', incomeLow: 5000, incomeHigh: 20000 },
      { title: 'SEO Consulting', description: 'Audit and optimize existing client websites with Surfer\'s content audit. Charge $1,500–$5,000 per site audit engagement.', incomeLow: 3000, incomeHigh: 10000 },
      { title: 'Affiliate Niche Sites', description: 'Build affiliate review sites and use Surfer to rank content. Earn 4–6 figures per year from passive affiliate commissions.', incomeLow: 1000, incomeHigh: 10000 },
    ],
    updatedNote: 'Updated April 2025',
  },
  'canva-ai': {
    name: 'Canva AI', slug: 'canva-ai', icon: '🎨',
    iconGradient: 'linear-gradient(135deg,#06b6d4,#0891b2)',
    tagline: 'AI design tools that turn you into a professional graphic designer',
    description: 'Magic Studio, AI image generation, one-click resizing, and brand kit tools — all the AI features you need to create stunning designs in Canva.',
    pricingModel: 'freemium', price: 'Free / $15/mo Pro', rating: 4.5, reviewCount: 4231,
    incomeLow: 1000, incomeHigh: 5000,
    websiteUrl: 'https://www.canva.com', affiliateLink: 'https://www.canva.com',
    category: { name: 'AI Design Tools' },
    pros: [
      { item: 'Free tier is genuinely powerful' },
      { item: 'Magic Studio: AI writing, image gen, and resizing' },
      { item: 'Thousands of templates for every use case' },
      { item: 'Brand Kit keeps designs consistent for clients' },
      { item: 'Drag-and-drop — no design skills needed' },
    ],
    cons: [
      { item: 'AI image generation lags behind Midjourney' },
      { item: 'Pro plan required for best AI features' },
      { item: 'Not suitable for print-ready production work' },
    ],
    moneyMethods: [
      { title: 'Social Media Management', description: 'Create and manage social media content for local businesses using Canva templates. Charge $500–$2,000/mo per client.', incomeLow: 1000, incomeHigh: 5000 },
      { title: 'Canva Template Shop', description: 'Design and sell Canva templates on Etsy or Creative Market. Top template sellers earn $1,000–$5,000/mo passively.', incomeLow: 500, incomeHigh: 4000 },
      { title: 'Brand Identity Packages', description: 'Create logos, brand kits, and social media packs for small businesses. Charge $200–$800 per brand package.', incomeLow: 1000, incomeHigh: 4000 },
    ],
    updatedNote: 'Updated April 2025',
  },
  'notion-ai': {
    name: 'Notion AI', slug: 'notion-ai', icon: '📝',
    iconGradient: 'linear-gradient(135deg,#6366f1,#4f46e5)',
    tagline: 'AI that works inside your workspace to 10x your productivity',
    description: 'Write, summarize, brainstorm, translate, and automate inside Notion with built-in AI — no switching between tools.',
    pricingModel: 'freemium', price: 'Free / $10/mo AI add-on', rating: 4.4, reviewCount: 3876,
    incomeLow: 500, incomeHigh: 3000,
    websiteUrl: 'https://www.notion.so', affiliateLink: 'https://www.notion.so',
    category: { name: 'AI Productivity Tools' },
    pros: [
      { item: 'AI is embedded directly in your workspace' },
      { item: 'AI summarization, translation, and Q&A on your docs' },
      { item: 'Excellent for building SOPs and business systems' },
      { item: 'Free plan available with generous limits' },
      { item: 'Strong template ecosystem' },
    ],
    cons: [
      { item: 'AI features require a paid add-on ($10/mo)' },
      { item: 'Can get complex for simple use cases' },
      { item: 'AI is less capable than dedicated tools like Claude' },
    ],
    moneyMethods: [
      { title: 'Notion Template Business', description: 'Build and sell Notion templates for specific niches (agencies, coaches, freelancers). Sell on Gumroad or Notion\'s own marketplace.', incomeLow: 500, incomeHigh: 3000 },
      { title: 'Business System Consulting', description: 'Set up Notion workspaces and SOPs for small businesses and agencies. Charge $500–$2,000 per implementation.', incomeLow: 1000, incomeHigh: 4000 },
    ],
    updatedNote: 'Updated April 2025',
  },
}

async function getTool(slug: string) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'tools',
      where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
      limit: 1,
    })
    return result.docs[0] || STATIC_TOOLS[slug] || null
  } catch {
    return STATIC_TOOLS[slug] || null
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
  return Object.keys(STATIC_TOOLS).map(slug => ({ slug }))
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
            {tool.fullReview && (
              <div className="prose-content mb-10">
                <div dangerouslySetInnerHTML={{ __html: convertLexicalToHTML({ data: tool.fullReview, disableContainer: true }) }} />
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

                {(tool.affiliateLink || tool.websiteUrl) && (
                  <a
                    href={tool.affiliateLink ? `/go/${tool.slug}` : tool.websiteUrl}
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
