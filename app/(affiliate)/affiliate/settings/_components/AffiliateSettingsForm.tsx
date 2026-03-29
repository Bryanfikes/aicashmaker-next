'use client'

import { useState } from 'react'

interface Props {
  initialDisplayName: string
  initialPayoutEmail: string
  initialPayoutMethod: string
}

const payoutMethods = [
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'check', label: 'Check' },
  { value: 'other', label: 'Other' },
]

export default function AffiliateSettingsForm({
  initialDisplayName,
  initialPayoutEmail,
  initialPayoutMethod,
}: Props) {
  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [payoutEmail, setPayoutEmail] = useState(initialPayoutEmail)
  const [payoutMethod, setPayoutMethod] = useState(initialPayoutMethod || 'paypal')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError('')

    try {
      const res = await fetch('/api/affiliate/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, payoutEmail, payoutMethod }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save settings')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="displayName" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Display Name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
          placeholder="Your name or brand"
          required
        />
      </div>

      <div>
        <label htmlFor="payoutEmail" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Payout Email
        </label>
        <input
          id="payoutEmail"
          type="email"
          value={payoutEmail}
          onChange={(e) => setPayoutEmail(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
          placeholder="payouts@example.com"
        />
        <p className="text-xs text-slate-400 mt-1.5">Email address where we&apos;ll send your payouts.</p>
      </div>

      <div>
        <label htmlFor="payoutMethod" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Payout Method
        </label>
        <select
          id="payoutMethod"
          value={payoutMethod}
          onChange={(e) => setPayoutMethod(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-shadow"
        >
          {payoutMethods.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Inline success state */}
      {success && (
        <div className="flex items-center gap-2.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Settings saved successfully.</span>
        </div>
      )}

      {/* Inline error state */}
      {error && (
        <div className="flex items-center gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
