import type { CollectionConfig } from 'payload'

export const Deals: CollectionConfig = {
  slug: 'deals',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'badgeType', 'dealPrice', 'savingsPct', 'expiresAt', 'active'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'tool',
      type: 'relationship',
      relationTo: 'tools',
    },
    {
      name: 'badgeType',
      type: 'select',
      required: true,
      options: [
        { label: 'Lifetime Deal', value: 'LIFETIME DEAL' },
        { label: 'Annual Deal', value: 'ANNUAL DEAL' },
        { label: 'Limited Offer', value: 'LIMITED OFFER' },
        { label: 'Free Forever', value: 'FREE FOREVER' },
        { label: 'Deal', value: 'DEAL' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'features',
      type: 'array',
      fields: [{ name: 'feature', type: 'text' }],
    },
    {
      name: 'originalPrice',
      type: 'text',
      admin: { description: 'e.g. $468/yr' },
    },
    {
      name: 'dealPrice',
      type: 'text',
      required: true,
      admin: { description: 'e.g. $99 or $348/yr' },
    },
    {
      name: 'savingsPct',
      type: 'number',
      admin: { description: 'Percentage saved, e.g. 79' },
    },
    {
      name: 'savingsAmount',
      type: 'text',
      admin: { description: 'Dollar amount saved override, e.g. $120' },
    },
    {
      name: 'affiliateLink',
      type: 'text',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: { description: 'Leave blank for evergreen deals' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show as featured deal (Deal of the Week)',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  timestamps: true,
}
