import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About AICashMaker — The #1 Resource for Making Money with AI',
  description: 'AICashMaker is the leading resource for entrepreneurs and freelancers who want to make money using AI tools, automations, and side hustles.',
}

export default function AboutPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">About</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-sky-500/15 border border-sky-500/30 text-sky-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            The #1 Resource for Making Money with AI
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            AICashMaker was built for one reason: to help real people turn AI tools into real income. No hype. No theory. Just practical strategies that work.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Why We Built This</h2>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                When AI tools exploded in 2022–2023, most resources were either too technical ("here's how transformers work") or too vague ("AI will change everything!"). What was missing was a practical answer to the question everyone was actually asking:
              </p>
              <p className="font-semibold text-slate-900 text-base border-l-4 border-sky-500 pl-4">
                "How do I actually make money with this stuff?"
              </p>
              <p>
                AICashMaker was built to answer that question directly. We test tools, interview real earners, document working strategies, and cut through the noise to deliver only what's actionable.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: '170+', label: 'AI Tools Reviewed' },
              { num: '60+', label: 'Side Hustle Guides' },
              { num: '12,000+', label: 'Newsletter Subscribers' },
              { num: '10K+', label: 'Monthly Visitors' },
            ].map(({ num, label }) => (
              <div key={label} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                <div className="text-3xl font-extrabold text-sky-600 mb-1">{num}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="bg-slate-50 border-y border-slate-200 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-10">What AICashMaker Covers</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🛠️', title: 'AI Tool Reviews', desc: 'Honest, income-focused reviews of the best AI tools. We answer: is it worth the money, and can you make money with it?' },
              { icon: '💡', title: 'Side Hustle Guides', desc: 'Step-by-step blueprints for AI side hustles — from prompt selling to AI agency services to content creation.' },
              { icon: '🤖', title: 'Automation Templates', desc: 'Ready-to-deploy Make.com, Zapier, and n8n workflows that eliminate manual work and scale your output.' },
              { icon: '📝', title: 'Prompt Marketplace', desc: 'A curated marketplace for buying and selling the best AI prompts for ChatGPT, Claude, Midjourney, and more.' },
              { icon: '🏷️', title: 'Deals & Discounts', desc: 'The best lifetime deals, annual discounts, and exclusive offers on AI tools — updated weekly.' },
              { icon: '📬', title: 'Weekly Newsletter', desc: 'The AI Income Weekly — practical AI money-making content delivered to 12,000+ subscribers every Tuesday.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Standards */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6 text-center">Editorial Standards</h2>
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Independence</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Our editorial team reviews tools independently. A tool being listed on AICashMaker does not guarantee a positive review. We only recommend tools we believe provide genuine value.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Affiliate Disclosure</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Some links on AICashMaker are affiliate links. If you purchase through these links, we may earn a commission at no extra cost to you. This helps support the site and keep our content free. See our full <Link href="/affiliate-disclosure" className="text-sky-500 underline">Affiliate Disclosure</Link>.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Accuracy</h3>
            <p className="text-sm text-slate-600 leading-relaxed">We strive to keep all pricing, features, and tool information up to date. AI tools change rapidly. If you notice outdated information, please <Link href="/contact" className="text-sky-500 underline">contact us</Link>.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-slate-900 to-sky-950 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white mb-4">Start Making Money with AI Today</h2>
          <p className="text-slate-300 text-base mb-8">Browse 170+ AI tools, 60+ side hustle guides, and the best deals in the industry.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/tools" className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors no-underline">Browse AI Tools</Link>
            <Link href="/newsletter" className="border border-white/30 text-white hover:bg-white/10 font-bold px-6 py-3 rounded-xl text-sm transition-colors no-underline">Get the Newsletter</Link>
          </div>
        </div>
      </section>
    </>
  )
}
