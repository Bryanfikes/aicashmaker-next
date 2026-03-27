import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[Stripe] STRIPE_SECRET_KEY not set — payment features disabled')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

export const PLATFORM_FEE_PERCENT = 20 // platform takes 20%, creator keeps 80%

export const ADVERTISING_PACKAGES = {
  'featured-listing': {
    name: 'Featured Tool Listing',
    description: 'Your tool featured at the top of the directory for 30 days with a "Featured" badge.',
    price: 19900, // $199 in cents
    interval: 'month' as const,
    features: [
      'Featured badge on tool card',
      'Top placement in directory',
      'Highlighted in newsletter (1x)',
      '30-day visibility boost',
    ],
  },
  'newsletter-sponsorship': {
    name: 'Newsletter Sponsorship',
    description: 'Dedicated sponsor slot in our next newsletter send to 5,000+ subscribers.',
    price: 34900, // $349 in cents
    interval: null,
    features: [
      'Dedicated sponsor section',
      '5,000+ subscriber reach',
      'Custom copy (100 words)',
      'Trackable link included',
    ],
  },
  'full-review': {
    name: 'Full Review Package',
    description: 'In-depth review article published on AICashMaker with SEO optimization.',
    price: 79900, // $799 in cents
    interval: null,
    features: [
      '1,500+ word review article',
      'SEO-optimized for your tool',
      'Promoted on homepage for 7 days',
      'Shared on social channels',
      'Permanent listing with review link',
    ],
  },
  bundle: {
    name: 'Ultimate Visibility Bundle',
    description: 'Everything: featured listing + newsletter sponsorship + full review.',
    price: 109500, // $1,095 in cents
    interval: null,
    features: [
      'Everything in all 3 packages',
      'Save $453 vs. buying separately',
      'Priority scheduling',
      'Monthly performance report',
    ],
  },
} as const

export type AdvertisingPackageId = keyof typeof ADVERTISING_PACKAGES
