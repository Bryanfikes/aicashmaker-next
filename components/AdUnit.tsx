import Link from 'next/link'
import { getAds, ADVERTISER_PRESETS } from '@/lib/ads'
import type { AdPlacement, AdSize } from '@/collections/Advertisements'
import type { AdDoc } from '@/lib/ads'

interface AdUnitProps {
  size: AdSize
  placement?: AdPlacement
  className?: string
  /** Skip DB fetch and render this ad directly — useful for previews */
  forcedAd?: AdDoc
}

/** Pick the first ad for this slot (rotate by priority, server-side) */
export default async function AdUnit({ size, placement = 'global', className = '', forcedAd }: AdUnitProps) {
  let ad: AdDoc
  if (forcedAd) {
    ad = forcedAd
  } else {
    const ads = await getAds(placement, size)
    if (!ads.length) return null
    // Rotate randomly on each server render (dynamic pages re-render per request)
    ad = ads[Math.floor(Math.random() * ads.length)]
  }
  const preset = ADVERTISER_PRESETS[ad.advertiser] ?? ADVERTISER_PRESETS.custom
  const bg = ad.bgGradient || preset.bgGradient
  const bgStyle = preset.bgStyle ?? undefined
  const accent = ad.accentColor || preset.accentColor
  const accentStyle = preset.accentStyle ?? undefined
  const emoji = ad.logoEmoji || preset.logoEmoji
  const logoText = preset.logoText
  const isBonsaiX = !!preset.isBonsaiX

  const url = ad.ctaUrl || '#'
  const cta = ad.ctaText || 'Learn More'

  const sharedProps = { ad, bg, bgStyle, accent, accentStyle, emoji, logoText, isBonsaiX, url, cta, className }

  switch (size) {
    case 'billboard':       return <BillboardAd {...sharedProps} />
    case 'leaderboard':     return <LeaderboardAd {...sharedProps} />
    case 'medium-rectangle':return <MediumRectangleAd {...sharedProps} />
    case 'large-rectangle': return <LargeRectangleAd {...sharedProps} />
    case 'half-page':       return <HalfPageAd {...sharedProps} />
    case 'mobile-banner':   return <MobileBannerAd {...sharedProps} />
    case 'skyscraper':      return <SkyscraperAd {...sharedProps} />
    default:                return null
  }
}

interface AdProps {
  ad: AdDoc
  bg: string
  bgStyle?: string
  accent: string
  accentStyle?: string
  emoji: string
  logoText: string
  isBonsaiX?: boolean
  url: string
  cta: string
  className?: string
}

// BonsaiX brand components — dark navy + teal/aqua + coral, AI-zen SaaS ───────

/** "BONSAI" white + coral-to-orange "X" */
function BonsaiXWordmark({ fontSize = 13 }: { fontSize?: number }) {
  return (
    <span style={{ fontWeight: 900, letterSpacing: '0.06em', fontSize, color: '#f0f9ff', fontFamily: 'inherit' }}>
      BONSAI
      <span style={{
        background: 'linear-gradient(90deg, #fb7185 0%, #f97316 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>X</span>
    </span>
  )
}

/** Teal tech badge with coral-X mark — AI platform aesthetic */
function BonsaiXBadge({ size = 48 }: { size?: number }) {
  const r = Math.round(size * 0.22)
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: r,
      background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
      boxShadow: '0 0 18px rgba(13,148,136,0.55), 0 0 36px rgba(13,148,136,0.18)',
      border: '1px solid rgba(20,184,166,0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{
        fontWeight: 900,
        fontSize: size * 0.40,
        lineHeight: 1,
        background: 'linear-gradient(90deg, #fde68a 0%, #fb923c 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.02em',
      }}>X</span>
    </div>
  )
}

/** Teal gradient CTA — clean, readable, AI SaaS look */
function BonsaiXCta({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener sponsored"
      style={{
        background: 'linear-gradient(90deg, #0d9488 0%, #0891b2 100%)',
        color: '#fff',
        fontWeight: 700,
        fontSize: 12,
        padding: '9px 20px',
        borderRadius: 10,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        flexShrink: 0,
        letterSpacing: '0.03em',
        boxShadow: '0 0 14px rgba(13,148,136,0.45)',
        border: '1px solid rgba(20,184,166,0.3)',
      }}
    >
      {label} →
    </Link>
  )
}

/** Tagline chip shown under BonsaiX wordmark */
function BonsaiXTagline({ text, fontSize = 9 }: { text: string; fontSize?: number }) {
  return (
    <span style={{
      fontSize,
      color: '#5eead4',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      opacity: 0.85,
    }}>{text}</span>
  )
}

// ── Billboard 970×250 ────────────────────────────────────────────────────────
function BillboardAd({ ad, bg, bgStyle, accent, accentStyle, emoji, logoText, isBonsaiX, url, cta, className }: AdProps) {
  return (
    <div className={`w-full max-w-[970px] mx-auto ${className}`} aria-label="Advertisement">
      <div
        className={`relative overflow-hidden rounded-xl px-6 py-5 flex items-center justify-between gap-6 ${bgStyle ? '' : `bg-gradient-to-r ${bg}`}`}
        style={{ minHeight: 90, ...(bgStyle ? { background: bgStyle } : {}) }}
      >
        <div className="absolute inset-0 opacity-8 bg-[radial-gradient(ellipse_at_top_right,white,transparent)]" />
        <div className="relative flex items-center gap-4 flex-1 min-w-0">
          {isBonsaiX
            ? <BonsaiXBadge size={48} />
            : <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl flex-shrink-0">{emoji}</div>
          }
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {isBonsaiX ? <BonsaiXWordmark fontSize={13} /> : <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{logoText}</span>}
              {ad.badge && <span className="text-[9px] font-black uppercase bg-white/20 text-white px-2 py-0.5 rounded-full tracking-wider">{ad.badge}</span>}
            </div>
            {isBonsaiX && <BonsaiXTagline text="AI Search Optimization Engine" fontSize={9} />}
            <p className="text-white font-bold text-base leading-snug mt-0.5 truncate">{ad.headline}</p>
            {ad.subtext && <p className="text-white/65 text-xs mt-0.5 truncate hidden lg:block">{ad.subtext}</p>}
          </div>
        </div>
        {isBonsaiX
          ? <BonsaiXCta href={url} label={cta} />
          : <Link href={url} target="_blank" rel="noopener sponsored"
              className={`relative flex-shrink-0 ${accent} font-bold text-sm px-5 py-2 rounded-lg transition-all no-underline whitespace-nowrap shadow`}
              style={accentStyle ? { background: accentStyle, color: '#fff' } : undefined}
            >{cta} →</Link>
        }
        <AdLabel />
      </div>
    </div>
  )
}

// ── Leaderboard 728×90 ───────────────────────────────────────────────────────
function LeaderboardAd({ ad, bg, bgStyle, accent, isBonsaiX, url, cta, emoji, logoText, className }: AdProps) {
  return (
    <div className={`w-full max-w-[728px] mx-auto ${className}`} aria-label="Advertisement">
      <div
        className={`relative overflow-hidden rounded-xl px-5 py-3 flex items-center justify-between gap-4 ${bgStyle ? '' : `bg-gradient-to-r ${bg}`}`}
        style={bgStyle ? { background: bgStyle } : undefined}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_right,white,transparent)]" />
        <div className="relative flex items-center gap-3 flex-1 min-w-0">
          {isBonsaiX
            ? <BonsaiXBadge size={32} />
            : <span className="text-2xl flex-shrink-0">{emoji}</span>
          }
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              {isBonsaiX
                ? <span className="hidden sm:block"><BonsaiXWordmark fontSize={10} /></span>
                : <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest hidden sm:block">{logoText}</span>
              }
              {ad.badge && (
                <span className="text-[9px] font-black uppercase bg-white/20 text-white px-1.5 py-0.5 rounded-full tracking-wider">{ad.badge}</span>
              )}
            </div>
            <p className="text-white font-bold text-sm leading-tight truncate">{ad.headline}</p>
            {ad.subtext && <p className="text-white/60 text-xs hidden md:block truncate">{ad.subtext}</p>}
          </div>
        </div>
        {isBonsaiX
          ? <BonsaiXCta href={url} label={cta} />
          : <Link href={url} target="_blank" rel="noopener sponsored"
              className={`relative flex-shrink-0 ${accent} font-bold text-xs px-4 py-1.5 rounded-lg transition-all no-underline whitespace-nowrap`}
            >{cta}</Link>
        }
        <AdLabel />
      </div>
    </div>
  )
}

// ── Medium Rectangle 300×250 ─────────────────────────────────────────────────
function MediumRectangleAd({ ad, bg, bgStyle, accent, isBonsaiX, url, cta, emoji, logoText, className }: AdProps) {
  return (
    <div className={`w-[300px] ${className}`} aria-label="Advertisement">
      <div
        className={`relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between ${bgStyle ? '' : `bg-gradient-to-br ${bg}`}`}
        style={{ minHeight: '250px', ...(bgStyle ? { background: bgStyle } : {}) }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_left,white,transparent)]" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isBonsaiX ? <BonsaiXBadge size={32} /> : <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-xl">{emoji}</div>}
              {isBonsaiX ? <BonsaiXWordmark fontSize={11} /> : <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{logoText}</span>}
            </div>
            {ad.badge && (
              <span className="text-[9px] font-black uppercase bg-white/20 text-white px-2 py-0.5 rounded-full tracking-wider">{ad.badge}</span>
            )}
          </div>
          <p className="text-white font-extrabold text-lg leading-snug">{ad.headline}</p>
          {ad.subtext && <p className="text-white/70 text-sm mt-2 leading-snug">{ad.subtext}</p>}
        </div>
        <div className="relative mt-4">
          {isBonsaiX
            ? <BonsaiXCta href={url} label={`${cta} →`} />
            : <Link href={url} target="_blank" rel="noopener sponsored"
                className={`block text-center ${accent} font-bold text-sm px-4 py-2.5 rounded-xl transition-all no-underline w-full`}
              >{cta} →</Link>
          }
        </div>
        <AdLabel />
      </div>
    </div>
  )
}

// ── Large Rectangle 336×280 ──────────────────────────────────────────────────
function LargeRectangleAd({ ad, bg, bgStyle, accent, isBonsaiX, url, cta, emoji, logoText, className }: AdProps) {
  return (
    <div className={`w-[336px] ${className}`} aria-label="Advertisement">
      <div
        className={`relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between ${bgStyle ? '' : `bg-gradient-to-br ${bg}`}`}
        style={{ minHeight: '280px', ...(bgStyle ? { background: bgStyle } : {}) }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,white,transparent)]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            {isBonsaiX ? <BonsaiXBadge size={40} /> : <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-2xl">{emoji}</div>}
            <div>
              {isBonsaiX ? <BonsaiXWordmark fontSize={13} /> : <p className="text-white font-black text-sm">{logoText}</p>}
              {ad.badge && (
                <span className="text-[9px] font-black uppercase bg-white/20 text-white px-1.5 py-0.5 rounded-full tracking-wider">{ad.badge}</span>
              )}
            </div>
          </div>
          <p className="text-white font-extrabold text-xl leading-snug">{ad.headline}</p>
          {ad.subtext && <p className="text-white/70 text-sm mt-2 leading-snug">{ad.subtext}</p>}
        </div>
        <div className="relative mt-5">
          {isBonsaiX
            ? <BonsaiXCta href={url} label={`${cta} →`} />
            : <Link href={url} target="_blank" rel="noopener sponsored"
                className={`block text-center ${accent} font-bold text-sm px-4 py-3 rounded-xl transition-all no-underline w-full`}
              >{cta} →</Link>
          }
        </div>
        <AdLabel />
      </div>
    </div>
  )
}

// ── Half Page 300×600 ────────────────────────────────────────────────────────
function HalfPageAd({ ad, bg, bgStyle, accent, isBonsaiX, url, cta, emoji, logoText, className }: AdProps) {
  return (
    <div className={`w-[300px] ${className}`} aria-label="Advertisement">
      <div
        className={`relative overflow-hidden rounded-2xl p-6 flex flex-col ${bgStyle ? '' : `bg-gradient-to-b ${bg}`}`}
        style={{ minHeight: '600px', ...(bgStyle ? { background: bgStyle } : {}) }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,white,transparent)]" />
        {/* Header */}
        <div className="relative flex items-center gap-2 mb-6">
          {isBonsaiX ? <BonsaiXBadge size={36} /> : <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-2xl">{emoji}</div>}
          <div>
            {isBonsaiX ? <BonsaiXWordmark fontSize={13} /> : <p className="text-white font-black text-sm">{logoText}</p>}
            {ad.badge && (
              <span className="text-[9px] font-black uppercase bg-white/20 text-white px-1.5 py-0.5 rounded-full tracking-wider">{ad.badge}</span>
            )}
          </div>
        </div>
        {/* Main content */}
        <div className="relative flex-1">
          {/* Hero orb / icon */}
          {isBonsaiX
            ? <div className="flex flex-col items-center gap-2 mb-6">
                <BonsaiXBadge size={80} />
                <BonsaiXTagline text="AI Search Optimization Engine" fontSize={9} />
              </div>
            : <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-5xl mb-6 mx-auto">{emoji}</div>
          }
          <p className="text-white font-extrabold text-xl leading-tight text-center mb-2">{ad.headline}</p>
          {ad.subtext && <p className="text-white/70 text-sm text-center leading-relaxed">{ad.subtext}</p>}
          {/* Feature bullets */}
          <div className="mt-6 space-y-2.5">
            {getAdBullets(ad.advertiser).map((bullet, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                <span className="text-white/80 text-sm">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
        {/* CTA */}
        <div className="relative mt-8">
          {isBonsaiX
            ? <BonsaiXCta href={url} label={`${cta} →`} />
            : <Link href={url} target="_blank" rel="noopener sponsored"
                className={`block text-center ${accent} font-bold text-base px-4 py-3.5 rounded-xl transition-all no-underline w-full shadow-lg`}
              >{cta} →</Link>
          }
        </div>
        <AdLabel />
      </div>
    </div>
  )
}

// ── Mobile Banner 320×50 ─────────────────────────────────────────────────────
function MobileBannerAd({ ad, bg, bgStyle, accent, isBonsaiX, url, cta, emoji, className }: AdProps) {
  return (
    <div className={`w-full max-w-[320px] mx-auto sm:hidden ${className}`} aria-label="Advertisement">
      <div
        className={`relative overflow-hidden rounded-lg px-3 py-2 flex items-center justify-between gap-2 ${bgStyle ? '' : `bg-gradient-to-r ${bg}`}`}
        style={{ minHeight: '50px', ...(bgStyle ? { background: bgStyle } : {}) }}
      >
        <div className="relative flex items-center gap-2 flex-1 min-w-0">
          {isBonsaiX ? <BonsaiXBadge size={24} /> : <span className="text-lg flex-shrink-0">{emoji}</span>}
          <p className="text-white font-bold text-xs leading-tight truncate">{ad.headline}</p>
        </div>
        {isBonsaiX
          ? <BonsaiXCta href={url} label={cta} />
          : <Link href={url} target="_blank" rel="noopener sponsored"
              className={`relative flex-shrink-0 ${accent} font-bold text-[10px] px-2.5 py-1 rounded-md transition-all no-underline whitespace-nowrap`}
            >{cta}</Link>
        }
        <AdLabel />
      </div>
    </div>
  )
}

// ── Skyscraper 160×600 ───────────────────────────────────────────────────────
function SkyscraperAd({ ad, bg, bgStyle, accent, isBonsaiX, url, cta, emoji, logoText, className }: AdProps) {
  return (
    <div className={`w-[160px] ${className}`} aria-label="Advertisement">
      <div
        className={`relative overflow-hidden rounded-2xl p-4 flex flex-col ${bgStyle ? '' : `bg-gradient-to-b ${bg}`}`}
        style={{ minHeight: '600px', ...(bgStyle ? { background: bgStyle } : {}) }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,white,transparent)]" />
        {/* Logo */}
        <div className="relative flex flex-col items-center gap-1.5 mb-5">
          {isBonsaiX ? <BonsaiXBadge size={40} /> : <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-2xl">{emoji}</div>}
          {isBonsaiX
            ? <BonsaiXWordmark fontSize={9} />
            : <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest text-center">{logoText}</span>
          }
          {ad.badge && (
            <span className="text-[8px] font-black uppercase bg-white/20 text-white px-1.5 py-0.5 rounded-full tracking-wider">{ad.badge}</span>
          )}
        </div>
        {/* Content */}
        <div className="relative flex-1">
          <p className="text-white font-extrabold text-sm leading-snug text-center mb-2">{ad.headline}</p>
          {ad.subtext && <p className="text-white/70 text-xs text-center leading-snug">{ad.subtext}</p>}
          <div className="mt-4 space-y-2">
            {getAdBullets(ad.advertiser).slice(0, 3).map((bullet, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-white/50 flex-shrink-0 mt-1.5" />
                <span className="text-white/75 text-[10px] leading-snug">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
        {/* CTA */}
        <div className="relative mt-4">
          {isBonsaiX
            ? <BonsaiXCta href={url} label={cta} />
            : <Link href={url} target="_blank" rel="noopener sponsored"
                className={`block text-center ${accent} font-bold text-xs px-2 py-2 rounded-lg transition-all no-underline w-full`}
              >{cta}</Link>
          }
        </div>
        <AdLabel />
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function AdLabel() {
  return (
    <span className="absolute top-1.5 right-2 text-[8px] font-bold text-white/30 uppercase tracking-widest pointer-events-none">
      Ad
    </span>
  )
}

function getAdBullets(advertiser: string): string[] {
  const bullets: Record<string, string[]> = {
    'voice-bonsai': [
      'Answers calls 24/7',
      'Books appointments automatically',
      'Works for any local trade',
      'Setup in under 10 minutes',
      'Never lose a lead again',
    ],
    'bonsaix': [
      'Appear in ChatGPT answers',
      'Get cited by Perplexity',
      'Show up in Gemini results',
      'Foundation · Growth · Domination',
      'Local service SEO built-in',
    ],
    'bonsai-brain': [
      'AI-powered marketing tools',
      'SEO + content automation',
      'Built for local businesses',
      'Managed by real strategists',
      'Trusted by 100+ clients',
    ],
    'custom': [
      'Premium advertising',
      'Targeted to AI audiences',
      'High-intent traffic',
    ],
  }
  return bullets[advertiser] ?? bullets.custom
}
