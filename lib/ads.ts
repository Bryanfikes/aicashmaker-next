import { getPayload } from '@/lib/payload'
import type { AdPlacement, AdSize } from '@/collections/Advertisements'

export interface AdDoc {
  id: string | number
  name: string
  advertiser: 'voice-bonsai' | 'bonsaix' | 'bonsai-brain' | 'custom'
  status: string
  priority: number
  size: AdSize
  placement: AdPlacement
  headline: string
  subtext?: string
  ctaText?: string
  ctaUrl: string
  badge?: string
  bgGradient?: string
  accentColor?: string
  logoEmoji?: string
  logoImage?: { url?: string; alt?: string } | null
  startDate?: string | null
  endDate?: string | null
  impressions?: number
  clicks?: number
}

// Advertiser presets: brand styling defaults when no custom styling is set
export const ADVERTISER_PRESETS: Record<string, {
  bgGradient: string
  bgStyle?: string          // inline CSS background (overrides bgGradient when present)
  accentColor: string
  accentStyle?: string      // inline CSS background for CTA button (overrides accentColor)
  logoEmoji: string
  logoText: string
  tagline: string
  isBonsaiX?: boolean       // triggers custom wordmark rendering
}> = {
  'voice-bonsai': {
    bgGradient: 'from-blue-900 via-blue-700 to-blue-500',
    bgStyle: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 55%, #60a5fa 100%)',
    accentColor: 'bg-white text-blue-700 hover:bg-blue-50',
    logoEmoji: '🎙️',
    logoText: 'Voice Bonsai',
    tagline: 'AI Receptionist for Local Business',
  },
  'bonsaix': {
    // Dark navy base + teal/aqua glow + coral accent + subtle dot grid — AI-zen SaaS aesthetic
    bgGradient: 'from-slate-950 to-cyan-950',
    bgStyle: [
      'radial-gradient(circle, rgba(20,184,166,0.10) 1px, transparent 1px) 0 0 / 20px 20px',
      'radial-gradient(ellipse at 18% 55%, rgba(20,184,166,0.28) 0%, transparent 48%)',
      'radial-gradient(ellipse at 82% 35%, rgba(251,113,133,0.14) 0%, transparent 42%)',
      'radial-gradient(ellipse at 50% 100%, rgba(8,145,178,0.12) 0%, transparent 55%)',
      'linear-gradient(135deg, #020c18 0%, #03111f 60%, #040e1c 100%)',
    ].join(', '),
    accentColor: 'bg-teal-500 text-white hover:bg-teal-400',
    accentStyle: 'linear-gradient(90deg, #0d9488 0%, #0891b2 100%)',
    logoEmoji: '⬡',
    logoText: 'BonsaiX',
    tagline: 'AI Search Optimization Engine',
    isBonsaiX: true,
  },
  'bonsai-brain': {
    bgGradient: 'from-sky-600 via-blue-700 to-indigo-700',
    accentColor: 'bg-white text-sky-700 hover:bg-sky-50',
    logoEmoji: '🧠',
    logoText: 'Bonsai Brain',
    tagline: 'AI-Powered Marketing',
  },
  'custom': {
    bgGradient: 'from-slate-700 to-slate-800',
    accentColor: 'bg-white text-slate-700 hover:bg-slate-100',
    logoEmoji: '◈',
    logoText: 'Sponsor',
    tagline: '',
  },
}

/**
 * Fetch active ads for a given placement + size from Payload.
 * Falls back to built-in house ads if the DB has no matching ads.
 */
export async function getAds(placement: AdPlacement, size: AdSize): Promise<AdDoc[]> {
  try {
    const payload = await getPayload()
    const now = new Date().toISOString()

    const result = await payload.find({
      collection: 'advertisements',
      where: {
        and: [
          { status: { equals: 'active' } },
          { size: { equals: size } },
          {
            or: [
              { placement: { equals: 'global' } },
              { placement: { equals: placement } },
            ],
          },
          {
            or: [
              { startDate: { exists: false } },
              { startDate: { less_than_equal: now } },
            ],
          },
          {
            or: [
              { endDate: { exists: false } },
              { endDate: { greater_than_equal: now } },
            ],
          },
        ],
      },
      sort: '-priority',
      limit: 3,
      overrideAccess: true,
    })

    if (result.docs.length > 0) {
      return result.docs as unknown as AdDoc[]
    }

    // Fallback: return house ads (Voice Bonsai + BonsaiX) when DB has no ads yet
    return getHouseAds(size)
  } catch {
    return getHouseAds(size)
  }
}

/** Built-in house ads for Voice Bonsai + BonsaiX — used before DB ads are set up */
function getHouseAds(size: AdSize): AdDoc[] {
  const ads: AdDoc[] = [
    {
      id: 'house-vb-1',
      name: 'Voice Bonsai — House Ad',
      advertiser: 'voice-bonsai',
      status: 'active',
      priority: 50,
      size,
      placement: 'global',
      headline: 'Never Miss a Customer Call Again',
      subtext: 'AI voice + chat agents answer 24/7 for HVAC, plumbers, roofers & more.',
      ctaText: 'Start Free Trial',
      ctaUrl: 'https://voicebonsai.com',
      badge: 'FREE TRIAL',
      bgGradient: '',
      accentColor: '',
      logoEmoji: '🎙️',
    },
    {
      id: 'house-bx-1',
      name: 'BonsaiX — House Ad',
      advertiser: 'bonsaix',
      status: 'active',
      priority: 45,
      size,
      placement: 'global',
      headline: 'Get Found on ChatGPT & Perplexity',
      subtext: 'AI-powered visibility for local businesses. Appear where your customers search.',
      ctaText: 'Start Growing',
      ctaUrl: 'https://bonsaix.ai',
      badge: 'AI SEARCH',
      bgGradient: '',
      accentColor: '',
      logoEmoji: '🌳',
    },
  ]
  return ads
}
