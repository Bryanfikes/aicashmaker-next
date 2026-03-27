import type { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    group: 'Subscribers',
    defaultColumns: ['email', 'confirmed', 'subscribedAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'interest',
      type: 'select',
      options: [
        'Freelancing with AI',
        'Building an AI Agency',
        'Selling AI Prompts/Content',
        'AI Affiliate Marketing',
        'AI Automation Consulting',
        'Just Exploring',
      ].map(v => ({ label: v, value: v })),
    },
    {
      name: 'confirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Double opt-in confirmed' },
    },
    {
      name: 'subscribedAt',
      type: 'date',
    },
    {
      name: 'unsubscribeToken',
      type: 'text',
      admin: { readOnly: true, description: 'Auto-generated token for unsubscribe link' },
    },
    {
      name: 'source',
      type: 'select',
      options: ['homepage', 'blog', 'newsletter-page', 'tool-page', 'side-hustle-page', 'other'].map(v => ({ label: v, value: v })),
      defaultValue: 'homepage',
    },
    {
      name: 'unsubscribed',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.unsubscribeToken) {
          data.unsubscribeToken = crypto.randomBytes(32).toString('hex')
        }
        if (operation === 'create' && !data.subscribedAt) {
          data.subscribedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
