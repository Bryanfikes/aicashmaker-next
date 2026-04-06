/**
 * Payload CMS generated types stub.
 * Run `npm run generate:types` to replace with fully generated types.
 */

export type User = {
  id: string
  name: string
  email: string
  role: 'super-admin' | 'editor' | 'author' | 'creator' | 'customer' | 'affiliate'
  creator?: string | Creator
  affiliate?: string | Affiliate
  createdAt: string
  updatedAt: string
}

export type Creator = {
  id: string
  displayName: string
  handle: string
  bio: string
  avatar?: string | Media
  avatarInitials?: string
  avatarGradient?: string
  categoryTags?: { tag: string; id?: string }[]
  productCount?: number
  downloadCount?: number
  rating?: number
  verified?: boolean
  websiteUrl?: string
  twitterHandle?: string
  instagramHandle?: string
  youtubeUrl?: string
  payoutEmail?: string
  stripeAccountId?: string
  stripeOnboardingComplete?: boolean
  createdAt: string
  updatedAt: string
}

export type Product = {
  id: string
  name: string
  slug: string
  type: 'prompt-pack' | 'template' | 'course' | 'automation' | 'digital-tool' | 'other'
  category?: string
  aiPlatform?: string
  tagline: string
  description?: unknown
  price: number
  creator?: string | Creator
  approved?: boolean
  featured?: boolean
  salesCount?: number
  downloadUrl?: string
  previewImages?: (string | Media)[]
  createdAt: string
  updatedAt: string
}

export type Order = {
  id: string
  orderType: 'product' | 'featured-listing' | 'newsletter-sponsorship' | 'full-review' | 'bundle'
  buyer?: string | User
  buyerEmail: string
  buyerName?: string
  product?: string | Product
  affiliate?: string | Affiliate
  affiliateCommission?: number
  amount: number
  platformFee?: number
  creatorPayout?: number
  status: 'pending' | 'paid' | 'fulfilled' | 'refunded' | 'failed'
  stripeSessionId: string
  stripePaymentIntentId?: string
  downloadSentAt?: string
  advertisingDetails?: {
    companyName?: string
    toolName?: string
    websiteUrl?: string
    notes?: string
  }
  createdAt: string
  updatedAt: string
}

export type Affiliate = {
  id: string
  displayName: string
  referralCode: string
  commissionRate: number
  payoutEmail?: string
  payoutMethod?: 'paypal' | 'bank' | 'stripe'
  totalClicks?: number
  totalConversions?: number
  totalEarned?: number
  totalPaid?: number
  status: 'active' | 'pending' | 'suspended'
  notes?: string
  createdAt: string
  updatedAt: string
}

export type AffiliateReferral = {
  id: string
  affiliate: string | Affiliate
  order?: string | Order
  type: 'click' | 'conversion'
  referralCode: string
  landingUrl?: string
  commission?: number
  status: 'pending' | 'approved' | 'paid' | 'rejected'
  visitorIp?: string
  createdAt: string
  updatedAt: string
}

export type Media = {
  id: string
  alt?: string
  url?: string
  filename?: string
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
  createdAt: string
  updatedAt: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  content?: unknown
  excerpt?: string
  category?: string
  published?: boolean
  publishedAt?: string
  readTimeMins?: number
  createdAt: string
  updatedAt: string
}

export type Advertisement = {
  id: string
  name: string
  advertiser: 'voice-bonsai' | 'bonsaix' | 'bonsai-brain' | 'custom'
  status: 'active' | 'paused' | 'scheduled' | 'expired'
  priority?: number
  size: 'leaderboard' | 'billboard' | 'medium-rectangle' | 'large-rectangle' | 'half-page' | 'mobile-banner' | 'skyscraper'
  placement: 'global' | 'homepage' | 'tools' | 'blog' | 'side-hustles' | 'prompts' | 'automations' | 'deals'
  startDate?: string | null
  endDate?: string | null
  headline: string
  subtext?: string
  ctaText?: string
  ctaUrl: string
  badge?: string
  bgGradient?: string
  accentColor?: string
  logoEmoji?: string
  logoImage?: string | Media | null
  impressions?: number
  clicks?: number
  notes?: string
  createdAt: string
  updatedAt: string
}
