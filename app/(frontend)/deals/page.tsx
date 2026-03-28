import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Tool Deals & Lifetime Offers — Save Big on AI Software',
  description: 'Best AI tool deals, lifetime offers, and discounts. Save hundreds on AI writing, image, video, SEO, and automation tools.',
}

const DEALS = [
  { icon: '📈', gradient: 'from-sky-500 to-sky-700', badge: 'ANNUAL DEAL', title: 'Surfer SEO — Annual Plan', desc: 'AI content optimization tool used by 17,000+ teams to rank content on Google. Annual billing saves 41% vs monthly.', features: ['Content optimizer', 'Keyword research', 'SERP analyzer', 'AI outline generator'], original: '$588/yr', price: '$348/yr', savings: 'Save 41%', slug: 'surfer-seo' },
  { icon: '🎙️', gradient: 'from-sky-400 to-sky-500', badge: 'ANNUAL DEAL', title: 'ElevenLabs Creator — Annual', desc: 'World\'s most realistic AI voice generation platform. Annual billing saves $132/year. Includes voice cloning and commercial use.', features: ['100,000 chars/month', 'Voice cloning', '29 languages', 'Commercial license'], original: '$33/mo', price: '$22/mo', savings: 'Save 33%', slug: 'elevenlabs' },
  { icon: '✍️', gradient: 'from-amber-400 to-amber-600', badge: 'ANNUAL DEAL', title: 'Jasper AI — Annual Plan', desc: 'Top AI writing platform for marketing teams. Annual plan saves 20% vs monthly. Includes brand voice, 80+ templates, and SEO mode.', features: ['Unlimited words', '50+ templates', 'Brand voice', 'SEO integration'], original: '$468/yr', price: '$374/yr', savings: 'Save 20%', slug: 'jasper-ai' },
  { icon: '🎨', gradient: 'from-violet-600 to-violet-800', badge: 'ANNUAL DEAL', title: 'Midjourney — Annual Billing', desc: 'Save $36/year on the world\'s best AI image generator. The Standard plan includes unlimited relaxed generations and 15 fast hours.', features: ['Unlimited relaxed mode', '15 fast GPU hours', 'Commercial license', 'All V6 features'], original: '$30/mo', price: '$24/mo', savings: 'Save 20%', slug: 'midjourney' },
  { icon: '🖥️', gradient: 'from-indigo-500 to-indigo-700', badge: 'LIFETIME DEAL', title: 'Beautiful.ai — Lifetime', desc: 'AI presentation builder that designs stunning slides automatically. Pay once for lifetime access to all features and templates.', features: ['Unlimited presentations', 'Smart templates', 'Team sharing', 'Export to PDF/PowerPoint'], original: '$144/yr', price: '$97', savings: 'Save 67%', slug: 'beautiful-ai' },
  { icon: '🎞️', gradient: 'from-purple-500 to-purple-700', badge: 'ANNUAL DEAL', title: 'Pictory — Annual Plan', desc: 'Turn blog posts and scripts into engaging videos automatically. Annual plan saves 50% vs monthly billing.', features: ['30 video projects/month', 'Auto-captions', 'Brand kit', 'Team access'], original: '$228/yr', price: '$114/yr', savings: 'Save 50%', slug: 'pictory' },
  { icon: '📝', gradient: 'from-pink-500 to-pink-700', badge: 'FREE FOREVER', title: 'Copy.ai — Free Plan', desc: '90+ AI copywriting templates with a generous free tier — 2,000 words/month, no credit card required. Best free AI writing tool.', features: ['2,000 words/month free', '90+ templates', 'Chat with AI', 'No credit card needed'], original: null, price: 'FREE', savings: '$0 cost', slug: 'copy-ai' },
  { icon: '🎭', gradient: 'from-teal-500 to-teal-700', badge: 'ANNUAL DEAL', title: 'HeyGen — Annual Creator', desc: 'Create professional AI avatar videos for marketing and social. Annual plan saves $120/year vs monthly billing.', features: ['15 minutes video/month', 'Realistic AI avatars', '40+ languages', 'Voice cloning'], original: '$29/mo', price: '$19/mo', savings: 'Save 34%', slug: 'heygen' },
  { icon: '📋', gradient: 'from-slate-600 to-slate-800', badge: 'ANNUAL DEAL', title: 'Notion AI — Annual Plan', desc: 'AI workspace for notes, docs, and project management. Annual billing saves $48/year per user. Best productivity tool for solopreneurs.', features: ['Unlimited AI usage', 'Notes, docs, databases', 'AI Q&A and summaries', 'Team collaboration'], original: '$16/mo', price: '$12/mo', savings: 'Save 25%', slug: 'notion-ai' },
]

export default function DealsPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">AI Deals</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center gap-3 mb-5">
            <span className="bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-bold">🔥 New Deals Weekly</span>
            <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">⭐ Editor's Picks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">AI Tool Deals & Lifetime Offers</h1>
          <p className="text-slate-400 text-base">Save hundreds — sometimes thousands — on the best AI tools. Lifetime deals, annual discounts, and exclusive offers updated weekly.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Deal of the Week */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-10">
          <div className="inline-block bg-amber-500 text-white text-xs font-extrabold px-3 py-1 rounded-full mb-4">🏆 Deal of the Week</div>
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">Writesonic — Lifetime Access</h2>
              <p className="text-slate-600 text-sm mb-4">Unlimited AI writing credits, 100+ templates, SEO optimizer, and AI chatbot. One payment, use forever. Perfect for freelancers and agency owners.</p>
              <ul className="grid sm:grid-cols-2 gap-1.5">
                {['Unlimited GPT-4 words', '100+ writing templates', 'AI article writer (5,000 words)', 'Chatsonic AI chatbot', 'Botsonic (custom AI chatbot builder)'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700"><span className="text-emerald-500">✅</span>{f}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center gap-3 min-w-[180px]">
              <div className="text-center">
                <div className="text-sm text-slate-400 line-through mb-1">$468/year</div>
                <div className="text-4xl font-black text-slate-900">$99</div>
                <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mt-1">Save 79%</div>
              </div>
              <Link href="/tools/writesonic" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-5 rounded-xl text-sm text-center transition-colors no-underline block">
                Get This Deal →
              </Link>
              <p className="text-xs text-slate-400">⚡ Limited availability</p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {['All Deals', 'Lifetime Deals', 'Annual Discounts', 'Free Trials', 'AI Writing', 'AI Video', 'AI SEO'].map((f, i) => (
            <button key={f} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${i === 0 ? 'bg-sky-500 text-white border-sky-500' : 'border-slate-200 text-slate-600 hover:border-sky-400'}`}>{f}</button>
          ))}
        </div>

        {/* Deals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {DEALS.map(({ icon, gradient, badge, title, desc, features, original, price, savings, slug }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-sky-200 transition-all flex flex-col">
              <div className="p-4 flex items-center justify-between border-b border-slate-100">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-lg`}>{icon}</div>
                <span className="text-xs font-extrabold text-slate-500 tracking-wide">{badge}</span>
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-extrabold text-slate-900 text-sm mb-2">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{desc}</p>
                <ul className="space-y-1 mb-4">
                  {features.map(f => <li key={f} className="flex items-center gap-2 text-xs text-slate-600"><span className="text-emerald-500">✅</span>{f}</li>)}
                </ul>
                <div className="flex items-center justify-between">
                  <div>
                    {original && <div className="text-xs text-slate-400 line-through">{original}</div>}
                    <div className="text-lg font-extrabold text-slate-900">{price}</div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">{savings}</span>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link href={`/tools/${slug}`} className="block w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl text-xs text-center transition-colors no-underline">
                  Get Deal →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Deal CTA */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-extrabold text-slate-900 mb-2">Have an AI tool deal to share?</h3>
          <p className="text-slate-500 text-sm mb-5">Submit your deal to be featured on AICashMaker and reach 10,000+ monthly visitors.</p>
          <Link href="/submit-tool" className="inline-block border border-slate-300 hover:border-sky-400 text-slate-700 hover:text-sky-600 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors no-underline">
            Submit a Deal →
          </Link>
        </div>
      </div>

      {/* Newsletter */}
      <section className="bg-sky-50 border-t border-sky-100 py-14 px-4">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Get Deals in Your Inbox</h2>
            <p className="text-slate-500 text-sm">We curate the best AI tool deals weekly and send them straight to you. Never pay full price again.</p>
          </div>
          <div className="w-full md:w-auto">
            <form className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 w-64" />
              <Link href="/newsletter" className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors no-underline whitespace-nowrap">
                Get Weekly Deals →
              </Link>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
