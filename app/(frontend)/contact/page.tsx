'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) { setStatus('success'); setMsg(data.message || 'Message sent! We\'ll reply within 1–2 business days.') }
      else { setStatus('error'); setMsg(data.error || 'Something went wrong.') }
    } catch {
      setStatus('error'); setMsg('Network error. Please try again.')
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
            <span className="text-slate-600">Contact</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-sky-950 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Get in Touch</h1>
          <p className="text-sky-200 text-base">
            Questions, partnership inquiries, advertising, or just want to say hi — we respond to every message within 1–2 business days.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-14 grid md:grid-cols-3 gap-10">

        {/* Contact Info */}
        <div className="md:col-span-1 space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-4">Contact Options</h2>
            <div className="space-y-4">
              {[
                { icon: '📧', label: 'General Inquiries', value: 'hello@aicashmaker.com' },
                { icon: '💼', label: 'Advertising', value: 'ads@aicashmaker.com' },
                { icon: '🤝', label: 'Partnerships', value: 'partners@aicashmaker.com' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</div>
                    <div className="text-sm text-slate-700">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/submit-tool', label: 'Submit an AI Tool' },
                { href: '/submit-product', label: 'Sell a Product' },
                { href: '/advertise', label: 'Advertise with Us' },
                { href: '/newsletter', label: 'Subscribe to Newsletter' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-sky-600 hover:text-sky-700 no-underline">→ {label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Response Time</h3>
            <p className="text-xs text-slate-600 leading-relaxed">We respond to all messages within <strong>1–2 business days</strong>. For urgent advertising inquiries, include "URGENT" in your subject line.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          {status === 'success' ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-extrabold text-emerald-800 mb-2">Message Sent!</h2>
              <p className="text-emerald-700 text-sm">{msg}</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Your Name *</label>
                    <input type="text" required placeholder="Jane Smith" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email Address *</label>
                    <input type="email" required placeholder="jane@example.com" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Subject *</label>
                  <select required value={form.subject} onChange={e => set('subject', e.target.value)} className={inputCls}>
                    <option value="">— Select a subject —</option>
                    {['General Question', 'Advertising Inquiry', 'Partnership', 'Tool Submission', 'Product Submission', 'Bug Report', 'Press Inquiry', 'Other'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Message *</label>
                  <textarea required rows={6} placeholder="Tell us what's on your mind..." value={form.message} onChange={e => set('message', e.target.value)} className={`${inputCls} resize-none`} />
                </div>
                {status === 'error' && <p className="text-red-500 text-sm">{msg}</p>}
                <button type="submit" disabled={status === 'loading'} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60">
                  {status === 'loading' ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
