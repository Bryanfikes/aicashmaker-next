import type { Metadata } from 'next'
import AdUnit from '@/components/AdUnit'
import type { AdDoc } from '@/lib/ads'
import type { AdSize } from '@/collections/Advertisements'

export const metadata: Metadata = {
  title: 'Ad Preview — AICashMaker',
  robots: { index: false, follow: false },
}

// ── House ad definitions ────────────────────────────────────────────────────

const VOICE_BONSAI_AD: Omit<AdDoc, 'size'> = {
  id: 'preview-vb',
  name: 'Voice Bonsai — Preview',
  advertiser: 'voice-bonsai',
  status: 'active',
  priority: 100,
  placement: 'global',
  headline: 'Never Miss a Customer Call Again',
  subtext: 'AI voice + chat agents answer 24/7 for HVAC, plumbers, roofers & more.',
  ctaText: 'Start Free Trial',
  ctaUrl: 'https://voicebonsai.com',
  badge: 'FREE TRIAL',
  logoEmoji: '🎙️',
}

const BONSAIX_AD: Omit<AdDoc, 'size'> = {
  id: 'preview-bx',
  name: 'BonsaiX — Preview',
  advertiser: 'bonsaix',
  status: 'active',
  priority: 100,
  placement: 'global',
  headline: 'Dominate AI Search Results',
  subtext: 'Get your local business found on ChatGPT, Perplexity & Gemini.',
  ctaText: 'Get Started',
  ctaUrl: 'https://bonsaix.ai',
  badge: 'NEW',
  logoEmoji: '🌿',
}

// ── Ad sizes + display labels ───────────────────────────────────────────────

const AD_SIZES: { size: AdSize; label: string; dims: string; note: string }[] = [
  { size: 'billboard',         label: 'Billboard',         dims: '970 × 250', note: 'Homepage hero — below hero section' },
  { size: 'leaderboard',       label: 'Leaderboard',       dims: '728 × 90',  note: 'Global — below nav on every page' },
  { size: 'medium-rectangle',  label: 'Medium Rectangle',  dims: '300 × 250', note: 'Inline content / sidebar' },
  { size: 'large-rectangle',   label: 'Large Rectangle',   dims: '336 × 280', note: 'Below tools grid / inline content' },
  { size: 'half-page',         label: 'Half Page',         dims: '300 × 600', note: 'Tools directory sidebar' },
  { size: 'mobile-banner',     label: 'Mobile Banner',     dims: '320 × 50',  note: 'Mobile only — below nav' },
  { size: 'skyscraper',        label: 'Skyscraper',        dims: '160 × 600', note: 'Wide sidebar' },
]

// ── Page ────────────────────────────────────────────────────────────────────

export default function AdPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Display Ad Mockups</h1>
            <p className="text-sm text-slate-500 mt-0.5">All 7 IAB standard sizes — Voice Bonsai & BonsaiX</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">voicebonsai.com</span>
            <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-3 py-1.5 rounded-full">bonsaix.ai</span>
            <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">noindex — internal preview</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-16">

        {AD_SIZES.map(({ size, label, dims, note }) => (
          <section key={size}>
            {/* Section header */}
            <div className="flex items-center gap-4 mb-6 pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">{label}</h2>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-0.5 rounded">{dims}</span>
                  <span className="text-xs text-slate-500">{note}</span>
                </div>
              </div>
            </div>

            {/* Brand comparison — Voice Bonsai then BonsaiX */}
            <div className="flex flex-wrap gap-8 items-start">
              {/* Voice Bonsai */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">🎙️</span>
                  <span className="text-xs font-bold text-slate-700">Voice Bonsai</span>
                  <a
                    href="https://voicebonsai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-600 hover:text-emerald-800 font-semibold no-underline"
                  >
                    voicebonsai.com ↗
                  </a>
                </div>
                {/* Checkered background to simulate page context */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm inline-block">
                  <AdUnit
                    size={size}
                    forcedAd={{ ...VOICE_BONSAI_AD, size } as AdDoc}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:flex items-center self-stretch">
                <div className="h-full w-px bg-slate-200" />
              </div>

              {/* BonsaiX */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">🌿</span>
                  <span className="text-xs font-bold text-slate-700">BonsaiX</span>
                  <a
                    href="https://bonsaix.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-violet-600 hover:text-violet-800 font-semibold no-underline"
                  >
                    bonsaix.ai ↗
                  </a>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm inline-block">
                  <AdUnit
                    size={size}
                    forcedAd={{ ...BONSAIX_AD, size } as AdDoc}
                  />
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Footer note */}
        <div className="border-t border-slate-200 pt-8 pb-4 text-center">
          <p className="text-xs text-slate-400">
            These are live rendered components — any style change to <code className="bg-slate-100 px-1 rounded">AdUnit.tsx</code> updates here instantly.
            <br className="hidden sm:block" />
            To create custom campaigns, go to{' '}
            <a href="/admin/collections/advertisements/create" className="text-emerald-600 hover:text-emerald-700 font-semibold no-underline">
              Admin → Advertisements → New Ad
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
