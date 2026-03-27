import type { CollectionConfig } from 'payload'

export const ProductSubmissions: CollectionConfig = {
  slug: 'product-submissions',
  admin: {
    useAsTitle: 'productName',
    group: 'Submissions',
    defaultColumns: ['productName', 'type', 'price', 'creatorEmail', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'productName',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Prompt Pack', value: 'prompt-pack' },
        { label: 'Automation Template', value: 'automation' },
        { label: 'AI Course', value: 'course' },
        { label: 'AI Template', value: 'template' },
        { label: 'Bundle', value: 'bundle' },
      ],
    },
    {
      name: 'aiPlatform',
      type: 'select',
      options: [
        'ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'Stable Diffusion',
        'Perplexity', 'Make.com', 'Zapier', 'n8n', 'Multiple', 'Other',
      ].map(v => ({ label: v, value: v })),
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 5,
      admin: { description: 'USD price. Minimum $5.' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'whatsIncluded',
      type: 'array',
      fields: [{ name: 'item', type: 'text' }],
    },
    {
      name: 'demoUrl',
      type: 'text',
    },
    {
      name: 'creatorName',
      type: 'text',
      required: true,
    },
    {
      name: 'creatorEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'payoutEmail',
      type: 'email',
    },
    {
      name: 'payoutMethod',
      type: 'select',
      options: [
        { label: 'PayPal', value: 'paypal' },
        { label: 'Stripe', value: 'stripe' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Live', value: 'live' },
      ],
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: { description: 'Stripe Price ID after product is set up in Stripe (populated after approval)' },
    },
    {
      name: 'reviewerNotes',
      type: 'textarea',
    },
  ],
  timestamps: true,
}
