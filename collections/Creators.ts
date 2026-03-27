import type { CollectionConfig } from 'payload'

export const Creators: CollectionConfig = {
  slug: 'creators',
  admin: {
    useAsTitle: 'displayName',
    group: 'Marketplace',
    defaultColumns: ['displayName', 'handle', 'categoryTags', 'verified', 'productCount'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      required: true,
    },
    {
      name: 'handle',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'e.g. @alexchenai — without the @' },
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'avatarInitials',
      type: 'text',
      admin: { description: 'Fallback initials if no avatar, e.g. AC' },
    },
    {
      name: 'avatarGradient',
      type: 'text',
      admin: { description: 'CSS gradient for avatar bg, e.g. linear-gradient(135deg,#0ea5e9,#0284c7)' },
    },
    {
      name: 'categoryTags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'select',
          options: [
            'Prompt Engineering', 'Automation', 'AI Marketing', 'AI Development',
            'Course Creation', 'AI Video', 'AI Writing', 'ChatGPT', 'Midjourney',
          ].map(v => ({ label: v, value: v })),
        },
      ],
    },
    {
      name: 'productCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      defaultValue: 0,
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'payoutEmail',
      type: 'email',
      admin: { description: 'Payout destination email (internal only)' },
    },
    {
      name: 'stripeAccountId',
      type: 'text',
      admin: { description: 'Stripe Connect account ID (internal only)' },
    },
    {
      name: 'websiteUrl',
      type: 'text',
    },
    {
      name: 'twitterHandle',
      type: 'text',
    },
  ],
  timestamps: true,
}
