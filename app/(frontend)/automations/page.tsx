import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Automation Templates & Workflows',
  description: 'Browse ready-to-deploy AI automation templates for Make.com, Zapier, n8n, and more. Import once, save hundreds of hours every month.',
}

const AUTOMATIONS = [
  { platform: 'Make.com', platformColor: 'bg-violet-100 text-violet-700', complexity: 'Intermediate', complexityColor: 'bg-amber-100 text-amber-700', title: 'AI Lead Generation Bot', category: 'Lead Gen', desc: 'Automatically scrapes qualified leads from LinkedIn and websites, enriches data with Apollo.io, and delivers personalized cold emails via Gmail — all on autopilot 24/7.', features: ['Scrapes and qualifies 50-200 leads per day from LinkedIn', 'Enriches lead data with verified email addresses', 'Generates personalized outreach emails with ChatGPT'], price: '$49' },
  { platform: 'n8n', platformColor: 'bg-amber-100 text-amber-700', complexity: 'Beginner', complexityColor: 'bg-emerald-100 text-emerald-700', title: 'Blog Content Pipeline', category: 'Content', desc: 'A fully automated content production pipeline that takes a keyword list and outputs SEO-optimized, published blog posts — complete with images, meta tags, and internal links.', features: ['Generates content briefs from target keywords via Surfer SEO', 'Writes full articles using Claude or ChatGPT API', 'Publishes directly to WordPress with featured images'], price: '$39' },
  { platform: 'Make.com', platformColor: 'bg-violet-100 text-violet-700', complexity: 'Beginner', complexityColor: 'bg-emerald-100 text-emerald-700', title: 'Social Media Autopilot', category: 'Social Media', desc: 'Auto-generates and schedules a week\'s worth of social content across Instagram, LinkedIn, X, and Facebook from a single topic brief. Includes Canva image generation via API.', features: ['Creates platform-optimized captions for 4 networks at once', 'Generates on-brand visual assets using Canva API', 'Schedules posts at optimal engagement times via Buffer'], price: '$29' },
  { platform: 'Zapier', platformColor: 'bg-red-100 text-red-700', complexity: 'Beginner', complexityColor: 'bg-emerald-100 text-emerald-700', title: 'Email Follow-up Sequence', category: 'Sales', desc: 'Triggers a 5-step AI-personalized email follow-up sequence whenever a lead fills out a form, books a call, or downloads a lead magnet — dramatically increasing conversion rates.', features: ['Detects new leads from Typeform, Calendly, or HubSpot', 'Personalizes each email with ChatGPT based on lead data', 'Sends 5-email sequence via ActiveCampaign or Klaviyo'], price: '$19' },
  { platform: 'Make.com', platformColor: 'bg-violet-100 text-violet-700', complexity: 'Beginner', complexityColor: 'bg-emerald-100 text-emerald-700', title: 'AI Product Description Generator', category: 'E-commerce', desc: 'Reads product titles and images from a Shopify or WooCommerce store and auto-generates compelling, SEO-friendly product descriptions using GPT-4. Handles 100+ products per hour.', features: ['Pulls product data from your e-commerce store via API', 'Generates unique, keyword-rich product descriptions', 'Pushes descriptions back to your store automatically'], price: '$29' },
  { platform: 'n8n', platformColor: 'bg-amber-100 text-amber-700', complexity: 'Intermediate', complexityColor: 'bg-amber-100 text-amber-700', title: 'YouTube SEO Optimizer', category: 'Content', desc: 'Automatically generates optimized YouTube titles, descriptions, tags, and chapter markers for every new video upload. Pulls keyword data from TubeBuddy and VidIQ APIs.', features: ['Triggers on new YouTube upload via YouTube Data API', 'Generates A/B title variants with click-rate predictions', 'Auto-populates description, timestamps, and keyword tags'], price: '$39' },
  { platform: 'Zapier', platformColor: 'bg-red-100 text-red-700', complexity: 'Beginner', complexityColor: 'bg-emerald-100 text-emerald-700', title: 'AI Review Responder', category: 'Marketing', desc: 'Monitors Google, Yelp, and Trustpilot for new reviews and auto-generates personalized, on-brand responses within minutes. Never miss a review again — positive or negative.', features: ['Monitors review platforms in real-time for new submissions', 'Analyzes sentiment and crafts appropriate responses via AI', 'Posts approved responses or sends for human review first'], price: '$19' },
  { platform: 'Make.com', platformColor: 'bg-violet-100 text-violet-700', complexity: 'Advanced', complexityColor: 'bg-red-100 text-red-700', title: 'Lead Scoring System', category: 'Sales', desc: 'Automatically scores and prioritizes inbound leads using AI analysis of firmographic data, behavior patterns, and engagement signals — routing hot leads directly to your sales team.', features: ['Aggregates lead data from CRM, email, and website analytics', 'Scores leads 1-100 using customizable AI criteria', 'Routes hot leads to Slack, SMS, or CRM with full context'], price: '$99' },
  { platform: 'n8n', platformColor: 'bg-amber-100 text-amber-700', complexity: 'Intermediate', complexityColor: 'bg-amber-100 text-amber-700', title: 'Content Repurposing Machine', category: 'Content', desc: 'Takes any long-form content (blogs, podcasts, videos) and automatically repurposes it into 8+ formats — social posts, email newsletters, Twitter threads, short clips, and more.', features: ['Ingests content via URL, RSS feed, or file upload', 'Extracts key insights and creates 8 derivative content pieces', 'Distributes each format to the appropriate platform automatically'], price: '$59' },
  { platform: 'Zapier', platformColor: 'bg-red-100 text-red-700', complexity: 'Beginner', complexityColor: 'bg-emerald-100 text-emerald-700', title: 'AI Newsletter Generator', category: 'Marketing', desc: 'Automatically curates the best content from your RSS feeds, industry news, and social channels and compiles it into a polished, branded newsletter ready to send every week.', features: ['Pulls and summarizes top content from 10+ sources weekly', 'Formats content into a ready-to-send newsletter template', 'Sends draft to ConvertKit, Mailchimp, or Beehiiv for review'], price: '$29' },
  { platform: 'Make.com', platformColor: 'bg-violet-100 text-violet-700', complexity: 'Intermediate', complexityColor: 'bg-amber-100 text-amber-700', title: 'Shopify Product Optimizer', category: 'E-commerce', desc: 'Monitors Shopify product performance metrics and automatically A/B tests product titles, descriptions, and images — optimizing for conversion rate and SEO rankings simultaneously.', features: ['Analyzes product conversion data and identifies underperformers', 'Generates 3 variant titles and descriptions for A/B testing', 'Implements winners and reports results to a Notion dashboard'], price: '$79' },
  { platform: 'n8n', platformColor: 'bg-amber-100 text-amber-700', complexity: 'Advanced', complexityColor: 'bg-red-100 text-red-700', title: 'LinkedIn Outreach Bot', category: 'Lead Gen', desc: 'A sophisticated LinkedIn automation that identifies ideal prospects, sends hyper-personalized connection requests, and executes a 3-step follow-up sequence — all within LinkedIn\'s limits.', features: ['Identifies and qualifies prospects using custom ICP filters', 'Crafts personalized messages using LinkedIn profile data + AI', 'Manages multi-touch follow-up sequences with reply detection'], price: '$149' },
]

export default function AutomationsPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">AI Automations</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 py-20 px-4 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative">
          <div className="inline-block bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            Automation Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            AI <span className="text-emerald-400">Automation</span> Marketplace
          </h1>
          <p className="text-slate-400 text-lg mb-10">
            Ready-to-deploy automations for Make.com, Zapier, n8n, and more. Import once, save hundreds of hours every month.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-10">
            <a href="#automations" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors no-underline">Browse Automations</a>
            <Link href="/submit-product" className="border border-white/30 text-white hover:bg-white/10 font-bold px-6 py-3 rounded-xl text-sm transition-colors no-underline">Submit a Workflow</Link>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            {['Make.com', 'Zapier', 'n8n', 'Custom API', 'Airtable', 'Notion'].map(p => (
              <span key={p} className="bg-white/8 border border-white/12 rounded-lg px-4 py-2 text-xs font-bold text-slate-300">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700 mr-1">Platform:</span>
          {['All', 'Make.com', 'Zapier', 'n8n', 'Custom'].map((f, i) => (
            <button key={f} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${i === 0 ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-200 text-slate-600 hover:border-emerald-400'}`}>{f}</button>
          ))}
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <span className="text-xs font-bold text-slate-700 mr-1">Category:</span>
          {['Lead Gen', 'Content', 'Social', 'Sales', 'Marketing', 'E-commerce'].map(f => (
            <button key={f} className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 text-slate-600 hover:border-emerald-400 transition-colors">{f}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10" id="automations">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900">{AUTOMATIONS.length} AI Automation Templates</h2>
          <span className="text-sm text-slate-400">All templates include setup instructions</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AUTOMATIONS.map(({ platform, platformColor, complexity, complexityColor, title, category, desc, features, price }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${platformColor}`}>{platform}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${complexityColor}`}>{complexity}</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">{title}</h3>
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-2">{category}</span>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{desc}</p>
              <div className="mb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What It Does</h4>
                <ul className="space-y-1.5">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="text-emerald-500 font-bold flex-shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xl font-extrabold text-slate-900">{price}</span>
                  <span className="text-xs text-slate-400 ml-1">one-time</span>
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">
                  Get Automation →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit CTA */}
      <section className="bg-slate-50 border-t border-slate-200 py-14 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-extrabold text-slate-900 mb-3">Have an automation to sell?</h2>
          <p className="text-slate-500 text-sm mb-6">Submit your workflow template to AICashMaker and start earning. Keep 80% of every sale.</p>
          <Link href="/submit-product" className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors no-underline">
            Submit a Workflow →
          </Link>
        </div>
      </section>
    </>
  )
}
