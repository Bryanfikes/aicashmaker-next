import Link from 'next/link'

interface ToolCardProps {
  name: string
  slug: string
  tagline: string
  description: string
  icon?: string
  iconGradient?: string
  category?: string
  pricingModel?: string
  price?: string
  rating?: number
  reviewCount?: number
  incomeLow?: number
  incomeHigh?: number
  badge?: string
  featured?: boolean
  affiliateLink?: string
  externalUrl?: string
}

export default function ToolCard({
  name,
  slug,
  tagline,
  description,
  icon,
  iconGradient,
  category,
  pricingModel,
  price,
  rating,
  reviewCount,
  incomeLow,
  incomeHigh,
  badge,
  featured,
  affiliateLink,
  externalUrl,
}: ToolCardProps) {
  const stars = rating ? Math.round(rating * 2) / 2 : 0
  const fullStars = Math.floor(stars)
  const hasHalf = stars % 1 !== 0

  const defaultGradient = 'linear-gradient(135deg, #0ea5e9, #0284c7)'
  const gradient = iconGradient || defaultGradient

  const incomeLabel =
    incomeLow && incomeHigh
      ? `$${incomeLow.toLocaleString()}–$${incomeHigh.toLocaleString()}/mo`
      : incomeLow
      ? `$${incomeLow.toLocaleString()}+/mo`
      : null

  const cardCls = "group block bg-white border border-slate-200 rounded-2xl p-5 hover:border-sky-300 hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline"

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: gradient }}
          >
            {icon || '🤖'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">{name}</h3>
            {category && (
              <span className="text-xs text-slate-500">{category}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 uppercase tracking-wide">
              {badge}
            </span>
          )}
          {featured && !badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide">
              Featured
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">{tagline || description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: fullStars }).map((_, i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            {hasHalf && (
              <svg width="12" height="12" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id={`half-${slug}`}>
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#e2e8f0" />
                  </linearGradient>
                </defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={`url(#half-${slug})`} />
              </svg>
            )}
          </div>
          {rating && (
            <span className="text-[11px] text-slate-500 font-medium">
              {rating.toFixed(1)}
              {reviewCount ? ` (${reviewCount})` : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {incomeLabel && (
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
              {incomeLabel}
            </span>
          )}
          {price && !affiliateLink && (
            <span className="text-[11px] font-semibold text-slate-700">
              {price}
            </span>
          )}
          {pricingModel === 'free' && !price && !affiliateLink && (
            <span className="text-[11px] font-semibold text-emerald-600">Free</span>
          )}
          {affiliateLink && (
            <a
              href={`/go/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              Try it →
            </a>
          )}
        </div>
      </div>
    </>
  )

  if (externalUrl) {
    return (
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cardCls}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link
      href={`/tools/${slug}`}
      className={cardCls}
    >
      {inner}
    </Link>
  )
}
