import type { CollectionConfig } from 'payload'

export const Tools: CollectionConfig = {
  slug: 'tools',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'category', 'pricingModel', 'rating', 'featured', 'published'],
    listSearchableFields: ['name', 'tagline', 'description'],
    pagination: { defaultLimit: 25 },
  },
  access: {
    read: () => true,
  },
  fields: [
    // ── Core identity ──
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'e.g. chatgpt-plus — used in URL /tools/[slug]' },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      admin: { description: 'One-line pitch, 60–80 chars' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'Short description for cards (160 chars max)' },
    },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Emoji icon, e.g. 🤖' },
    },
    {
      name: 'iconGradient',
      type: 'text',
      admin: { description: 'CSS gradient string for icon bg, e.g. linear-gradient(135deg,#10b981,#059669)' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    // ── Classification ──
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    // ── Pricing ──
    {
      name: 'pricingModel',
      type: 'select',
      required: true,
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Freemium', value: 'freemium' },
        { label: 'Paid', value: 'paid' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
    },
    {
      name: 'price',
      type: 'text',
      admin: { description: 'Display price, e.g. $20/mo or $99/yr' },
    },
    {
      name: 'pricingTiers',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'text', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'features',
          type: 'array',
          fields: [{ name: 'feature', type: 'text' }],
        },
        { name: 'highlighted', type: 'checkbox', defaultValue: false },
        { name: 'ctaText', type: 'text', defaultValue: 'Get Started' },
        { name: 'ctaUrl', type: 'text' },
      ],
    },
    // ── Rating ──
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      defaultValue: 0,
    },
    {
      name: 'reviewCount',
      type: 'number',
      defaultValue: 0,
    },
    // ── Income potential ──
    {
      name: 'incomeLow',
      type: 'number',
      admin: { description: 'Low end monthly income in USD' },
    },
    {
      name: 'incomeHigh',
      type: 'number',
      admin: { description: 'High end monthly income in USD' },
    },
    // ── Links ──
    {
      name: 'websiteUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'affiliateLink',
      type: 'text',
      admin: { description: 'Your affiliate tracking URL for this tool' },
    },
    // ── Affiliate program info ──
    {
      name: 'hasAffiliateProgram',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'affiliateCommission',
      type: 'text',
      admin: { description: 'e.g. 30% recurring' },
    },
    {
      name: 'affiliateCookieDays',
      type: 'number',
    },
    // ── Pros & Cons ──
    {
      name: 'pros',
      type: 'array',
      fields: [{ name: 'item', type: 'text' }],
    },
    {
      name: 'cons',
      type: 'array',
      fields: [{ name: 'item', type: 'text' }],
    },
    // ── Body content ──
    {
      name: 'fullReview',
      type: 'richText',
      admin: { description: 'Full review content with headings, pros/cons detail, etc.' },
    },
    {
      name: 'moneyMethods',
      type: 'array',
      label: 'Ways to Make Money',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'incomeLow', type: 'number' },
        { name: 'incomeHigh', type: 'number' },
        {
          name: 'difficulty',
          type: 'select',
          options: ['Beginner', 'Intermediate', 'Advanced'].map(v => ({ label: v, value: v })),
        },
      ],
    },
    // ── Tutorials ──
    {
      name: 'tutorials',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'url', type: 'text' },
        { name: 'readTime', type: 'text' },
        {
          name: 'type',
          type: 'select',
          options: ['Article', 'Video', 'Course'].map(v => ({ label: v, value: v })),
        },
      ],
    },
    // ── Reviews ──
    {
      name: 'reviews',
      type: 'array',
      fields: [
        { name: 'reviewerName', type: 'text', required: true },
        { name: 'reviewerTitle', type: 'text' },
        { name: 'rating', type: 'number', min: 1, max: 5 },
        { name: 'body', type: 'textarea' },
        { name: 'date', type: 'date' },
      ],
    },
    // ── Related tools ──
    {
      name: 'relatedTools',
      type: 'relationship',
      relationTo: 'tools',
      hasMany: true,
      admin: { description: 'Up to 4 related tools shown in sidebar' },
    },
    // ── Flags ──
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Feature on homepage',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
    {
      name: 'updatedNote',
      type: 'text',
      admin: { description: 'e.g. "Updated March 2025"' },
    },
  ],
  timestamps: true,
}
