'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PACKAGES = [
  {
    id: 'featured-listing',
    name: 'Featured Tool Listing',
    price: '$199/mo',
    badge: 'Most Popular',
    badgeColor: 'bg-blue-500',
    description: 'Your tool featured at the top of our directory for 30 days.',
    features: [
      'Featured badge on tool card',
      'Top placement in directory',
      'Highlighted in 1 newsletter issue',
      '30-day visibility boost',
      'Monthly renewal — cancel anytime',
    ],
  },
  {
    id: 'newsletter-sponsorship',
    name: 'Newsletter Sponsorship',
    price: '$349',
    badge: null,
    badgeColor: '',
    description: 'Dedicated sponsor slot in our next send to 5,000+ subscribers.',
    features: [
      'Dedicated sponsor section',
      '5,000+ subscriber reach',
      'Custom copy (up to 100 words)',
      'Trackable affiliate link',
      'Plain-text + HTML formats',
    ],
  },
  {
    id: 'full-review',
    name: 'Full Review Package',
    price: '$799',
    badge: 'Best Value',
    badgeColor: 'bg-emerald-500',
    description: 'In-depth SEO-optimized review article published permanently.',
    features: [
      '1,500+ word review article',
      'SEO-optimized for your tool name',
      'Homepage featured for 7 days',
      'Shared to 15K+ social followers',
      'Permanent do-follow backlink',
    ],
  },
  {
    id: 'bundle',
    name: 'Ultimate Visibility Bundle',
    price: '$1,095',
    badge: 'Save $453',
    badgeColor: 'bg-purple-500',
    description: 'Everything: featured listing + newsletter + full review.',
    features: [
      'Everything in all 3 packages',
      'Priority scheduling (within 7 days)',
      'Monthly performance report',
      'Dedicated account manager',
      'Best ROI for launches',
    ],
  },
]

export default function AdvertiseClient() {
  const [selected, setSelected] = useState<string | null>(null)
  const [form, setForm] = useState({ companyName: '', websiteUrl: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    if (!form.companyName.trim() || !form.email.trim()) {
      setError('Company name and email are required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'advertising',
          packageId: selected,
          companyName: form.companyName,
          websiteUrl: form.websiteUrl,
          email: form.email,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Checkout failed')
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Advertising
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Reach 50,000+ AI Income Seekers
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            AICashMaker readers are actively looking for tools to make money with AI. Get in front of them.
          </p>
          <div className="grid grid-cols-3 gap-8 mt-12 max-w-lg mx-auto text-center">
            {[['50K+', 'Monthly readers'], ['5K+', 'Newsletter subscribers'], ['170+', 'Tools reviewed']].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-bold text-white">{n}</div>
                <div className="text-sm text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Choose a Package</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {PACKAGES.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => setSelected(pkg.id)}
                className={`text-left rounded-2xl border-2 p-6 transition-all cursor-pointer ${
                  selected === pkg.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow'
                }`}
              >
                {pkg.badge && (
                  <span className={`inline-block ${pkg.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3`}>
                    {pkg.badge}
                  </span>
                )}
                <div className="text-lg font-bold text-slate-900 mb-1">{pkg.name}</div>
                <div className="text-2xl font-bold text-blue-600 mb-3">{pkg.price}</div>
                <p className="text-sm text-slate-600 mb-4">{pkg.description}</p>
                <ul className="space-y-1.5">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className={`mt-4 h-1 rounded-full ${selected === pkg.id ? 'bg-blue-500' : 'bg-slate-100'}`} />
              </button>
            ))}
          </div>

          {/* Checkout form */}
          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              {selected
                ? `Get started with ${PACKAGES.find(p => p.id === selected)?.name}`
                : 'Select a package above to continue'}
            </h3>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company / Tool Name *</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                  placeholder="Acme AI Tools"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
                <input
                  type="url"
                  value={form.websiteUrl}
                  onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
                  placeholder="https://yourtool.com"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={!selected || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? 'Redirecting to checkout…' : 'Continue to Secure Checkout →'}
              </button>
              <p className="text-xs text-slate-500 text-center">
                Powered by Stripe · Secure payment · No hidden fees
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
