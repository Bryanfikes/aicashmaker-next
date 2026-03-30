'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AffiliateData {
  displayName: string
  referralCode: string
  commissionRate: number
  totalClicks: number
  totalConversions: number
  totalEarned: number
  totalPaid: number
  status: string
  payoutEmail: string
  payoutMethod: string
  id: string
}

interface Referral {
  id: string
  type: 'click' | 'conversion'
  commission: number
  status: string
  landingUrl: string
  createdAt: string
}

function fmt(cents: number) {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function AffiliateDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ name?: string; email?: string; affiliate?: any } | null>(null)
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    async function load() {
      try {
        // Verify session
        const meRes = await fetch('/api/users/me', { credentials: 'include' })
        if (!meRes.ok) { router.replace('/affiliate/login'); return }
        const meData = await meRes.json() as { user?: { name?: string; email?: string; role?: string; affiliate?: any } }
        if (!meData.user || (meData.user.role !== 'affiliate' && meData.user.role !== 'super-admin')) {
          router.replace('/affiliate/login'); return
        }
        setUser(meData.user)

        // Get affiliate profile
        const affiliateId = typeof meData.user.affiliate === 'object'
          ? meData.user.affiliate?.id
          : meData.user.affiliate

        if (!affiliateId) { router.replace('/affiliate/login'); return }

        const affRes = await fetch(`/api/affiliates/${affiliateId}`, { credentials: 'include' })
        if (affRes.ok) {
          const affData = await affRes.json() as AffiliateData
          setAffiliate(affData)
        }

        // Get recent referrals
        const refRes = await fetch(
          `/api/affiliate-referrals?where[affiliate][equals]=${affiliateId}&limit=20&sort=-createdAt`,
          { credentials: 'include' }
        )
        if (refRes.ok) {
          const refData = await refRes.json() as { docs: Referral[] }
          setReferrals(refData.docs || [])
        }
      } catch {
        router.replace('/affiliate/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  async function handleLogout() {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    router.push('/affiliate/login')
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.aicashmaker.com'
  const referralLink = affiliate ? `${siteUrl}?ref=${affiliate.referralCode}` : ''
  const pendingEarned = affiliate ? (affiliate.totalEarned - affiliate.totalPaid) : 0
  const conversionRate = affiliate && affiliate.totalClicks > 0
    ? ((affiliate.totalConversions / affiliate.totalClicks) * 100).toFixed(1)
    : '0.0'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/8 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center text-white font-black text-sm">A</div>
              <span className="font-bold text-white hidden sm:block">AICashMaker</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-semibold text-violet-400">Affiliate Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 hidden sm:block">{user?.name || user?.email}</span>
            {affiliate && (
              <span className={`text-xs px-2 py-0.5 rounded font-bold ${affiliate.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                {affiliate.status}
              </span>
            )}
            <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-slate-300 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white">
            Welcome back, {affiliate?.displayName || user?.name || 'Affiliate'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            You earn <span className="text-violet-400 font-bold">{affiliate?.commissionRate || 30}% commission</span> on every sale you refer.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Earned', value: fmt(affiliate?.totalEarned || 0), sub: 'Lifetime commissions', color: 'text-emerald-400', bg: 'border-emerald-500/20' },
            { label: 'Pending Payout', value: fmt(pendingEarned), sub: 'Awaiting next cycle', color: 'text-violet-400', bg: 'border-violet-500/20' },
            { label: 'Total Clicks', value: (affiliate?.totalClicks || 0).toLocaleString(), sub: 'Referral link visits', color: 'text-sky-400', bg: 'border-sky-500/20' },
            { label: 'Conversions', value: (affiliate?.totalConversions || 0).toLocaleString(), sub: `${conversionRate}% conversion rate`, color: 'text-pink-400', bg: 'border-pink-500/20' },
          ].map(({ label, value, sub, color, bg }) => (
            <div key={label} className={`bg-slate-900 border ${bg} rounded-2xl p-5`}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
              <p className={`text-2xl font-extrabold ${color} mb-1`}>{value}</p>
              <p className="text-xs text-slate-500">{sub}</p>
            </div>
          ))}
        </div>

        {/* Referral Link */}
        <div className="bg-gradient-to-r from-violet-900/40 to-sky-900/30 border border-violet-500/20 rounded-2xl p-6 mb-6">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-3">Your Referral Link</p>
          <div className="flex gap-2 mb-4">
            <div className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 font-mono truncate">
              {referralLink || 'Loading…'}
            </div>
            <button
              onClick={() => copyText(referralLink, 'main')}
              className="flex-shrink-0 bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors"
            >
              {copied === 'main' ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: 'Tools Page', path: '/tools' },
              { label: 'Side Hustles', path: '/side-hustles' },
              { label: 'Prompt Marketplace', path: '/prompts' },
            ].map(({ label, path }) => {
              const link = `${siteUrl}${path}?ref=${affiliate?.referralCode || ''}`
              return (
                <div key={label} className="bg-slate-900/60 rounded-xl p-3 border border-white/5">
                  <p className="text-xs font-semibold text-slate-300 mb-1.5">{label}</p>
                  <div className="flex gap-1.5">
                    <p className="text-xs text-slate-500 font-mono truncate flex-1">{link}</p>
                    <button
                      onClick={() => copyText(link, label)}
                      className="text-xs text-violet-400 hover:text-violet-300 flex-shrink-0 font-semibold"
                    >
                      {copied === label ? '✓' : 'Copy'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="bg-slate-900 border border-white/8 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Recent Activity</h2>
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm mb-2">No referrals yet</p>
              <p className="text-slate-600 text-xs">Share your referral link to start earning commissions</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase pb-3 pr-4">Date</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase pb-3 pr-4">Type</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase pb-3 pr-4">Landing Page</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase pb-3 pr-4">Status</th>
                    <th className="text-right text-xs font-semibold text-slate-400 uppercase pb-3">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map(r => (
                    <tr key={r.id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-4 text-slate-400 text-xs whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${r.type === 'conversion' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                          {r.type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-400 text-xs truncate max-w-[150px]">{r.landingUrl || '—'}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          r.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400'
                          : r.status === 'approved' ? 'bg-sky-500/15 text-sky-400'
                          : r.status === 'pending' ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-red-500/15 text-red-400'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-400">
                        {r.commission > 0 ? fmt(r.commission) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payout info + Promo tips */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Payout */}
          <div className="bg-slate-900 border border-white/8 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Payout Details</h2>
            <div className="space-y-3">
              {[
                ['Method', affiliate?.payoutMethod || '—'],
                ['Payout Email', affiliate?.payoutEmail || 'Not set'],
                ['Total Paid', fmt(affiliate?.totalPaid || 0)],
                ['Pending', fmt(pendingEarned)],
                ['Schedule', 'Monthly (1st of month)'],
                ['Minimum', '$50'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
            <Link href="/contact" className="block mt-5 text-center text-xs bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 border border-violet-500/20 py-2.5 rounded-xl transition-colors no-underline font-semibold">
              Request Payout / Update Details
            </Link>
          </div>

          {/* Promo tips */}
          <div className="bg-slate-900 border border-white/8 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">How to Promote</h2>
            <div className="space-y-3">
              {[
                ['📝', 'Write reviews', 'Honest tool reviews on your blog convert at 3–5%.'],
                ['🎥', 'Tutorial videos', '"How to make money with [Tool]" YouTube content drives clicks.'],
                ['🔗', 'Comparison posts', '"Tool A vs Tool B" captures high-intent buyers.'],
                ['📧', 'Email your list', 'Single email to 1,000 subs can generate $500+ in commissions.'],
              ].map(([icon, title, desc]) => (
                <div key={title as string} className="flex gap-3">
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title as string}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
