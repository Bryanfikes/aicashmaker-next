import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import CopyLinkButton from './_components/CopyLinkButton'

export const metadata = { title: 'My Links' }

const SITE_URL = 'https://aicashmaker.com'

const quickLinkDefs = [
  { label: 'Homepage', path: '', description: 'Your main entry point' },
  { label: 'All Products', path: '/products', description: 'Full product catalog' },
  { label: 'AI Tools', path: '/tools', description: 'Top-converting page' },
  { label: 'Side Hustle Guides', path: '/side-hustles', description: 'High-value content' },
  { label: 'Prompts', path: '/prompts', description: 'Popular with creators' },
  { label: 'Automation Templates', path: '/automations', description: 'Productivity tools' },
  { label: 'Blog', path: '/blog', description: 'Educational content' },
]

const tips = [
  {
    title: 'Add to every bio',
    body: 'Drop your referral link in your YouTube description, Instagram bio, Twitter/X profile, and newsletter footer.',
    icon: (
      <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: '30-day cookie window',
    body: 'Visitors are tracked for 30 days — even if they don\'t buy immediately, you still earn when they come back.',
    icon: (
      <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Link to the right page',
    body: 'Point readers to the specific tool or product that matches what they\'re searching for — higher relevance means higher conversions.',
    icon: (
      <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
]

export default async function AffiliateLinksPage() {
  let referralCode = ''
  let commissionRate = 30

  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) redirect('/login')
    if ((user as { role?: string }).role !== 'affiliate') redirect('/login')

    if ((user as any).affiliate) {
      const affiliateId =
        typeof (user as any).affiliate === 'object'
          ? (user as any).affiliate?.id
          : (user as any).affiliate

      const affiliate = await payload.findByID({
        collection: 'affiliates',
        id: affiliateId as string,
        overrideAccess: true,
      }) as { referralCode?: string; commissionRate?: number }

      referralCode = affiliate?.referralCode || ''
      commissionRate = affiliate?.commissionRate ?? 30
    }
  } catch {
    redirect('/login')
  }

  const baseUrl = referralCode ? `${SITE_URL}?ref=${referralCode}` : SITE_URL

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Page header strip */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">My Links</h1>
            <p className="text-sm text-slate-400 mt-1">Generate and copy referral links to share anywhere.</p>
          </div>
          <span className="ml-auto inline-flex items-center bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
            You earn {commissionRate}% on every sale
          </span>
        </div>
      </div>

      <div className="p-8">
        {/* Commission callout */}
        <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight">
                {commissionRate}% Commission on Every Sale
              </p>
              <p className="text-sm text-white/80 mt-1">
                Commission is tracked automatically the moment a customer clicks your link. Payouts are processed monthly to your registered payout email.
              </p>
            </div>
          </div>
        </div>

        {/* Base referral URL */}
        {referralCode && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight mb-1">Your Referral URL</h2>
            <p className="text-xs text-slate-500 mb-3">
              Append <code className="bg-slate-100 px-1.5 py-0.5 rounded-lg text-slate-700 font-mono">?ref={referralCode}</code> to any AICashMaker page URL.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-900 rounded-xl px-4 py-3 font-mono text-sky-400 text-sm tracking-widest truncate">
                {baseUrl}
              </div>
              <CopyLinkButton url={baseUrl} />
            </div>
          </div>
        )}

        {/* Quick links table */}
        <div className="bg-white border border-slate-200 rounded-2xl mb-8">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-extrabold text-slate-900 tracking-tight">Quick Links</h2>
            <p className="text-xs text-slate-500 mt-0.5">Pre-built referral links for popular pages</p>
          </div>

          <div className="divide-y divide-slate-100">
            {quickLinkDefs.map(({ label, path, description }) => {
              const url = referralCode
                ? `${SITE_URL}${path}?ref=${referralCode}`
                : `${SITE_URL}${path}`

              return (
                <div key={path} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono truncate">{url}</p>
                  </div>
                  <CopyLinkButton url={url} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Tips section */}
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 tracking-tight mb-4">Tips for Sharing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tips.map((tip) => (
              <div key={tip.title} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-3">
                  {tip.icon}
                </div>
                <p className="text-sm font-extrabold text-slate-900 tracking-tight">{tip.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
