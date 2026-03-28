'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SubmitProductPage() {
  const [form, setForm] = useState({
    productName: '', productType: '', platform: '', category: '',
    price: '', shortDesc: '', fullDesc: '', whatsIncluded: '',
    demoUrl: '', creatorName: '', creatorEmail: '', payoutEmail: '',
    termsAgreed: false,
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
      const res = await fetch('/api/submit/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
            <span className="text-slate-600">Submit a Product</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            Creator Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Sell Your AI Product</h1>
          <p className="text-slate-300 text-base">
            List your prompt packs, automation templates, courses, or templates. Keep 80% of every sale. Reach 10,000+ monthly buyers.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-extrabold text-slate-900 text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { step: '1', title: 'Submit Your Product', desc: 'Fill out the form below with your product details. Include a clear description, demo link, and pricing.' },
            { step: '2', title: 'Get Reviewed & Listed', desc: 'Our team reviews all submissions within 48 hours. Approved products are listed immediately in the marketplace.' },
            { step: '3', title: 'Start Earning', desc: 'Buyers purchase your product through Stripe checkout. You keep 80% — paid directly to your bank account.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-sm mb-4 mx-auto">{step}</div>
              <h3 className="font-bold text-slate-900 text-sm mb-2">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[['80%', 'Revenue share to you'], ['$0', 'Listing fee'], ['48hr', 'Review turnaround']].map(([num, label]) => (
            <div key={label} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-emerald-600">{num}</div>
              <div className="text-xs text-slate-600 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        {status === 'success' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-extrabold text-emerald-800 mb-2">Product Submitted!</h2>
            <p className="text-emerald-700 text-sm">{message}</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Product Submission Form</h2>
            <p className="text-slate-500 text-sm mb-6">Complete all required fields. More detail = faster approval.</p>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 pb-3 border-b border-slate-100">Product Details</div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Product Name *</label><input type="text" required placeholder="e.g. Ultimate ChatGPT Business Bundle" value={form.productName} onChange={e => set('productName', e.target.value)} className={inputCls} /></div>
                  <div>
                    <label className={labelCls}>Product Type *</label>
                    <select required value={form.productType} onChange={e => set('productType', e.target.value)} className={inputCls}>
                      <option value="">— Select Type —</option>
                      {['Prompt Pack', 'Automation Template', 'Course', 'Template', 'Ebook / Guide', 'Other'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Platform <span className="text-slate-400 font-normal">(if automation)</span></label>
                    <select value={form.platform} onChange={e => set('platform', e.target.value)} className={inputCls}>
                      <option value="">— Select Platform —</option>
                      {['Make.com', 'Zapier', 'n8n', 'ChatGPT', 'Claude', 'Midjourney', 'Multiple', 'N/A'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Category *</label>
                    <select required value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                      <option value="">— Select Category —</option>
                      {['Copywriting', 'Content', 'Business', 'Marketing', 'Lead Gen', 'Sales', 'E-commerce', 'Social Media', 'SEO', 'Productivity', 'Art & Design', 'Education', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Price (USD) *</label>
                  <input type="text" required placeholder="e.g. 29 or 49 or 97" value={form.price} onChange={e => set('price', e.target.value)} className={inputCls} />
                  <p className="text-xs text-slate-400 mt-1">Enter a number only. Minimum $9. You keep 80%.</p>
                </div>

                <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 pb-3 border-b border-slate-100 pt-2">Descriptions</div>

                <div>
                  <label className={labelCls}>Short Description * <span className="text-slate-400 font-normal">(max 150 chars)</span></label>
                  <textarea required maxLength={150} placeholder="A brief one-sentence description of what your product delivers." value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} className={`${inputCls} resize-none`} rows={2} />
                  <div className="text-right text-xs text-slate-400">{form.shortDesc.length}/150</div>
                </div>

                <div>
                  <label className={labelCls}>Full Description * <span className="text-slate-400 font-normal">(max 500 chars)</span></label>
                  <textarea required maxLength={500} placeholder="Describe your product in detail — what it includes, who it's for, and the results buyers can expect." value={form.fullDesc} onChange={e => set('fullDesc', e.target.value)} className={`${inputCls} resize-none`} rows={4} />
                  <div className="text-right text-xs text-slate-400">{form.fullDesc.length}/500</div>
                </div>

                <div>
                  <label className={labelCls}>What's Included</label>
                  <textarea rows={3} placeholder="e.g. 85 prompt templates, PDF guide, Notion dashboard, video walkthrough..." value={form.whatsIncluded} onChange={e => set('whatsIncluded', e.target.value)} className={`${inputCls} resize-none`} />
                </div>

                <div>
                  <label className={labelCls}>Demo / Preview URL <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input type="url" placeholder="https://youtube.com/watch?v=... or a preview page" value={form.demoUrl} onChange={e => set('demoUrl', e.target.value)} className={inputCls} />
                </div>

                <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 pb-3 border-b border-slate-100 pt-2">Creator Information</div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Your Name *</label><input type="text" required placeholder="Jane Smith" value={form.creatorName} onChange={e => set('creatorName', e.target.value)} className={inputCls} /></div>
                  <div><label className={labelCls}>Your Email *</label><input type="email" required placeholder="jane@example.com" value={form.creatorEmail} onChange={e => set('creatorEmail', e.target.value)} className={inputCls} /><p className="text-xs text-slate-400 mt-1">Not displayed publicly.</p></div>
                </div>

                <div>
                  <label className={labelCls}>Payout Email (PayPal or Stripe) *</label>
                  <input type="email" required placeholder="payments@example.com" value={form.payoutEmail} onChange={e => set('payoutEmail', e.target.value)} className={inputCls} />
                  <p className="text-xs text-slate-400 mt-1">We'll set up your Stripe Connect payout to this email after approval.</p>
                </div>

                <label className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 cursor-pointer">
                  <input type="checkbox" required checked={form.termsAgreed} onChange={e => set('termsAgreed', e.target.checked)} className="mt-0.5 flex-shrink-0 accent-sky-500" />
                  <span className="text-sm text-slate-700">I confirm I own this product and have the right to sell it. I agree to the <Link href="/terms" className="text-sky-500 underline">Terms of Service</Link> and the 80/20 revenue split.</span>
                </label>

                {status === 'error' && <p className="text-red-500 text-sm">{message}</p>}

                <button type="submit" disabled={status === 'loading'} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60">
                  {status === 'loading' ? 'Submitting...' : 'Submit Your Product'}
                </button>

                <div className="bg-slate-50 border-l-4 border-emerald-400 rounded-r-xl p-4 text-sm text-slate-600">
                  <strong className="text-slate-900">What happens next:</strong> We review within <strong>48 hours</strong>. If approved, we set up your Stripe Connect payout account and list your product in the marketplace.
                </div>
              </form>
            </div>
          </>
        )}
      </section>
    </>
  )
}
