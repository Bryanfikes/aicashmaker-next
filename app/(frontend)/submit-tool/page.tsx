'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SubmitToolPage() {
  const [form, setForm] = useState({
    toolName: '', toolUrl: '', affiliateLink: '', category: '', pricingModel: '',
    startingPrice: '', shortDesc: '', fullDesc: '', whoFor: '', howMoney: '',
    tags: '', logoUrl: '', videoUrl: '', creatorName: '', creatorEmail: '',
    featuredUpgrade: false, termsAgreed: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.termsAgreed) { setStatus('error'); setMessage('Please agree to the Terms of Service.'); return }
    setStatus('loading')
    try {
      const res = await fetch('/api/submit/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.toolName, url: form.toolUrl, affiliateLink: form.affiliateLink,
          category: form.category, pricingModel: form.pricingModel, price: form.startingPrice,
          tagline: form.shortDesc, description: form.fullDesc, whoFor: form.whoFor,
          howMoney: form.howMoney, tags: form.tags, logoUrl: form.logoUrl,
          videoUrl: form.videoUrl, submitterName: form.creatorName, submitterEmail: form.creatorEmail,
          featuredRequested: form.featuredUpgrade,
        }),
      })
      const data = await res.json()
      if (res.ok) { setStatus('success'); setMessage(data.message || 'Submitted! We\'ll review within 48 hours.') }
      else { setStatus('error'); setMessage(data.error || 'Submission failed.') }
    } catch {
      setStatus('error'); setMessage('Network error. Please try again.')
    }
  }

  const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
  const labelCls = 'block text-xs font-semibold text-slate-700 mb-1.5'

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">Submit a Tool</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-sky-950 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Submit Your AI Tool</h1>
          <p className="text-sky-200 text-base">
            Get listed in front of 10,000+ monthly visitors actively searching for AI tools to make money and grow their businesses.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-extrabold text-slate-900 text-center mb-8">Why Submit Your Tool?</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: '🆓', title: 'Free Basic Listing', desc: 'Submit at no cost. Basic listings include your tool name, description, link, category, and pricing — live within 48 hours of approval.' },
            { icon: '⭐', title: 'Featured Upgrade Available', desc: 'Upgrade to a featured listing for $199/month to appear at the top of your category, get a highlighted badge, and be featured in our newsletter.' },
            { icon: '🎯', title: 'Reach Ready Buyers', desc: 'Our audience is actively looking to buy and use AI tools. Decision-makers, freelancers, and entrepreneurs — not casual browsers.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-bold text-slate-900 text-sm mb-2">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        {status === 'success' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-extrabold text-emerald-800 mb-2">Tool Submitted!</h2>
            <p className="text-emerald-700 text-sm">{message}</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Tool Submission Form</h2>
            <p className="text-slate-500 text-sm mb-6">Fill in as much detail as possible. Complete submissions are reviewed and listed faster.</p>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="text-xs font-bold uppercase tracking-widest text-sky-600 pb-3 border-b border-slate-100">Basic Tool Information</div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Tool Name *</label><input type="text" required placeholder="e.g. Jasper AI" value={form.toolName} onChange={e => set('toolName', e.target.value)} className={inputCls} /></div>
                  <div><label className={labelCls}>Tool URL *</label><input type="url" required placeholder="https://example.com" value={form.toolUrl} onChange={e => set('toolUrl', e.target.value)} className={inputCls} /></div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Your Affiliate Link <span className="text-slate-400 font-normal">(optional)</span></label><input type="url" placeholder="https://example.com?ref=yourid" value={form.affiliateLink} onChange={e => set('affiliateLink', e.target.value)} className={inputCls} /><p className="text-xs text-slate-400 mt-1">We'll use your affiliate link when linking to this tool.</p></div>
                  <div>
                    <label className={labelCls}>Category *</label>
                    <select required value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                      <option value="">— Select a Category —</option>
                      {['AI Writing Tools','AI Image Tools','AI Video Tools','AI Voice Tools','AI Marketing Tools','AI SEO Tools','AI Automation Tools','AI Sales Tools','AI Chatbots','AI Coding Tools','AI Design Tools','AI Productivity Tools','AI Business Tools','AI Freelance Tools','AI Ecommerce Tools','AI Lead Generation Tools','AI Social Media Tools'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Pricing Model *</label>
                    <select required value={form.pricingModel} onChange={e => set('pricingModel', e.target.value)} className={inputCls}>
                      <option value="">— Select Pricing —</option>
                      {['Free','Freemium','Paid','Subscription'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div><label className={labelCls}>Starting Price</label><input type="text" placeholder="e.g. Free / $29/mo / $299/yr" value={form.startingPrice} onChange={e => set('startingPrice', e.target.value)} className={inputCls} /></div>
                </div>

                <div className="text-xs font-bold uppercase tracking-widest text-sky-600 pb-3 border-b border-slate-100 pt-2">Descriptions</div>

                <div>
                  <label className={labelCls}>Short Description * <span className="text-slate-400 font-normal">(max 150 chars)</span></label>
                  <textarea required maxLength={150} placeholder="A brief one-sentence description of what this tool does." value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} className={`${inputCls} resize-none`} rows={2} />
                  <div className="text-right text-xs text-slate-400">{form.shortDesc.length}/150</div>
                </div>

                <div>
                  <label className={labelCls}>Full Description * <span className="text-slate-400 font-normal">(max 500 chars)</span></label>
                  <textarea required maxLength={500} placeholder="Describe the tool in detail — what it does, why it's useful, and what makes it stand out." value={form.fullDesc} onChange={e => set('fullDesc', e.target.value)} className={`${inputCls} resize-none`} rows={4} />
                  <div className="text-right text-xs text-slate-400">{form.fullDesc.length}/500</div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Who It's For</label><textarea rows={3} placeholder="e.g. Freelance writers, content agencies, marketing teams..." value={form.whoFor} onChange={e => set('whoFor', e.target.value)} className={`${inputCls} resize-none`} /></div>
                  <div><label className={labelCls}>How It Makes You Money</label><textarea rows={3} placeholder="e.g. Write client content 5x faster, sell as an agency service..." value={form.howMoney} onChange={e => set('howMoney', e.target.value)} className={`${inputCls} resize-none`} /></div>
                </div>

                <div><label className={labelCls}>Tags <span className="text-slate-400 font-normal">(comma separated, up to 8)</span></label><input type="text" placeholder="e.g. writing, seo, content, chatgpt, automation" value={form.tags} onChange={e => set('tags', e.target.value)} className={inputCls} /></div>

                <div className="text-xs font-bold uppercase tracking-widest text-sky-600 pb-3 border-b border-slate-100 pt-2">Media</div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Logo URL <span className="text-slate-400 font-normal">(optional)</span></label><input type="url" placeholder="https://yoursite.com/logo.png" value={form.logoUrl} onChange={e => set('logoUrl', e.target.value)} className={inputCls} /></div>
                  <div><label className={labelCls}>Demo Video URL <span className="text-slate-400 font-normal">(optional)</span></label><input type="url" placeholder="https://youtube.com/watch?v=..." value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} className={inputCls} /></div>
                </div>

                <div className="text-xs font-bold uppercase tracking-widest text-sky-600 pb-3 border-b border-slate-100 pt-2">Your Information</div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Your Name *</label><input type="text" required placeholder="Jane Smith" value={form.creatorName} onChange={e => set('creatorName', e.target.value)} className={inputCls} /></div>
                  <div><label className={labelCls}>Your Email *</label><input type="email" required placeholder="jane@example.com" value={form.creatorEmail} onChange={e => set('creatorEmail', e.target.value)} className={inputCls} /><p className="text-xs text-slate-400 mt-1">Not displayed publicly.</p></div>
                </div>

                <div className="text-xs font-bold uppercase tracking-widest text-sky-600 pb-3 border-b border-slate-100 pt-2">Listing Options</div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <span className="inline-block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">Recommended</span>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Featured Listing — $199/month</h4>
                  <p className="text-xs text-slate-600">Featured listings appear at the top of category pages, are highlighted with a badge, included in weekly newsletter shoutouts, and receive 3–5x more clicks than basic listings.</p>
                </div>

                <label className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 cursor-pointer">
                  <input type="checkbox" checked={form.featuredUpgrade} onChange={e => set('featuredUpgrade', e.target.checked)} className="mt-0.5 flex-shrink-0 accent-sky-500" />
                  <span className="text-sm text-slate-700">Yes, I want a Featured Listing for $199/month. I understand I'll be contacted after submission to complete payment.</span>
                </label>

                <label className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 cursor-pointer">
                  <input type="checkbox" required checked={form.termsAgreed} onChange={e => set('termsAgreed', e.target.checked)} className="mt-0.5 flex-shrink-0 accent-sky-500" />
                  <span className="text-sm text-slate-700">I confirm that I own or have authorization to list this tool, and I agree to the <Link href="/terms" className="text-sky-500 underline">Terms of Service</Link>.</span>
                </label>

                {status === 'error' && <p className="text-red-500 text-sm">{message}</p>}

                <button type="submit" disabled={status === 'loading'} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60">
                  {status === 'loading' ? 'Submitting...' : 'Submit Your AI Tool'}
                </button>

                <div className="bg-slate-50 border-l-4 border-emerald-400 rounded-r-xl p-4 text-sm text-slate-600">
                  <strong className="text-slate-900">What happens next:</strong> Our team reviews all submissions within <strong>48 hours</strong>. You'll receive an email confirmation once your listing is live.
                </div>
              </form>
            </div>
          </>
        )}
      </section>
    </>
  )
}
