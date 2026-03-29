'use client'

import { useState } from 'react'

interface Props {
  userId: string
  initialName: string
  email: string
}

export default function AccountSettingsForm({ userId, initialName, email }: Props) {
  const [name, setName] = useState(initialName)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [profileStatus, setProfileStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [profileError, setProfileError] = useState('')

  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [passwordError, setPasswordError] = useState('')

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setProfileStatus('saving')
    setProfileError('')

    try {
      const res = await fetch('/api/account/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name }),
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setProfileError(data?.error || 'Failed to save changes.')
        setProfileStatus('error')
        return
      }

      setProfileStatus('success')
      setTimeout(() => setProfileStatus('idle'), 3000)
    } catch {
      setProfileError('Something went wrong. Please try again.')
      setProfileStatus('error')
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault()
    setPasswordStatus('saving')
    setPasswordError('')

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      setPasswordStatus('error')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.')
      setPasswordStatus('error')
      return
    }

    try {
      const res = await fetch('/api/account/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentPassword, newPassword }),
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setPasswordError(data?.error || 'Failed to update password.')
        setPasswordStatus('error')
        return
      }

      setPasswordStatus('success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordStatus('idle'), 3000)
    } catch {
      setPasswordError('Something went wrong. Please try again.')
      setPasswordStatus('error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Profile</h2>
            <p className="text-xs text-slate-400 mt-0.5">Update your display name</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Display name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              readOnly
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1.5">Email cannot be changed. Contact support if needed.</p>
          </div>

          {profileStatus === 'error' && profileError && (
            <div className="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3.5 py-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {profileError}
            </div>
          )}

          {profileStatus === 'success' && (
            <div className="flex items-center gap-2.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-3">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Profile updated successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={profileStatus === 'saving'}
            className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-semibold text-sm rounded-xl px-4 py-2 transition-colors"
          >
            {profileStatus === 'saving' ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </section>

      {/* Security / Password section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Security</h2>
            <p className="text-xs text-slate-400 mt-0.5">Change your account password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Current password
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-700 mb-1.5">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {passwordStatus === 'error' && passwordError && (
            <div className="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3.5 py-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {passwordError}
            </div>
          )}

          {passwordStatus === 'success' && (
            <div className="flex items-center gap-2.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-3">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Password updated successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={passwordStatus === 'saving'}
            className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-semibold text-sm rounded-xl px-4 py-2 transition-colors"
          >
            {passwordStatus === 'saving' ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>
    </div>
  )
}
