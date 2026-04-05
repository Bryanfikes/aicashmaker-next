import type { CollectionConfig } from 'payload'

export const AD_SIZES = [
  { label: 'Leaderboard (728×90)', value: 'leaderboard' },
  { label: 'Billboard (970×250)', value: 'billboard' },
  { label: 'Medium Rectangle (300×250)', value: 'medium-rectangle' },
  { label: 'Large Rectangle (336×280)', value: 'large-rectangle' },
  { label: 'Half Page (300×600)', value: 'half-page' },
  { label: 'Mobile Banner (320×50)', value: 'mobile-banner' },
  { label: 'Skyscraper (160×600)', value: 'skyscraper' },
] as const

export type AdSize = (typeof AD_SIZES)[number]['value']

export const AD_PLACEMENTS = [
  { label: 'Global — All Pages', value: 'global' },
  { label: 'Homepage', value: 'homepage' },
  { label: 'Tools Directory', value: 'tools' },
  { label: 'Blog Posts', value: 'blog' },
  { label: 'Side Hustles', value: 'side-hustles' },
  { label: 'Prompts', value: 'prompts' },
  { label: 'Automations', value: 'automations' },
  { label: 'Deals', value: 'deals' },
] as const

export type AdPlacement = (typeof AD_PLACEMENTS)[number]['value']

export const Advertisements: CollectionConfig = {
  slug: 'advertisements',
  admin: {
    useAsTitle: 'name',
    group: 'Advertising',
    defaultColumns: ['name', 'advertiser', 'size', 'placement', 'status', 'priority'],
    listSearchableFields: ['name', 'advertiser', 'headline'],
    pagination: { defaultLimit: 25 },
    description: 'Manage ad units displayed across the site. Active ads rotate by priority.',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ── Identity ──
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Internal name, e.g. "Voice Bonsai — Leaderboard Jan 2026"' },
    },
    {
      name: 'advertiser',
      type: 'select',
      required: true,
      options: [
        { label: 'Voice Bonsai', value: 'voice-bonsai' },
        { label: 'BonsaiX', value: 'bonsaix' },
        { label: 'Bonsai Brain', value: 'bonsai-brain' },
        { label: 'Custom / External', value: 'custom' },
      ],
      admin: { description: 'Which product or brand is advertising' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: '● Active', value: 'active' },
        { label: '◌ Paused', value: 'paused' },
        { label: '◎ Scheduled', value: 'scheduled' },
        { label: '✕ Expired', value: 'expired' },
      ],
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 10,
      admin: {
        description: 'Higher number = shown first. Use 1–100.',
        step: 1,
      },
    },
    // ── Targeting ──
    {
      type: 'row',
      fields: [
        {
          name: 'size',
          type: 'select',
          required: true,
          options: AD_SIZES.map(s => ({ ...s })),
          admin: { description: 'IAB standard ad unit size', width: '50%' },
        },
        {
          name: 'placement',
          type: 'select',
          required: true,
          defaultValue: 'global',
          options: AD_PLACEMENTS.map(p => ({ ...p })),
          admin: { description: 'Which page(s) to show this ad on', width: '50%' },
        },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      admin: { description: 'Leave blank to start immediately', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: { description: 'Leave blank to run indefinitely', date: { pickerAppearance: 'dayAndTime' } },
    },
    // ── Creative ──
    {
      type: 'collapsible',
      label: 'Ad Creative',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'headline',
          type: 'text',
          required: true,
          admin: { description: 'Main headline (keep under 60 chars for leaderboards)' },
        },
        {
          name: 'subtext',
          type: 'text',
          admin: { description: 'Supporting copy (optional)' },
        },
        {
          name: 'ctaText',
          type: 'text',
          defaultValue: 'Learn More',
          admin: { description: 'Button / link text' },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          required: true,
          admin: { description: 'Destination URL (full URL including https://)' },
        },
        {
          name: 'badge',
          type: 'text',
          admin: { description: 'Optional badge text, e.g. "FREE TRIAL" or "NEW"' },
        },
      ],
    },
    // ── Styling ──
    {
      type: 'collapsible',
      label: 'Brand Styling',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'bgGradient',
          type: 'text',
          admin: { description: 'Tailwind gradient classes, e.g. "from-violet-600 to-indigo-700". Leave blank for preset.' },
        },
        {
          name: 'accentColor',
          type: 'text',
          admin: { description: 'Tailwind color class for CTA button, e.g. "bg-emerald-500". Leave blank for preset.' },
        },
        {
          name: 'logoEmoji',
          type: 'text',
          admin: { description: 'Emoji icon for logo fallback if no image, e.g. 🎙️' },
        },
        {
          name: 'logoImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Logo/image for the ad (optional — overrides emoji)' },
        },
      ],
    },
    // ── Analytics ──
    {
      type: 'collapsible',
      label: 'Analytics',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'impressions',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'Total impressions (auto-tracked)', readOnly: true },
        },
        {
          name: 'clicks',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'Total clicks (auto-tracked)', readOnly: true },
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: { description: 'Internal notes about this ad campaign' },
        },
      ],
    },
  ],
}
