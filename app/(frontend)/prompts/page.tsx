import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Prompt Marketplace — Buy & Sell ChatGPT & AI Prompts',
  description: 'Browse 1,200+ premium AI prompt packs for ChatGPT, Claude, Midjourney, and more. Buy ready-to-use prompts or sell your own.',
}

const FEATURED_PACKS = [
  { title: 'Ultimate ChatGPT Business Bundle', desc: '500+ prompts for sales, marketing, copywriting, HR, legal, and finance. The only pack you\'ll ever need for running a business with AI.', price: '$97', prompts: '500+ prompts' },
  { title: 'Midjourney Mastery Pack', desc: 'The complete system for generating stunning, commercial-quality images every time. Includes style guides, lighting formulas, and composition blueprints.', price: '$49', prompts: '300+ prompts' },
  { title: 'AI Freelancer Starter Kit', desc: 'Everything a freelancer needs to deliver faster and charge more — prompts for proposals, client emails, content, SEO, design briefs, and cold outreach.', price: '$29', prompts: '200+ prompts' },
]

const PROMPT_PACKS = [
  { model: 'ChatGPT', category: 'Copywriting', title: 'High-Converting Sales Page Pack', desc: 'Complete prompt system for writing sales pages, VSLs, and email sequences that convert. Used by 2,000+ copywriters.', creator: 'CopyPro AI', rating: '4.9', reviews: '847', price: '$29', prompts: '85 prompts' },
  { model: 'Midjourney', category: 'Art & Design', title: 'Photorealistic Portrait Masterclass', desc: 'The exact prompt formulas for generating magazine-quality portraits with perfect lighting, skin texture, and mood control.', creator: 'VisualAI Studio', rating: '4.8', reviews: '623', price: '$39', prompts: '120 prompts' },
  { model: 'Claude', category: 'Business', title: 'Executive Strategy Pack', desc: 'Prompts for strategic planning, competitive analysis, investor memos, board presentations, and executive communication.', creator: 'StrategyAI', rating: '4.9', reviews: '412', price: '$49', prompts: '60 prompts' },
  { model: 'ChatGPT', category: 'Content', title: 'SEO Blog Content System', desc: '90-day content calendar system with research prompts, outline generators, and full article writers optimized for Google rankings.', creator: 'SEO Prompt Lab', rating: '4.7', reviews: '1,204', price: '$19', prompts: '45 prompts' },
  { model: 'Multiple', category: 'Marketing', title: 'Social Media Growth Pack', desc: 'Platform-specific prompt packs for Instagram, LinkedIn, X/Twitter, and TikTok. Includes hooks, captions, scripts, and content calendars.', creator: 'GrowthHacker AI', rating: '4.8', reviews: '934', price: '$24', prompts: '180 prompts' },
  { model: 'Midjourney', category: 'Ecommerce', title: 'Product Photography Prompts', desc: 'Create stunning product mockups without a photographer. Includes lifestyle shots, white backgrounds, and brand-specific style guides.', creator: 'ProductViz AI', rating: '4.6', reviews: '567', price: '$34', prompts: '95 prompts' },
  { model: 'ChatGPT', category: 'Freelancing', title: 'Cold Email & Outreach System', desc: 'High-response cold email templates, follow-up sequences, LinkedIn messages, and proposal frameworks for freelancers and agencies.', creator: 'OutreachPro', rating: '4.9', reviews: '2,103', price: '$29', prompts: '75 prompts' },
  { model: 'Claude', category: 'Writing', title: 'Fiction & Storytelling Pack', desc: 'Character development, world-building, plot structuring, and scene-writing prompts for novelists, screenwriters, and content creators.', creator: 'NarrativeAI', rating: '4.7', reviews: '389', price: '$22', prompts: '110 prompts' },
  { model: 'Multiple', category: 'Education', title: 'Course Creator Toolkit', desc: 'End-to-end prompts for building online courses: curriculum design, lesson scripts, quiz creation, marketing copy, and sales pages.', creator: 'CourseBuilder AI', rating: '4.8', reviews: '756', price: '$44', prompts: '95 prompts' },
]

const MODEL_COLORS: Record<string, string> = {
  ChatGPT: 'bg-emerald-100 text-emerald-700',
  Midjourney: 'bg-violet-100 text-violet-700',
  Claude: 'bg-amber-100 text-amber-700',
  Multiple: 'bg-sky-100 text-sky-700',
}

export default function PromptsPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">AI Prompt Marketplace</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-violet-500/15 border border-violet-500/30 text-violet-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            Prompt Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            AI <span className="text-violet-400">Prompt</span> Marketplace
          </h1>
          <p className="text-slate-400 text-lg mb-10">
            Buy and sell the best AI prompts for ChatGPT, Claude, Midjourney, and every major AI model. Unlock outputs that actually convert.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#prompts" className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors no-underline">Browse Prompts</a>
            <a href="#sell" className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors border border-white/20 no-underline">Sell Your Prompts</a>
          </div>
          <div className="flex justify-center gap-8 mt-10 flex-wrap">
            {[['1,200+', 'Prompt Packs'], ['450+', 'Verified Creators'], ['All Models', 'ChatGPT, Claude, MJ & more']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold text-white">{val}</div>
                <div className="text-xs text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700 mr-1">AI Model:</span>
          {['All', 'ChatGPT', 'Claude', 'Midjourney', 'Gemini', 'Multiple'].map(f => (
            <button key={f} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${f === 'All' ? 'bg-violet-600 text-white border-violet-600' : 'border-slate-200 text-slate-600 hover:border-violet-400'}`}>{f}</button>
          ))}
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <span className="text-xs font-bold text-slate-700 mr-1">Category:</span>
          {['Copywriting', 'Content', 'Business', 'Marketing', 'Art & Design', 'Freelancing'].map(f => (
            <button key={f} className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 text-slate-600 hover:border-violet-400 transition-colors">{f}</button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10" id="prompts">
        {/* Featured */}
        <div className="mb-12">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">Featured Packs</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURED_PACKS.map(({ title, desc, price, prompts }) => (
              <div key={title} className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-violet-500/20 overflow-hidden">
                <span className="absolute top-4 right-4 bg-gradient-to-r from-violet-600 to-violet-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">FEATURED</span>
                <h3 className="text-base font-extrabold text-white mb-2 pr-20">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-violet-400">{price}</span>
                  <span className="text-xs text-slate-400">{prompts}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Packs */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900">All Prompt Packs</h2>
          <span className="text-sm text-slate-400">Showing {PROMPT_PACKS.length} packs</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROMPT_PACKS.map(({ model, category, title, desc, creator, rating, reviews, price, prompts }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl flex flex-col hover:border-violet-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${MODEL_COLORS[model] || 'bg-slate-100 text-slate-600'}`}>{model}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold text-slate-900">{price}</span>
                  <span className="text-xs text-slate-400 bg-violet-50 text-violet-600 font-semibold px-2 py-0.5 rounded">{prompts}</span>
                </div>
              </div>
              <div className="px-4 py-3 flex-1">
                <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-2">{category}</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-sky-500 flex items-center justify-center text-white text-xs font-bold">{creator[0]}</div>
                    <span className="text-xs font-semibold text-slate-700">{creator}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="text-amber-400">★</span> {rating} <span>({reviews})</span>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <button className="flex-1 bg-white border border-slate-200 hover:border-violet-400 text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors">Preview</button>
                <button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg text-xs transition-colors">Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sell Section */}
      <section id="sell" className="bg-gradient-to-br from-slate-900 to-sky-950 rounded-none py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">Sell Your Prompts</h2>
          <p className="text-slate-400 text-base mb-8">List your prompts on AICashMaker and start earning. Keep 80% of every sale. Thousands of buyers are looking for exactly what you've built.</p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[['1', 'Create Your Pack', 'Bundle your best prompts into a cohesive pack around a niche or use case.'], ['2', 'Submit & Get Approved', 'Submit your pack for review. Most are approved within 48 hours.'], ['3', 'Start Earning', 'Get paid automatically. Keep 80% of every sale via Stripe direct deposit.']].map(([num, title, desc]) => (
              <div key={num} className="bg-white/5 border border-white/10 rounded-xl p-5 text-left">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-black text-sm mb-3 mx-auto">{num}</div>
                <h4 className="text-white font-bold text-sm mb-1.5">{title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <Link href="/submit-product" className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors no-underline">
            Start Selling Your Prompts →
          </Link>
        </div>
      </section>
    </>
  )
}
