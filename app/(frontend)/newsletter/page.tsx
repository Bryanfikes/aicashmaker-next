'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'You\'re subscribed!')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">Newsletter</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-sky-950 to-emerald-950 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            Every Tuesday
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            The AI Income <span className="text-emerald-400">Weekly</span>
          </h1>
          <p className="text-sky-200 text-lg mb-10 max-w-xl mx-auto">
            Join 12,000+ subscribers getting the best AI money-making tips, tool reviews, exclusive deals, and real case studies — every single week.
          </p>
          {status === 'success' ? (
            <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl px-6 py-4 text-emerald-300 font-semibold text-base">
              🎉 {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/50 text-sm focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors whitespace-nowrap disabled:opacity-60"
              >
                {status === 'loading' ? '...' : 'Subscribe Free'}
              </button>
            </form>
          )}
          {status === 'error' && <p className="mt-3 text-red-400 text-sm">{message}</p>}
          <p className="mt-4 text-white/40 text-xs">No spam. Unsubscribe anytime.</p>
          <div className="mt-5 text-white/60 text-sm">
            Joined by <span className="text-white font-extrabold">12,000+</span> AI income earners
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-10">What You Get Every Week</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: '🔧', title: 'Tool Reviews', desc: 'Honest reviews of 1–2 new AI tools, with a focus on income potential, pricing, and who they\'re best for.' },
            { icon: '💡', title: 'Side Hustle Ideas', desc: 'One detailed, actionable AI side hustle idea with step-by-step instructions and realistic income projections.' },
            { icon: '🏷️', title: 'Exclusive Deals', desc: 'Subscriber-only discounts, lifetime deals, and early access to AI tools — often not available anywhere else.' },
            { icon: '📊', title: 'Real Case Studies', desc: 'Monthly deep dives into real people making real money with AI. Actual income numbers, real strategies.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:border-sky-300 hover:shadow-md transition-all">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Join These Subscribers</h2>
          <p className="text-slate-500 mb-10">Hear from people already using what they learn in the newsletter.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { initials: 'TK', name: 'Tyler K.', role: 'Freelance content creator', gradient: 'from-sky-400 to-indigo-500', quote: 'Last month\'s issue about AI prompt packs gave me the idea to create my own. I made $1,200 in the first 30 days.' },
              { initials: 'RP', name: 'Rachel P.', role: 'Digital marketing consultant', gradient: 'from-emerald-400 to-sky-400', quote: 'The only AI newsletter that gives you truly actionable steps. Not vague fluff — real tactics. I\'ve applied at least 3 strategies from it this year.' },
              { initials: 'MJ', name: 'Marcus J.', role: 'AI agency owner', gradient: 'from-amber-400 to-red-400', quote: 'The exclusive deals alone are worth it. I saved over $400 on AI tool subscriptions through deals I found in this newsletter.' },
            ].map(({ initials, name, role, gradient, quote }) => (
              <div key={name} className="bg-white border border-slate-200 rounded-2xl p-6 text-left">
                <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                <blockquote className="text-sm text-slate-600 italic leading-relaxed mb-4">"{quote}"</blockquote>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{name}</div>
                    <div className="text-xs text-slate-400">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Sign-up Form */}
      <section className="max-w-lg mx-auto px-4 py-16">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-2">Subscribe to the AI Income Weekly</h2>
        <p className="text-slate-500 text-center text-sm mb-8">Free forever. No spam. Just the best AI money-making content, every Tuesday.</p>
        {status === 'success' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">🎉</div>
            <h3 className="font-extrabold text-emerald-800 text-lg mb-2">You're in!</h3>
            <p className="text-emerald-700 text-sm">{message}</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">First name</label>
                  <input
                    type="text"
                    placeholder="Alex"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email address *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
              {status === 'error' && <p className="text-red-500 text-xs">{message}</p>}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe — It\'s Free'}
              </button>
              <p className="text-center text-xs text-slate-400">Join 12,000+ subscribers. Unsubscribe any time with one click.</p>
            </form>
          </div>
        )}
      </section>

      {/* Recent Issues */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-2">Recent Issues</h2>
        <p className="text-slate-500 text-center text-sm mb-8">A look at what subscribers received in the last three weeks.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              num: 'Issue #142 — March 18, 2025',
              title: 'The $3K Prompt Pack Blueprint + 5 New AI Tools Worth Trying',
              items: ['How to build and price a prompt pack for $29–$99', 'Best platforms to sell prompts in 2025', 'Tool spotlight: Perplexity Pro for research', 'Exclusive deal: 40% off a top writing AI tool', 'Case study: $3,200 month from prompt packs'],
              time: '8 min read',
            },
            {
              num: 'Issue #141 — March 11, 2025',
              title: 'Start an AI Social Media Agency in 30 Days — The Full System',
              items: ['How to price social media AI services', 'Scripts for landing your first 3 clients', 'Tools that do 80% of the work for you', 'New: AI video tools compared side-by-side', 'Reader win: $5K first month with zero ads'],
              time: '10 min read',
            },
            {
              num: 'Issue #140 — March 4, 2025',
              title: 'AI SEO Side Hustle: $8K/Month Ranking Client Sites with AI Tools',
              items: ['The 4-tool AI SEO stack that gets results', 'How to find and pitch local business clients', 'Pricing your AI SEO packages ($500–$3,000/mo)', 'Case study: SEO agency from 0 to $8K/month', 'Deal alert: Lifetime access to an AI SEO tool'],
              time: '11 min read',
            },
          ].map(({ num, title, items, time }) => (
            <div key={num} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5">
                <div className="text-xs text-white/40 font-semibold mb-2">{num}</div>
                <h3 className="text-sm font-bold text-white leading-snug">{title}</h3>
              </div>
              <ul className="list-none m-0 p-4 space-y-2">
                {items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-sky-500 flex-shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="px-4 pb-4 flex justify-between items-center text-xs text-slate-400">
                <span>{time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advertise CTA */}
      <section className="bg-amber-50 border-t border-amber-200 py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-extrabold text-slate-900 mb-3">Advertise in the AI Income Weekly</h2>
          <p className="text-slate-600 text-sm mb-6 max-w-lg mx-auto">
            Reach 12,000+ AI-focused entrepreneurs, freelancers, and side hustlers who are actively looking for tools and services to buy.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-6">
            {[['12,000+', 'Active subscribers'], ['42%', 'Avg open rate'], ['8.3%', 'Avg click rate']].map(([num, label]) => (
              <div key={label} className="bg-white border border-amber-200 rounded-xl p-3">
                <div className="text-lg font-extrabold text-amber-600">{num}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
          <Link href="/advertise" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors no-underline">
            Request Media Kit →
          </Link>
        </div>
      </section>
    </>
  )
}
