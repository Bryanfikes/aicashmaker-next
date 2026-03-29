'use client'

import { useState } from 'react'

interface CreatorData {
  id: string
  displayName: string
  handle: string
  bio: string
  websiteUrl?: string
  twitterHandle?: string
  payoutEmail?: string
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors'

const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'

export default function ProfileForm({ creator }: { creator: CreatorData }) {
  const [form, setForm] = useState({
    displayName: creator.displayName,
    handle: creator.handle,
    bio: creator.bio,
    websiteUrl: creator.websiteUrl || '',
    twitterHandle: creator.twitterHandle || '',
    payoutEmail: creator.payoutEmail || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      const res = await fetch('/api/dashboard/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId: creator.id, ...form }),
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.error || 'Failed to save. Please try again.')
        return
      }
      setSaved(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Display name</label>
          <input
            name="displayName"
            type="text"
            required
            value={form.displayName}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Handle</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">@</span>
            <input
              name="handle"
              type="text"
              required
              value={form.handle}
              onChange={handleChange}
              className={`${inputClass} pl-8`}
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Bio</label>
        <textarea
          name="bio"
          required
          rows={4}
          value={form.bio}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Website URL</label>
          <input
            name="websiteUrl"
            type="url"
            value={form.websiteUrl}
            onChange={handleChange}
            placeholder="https://yoursite.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Twitter / X handle</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">@</span>
            <input
              name="twitterHandle"
              type="text"
              value={form.twitterHandle}
              onChange={handleChange}
              placeholder="yourhandle"
              className={`${inputClass} pl-8`}
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Payout email</label>
        <input
          name="payoutEmail"
          type="email"
          value={form.payoutEmail}
          onChange={handleChange}
          placeholder="payouts@yoursite.com"
          className={inputClass}
        />
        <p className="text-xs text-slate-400 mt-1.5">Where we send your Stripe payouts.</p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-semibold rounded-xl px-6 py-2 text-sm transition-colors"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && (
          <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Saved
          </span>
        )}
      </div>
    </form>
  )
}
