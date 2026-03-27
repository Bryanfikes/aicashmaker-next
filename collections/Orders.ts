import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'stripeSessionId',
    group: 'Marketplace',
    defaultColumns: ['orderType', 'buyerEmail', 'amount', 'status', 'createdAt'],
  },
  access: {
    read: () => false, // admin only
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'orderType',
      type: 'select',
      required: true,
      options: [
        { label: 'Product Purchase', value: 'product' },
        { label: 'Featured Listing', value: 'featured-listing' },
        { label: 'Newsletter Sponsorship', value: 'newsletter-sponsorship' },
        { label: 'Full Review', value: 'full-review' },
        { label: 'Advertising Bundle', value: 'bundle' },
      ],
    },
    {
      name: 'buyerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'buyerName',
      type: 'text',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      admin: { description: 'Only set for product purchases' },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      admin: { description: 'Amount in cents (e.g. 2900 = $29.00)' },
    },
    {
      name: 'platformFee',
      type: 'number',
      admin: { description: 'Platform 20% fee in cents' },
    },
    {
      name: 'creatorPayout',
      type: 'number',
      admin: { description: 'Creator 80% payout in cents' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Fulfilled', value: 'fulfilled' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
    },
    {
      name: 'downloadSentAt',
      type: 'date',
      admin: { description: 'When download link was emailed to buyer' },
    },
    {
      name: 'advertisingDetails',
      type: 'group',
      admin: { description: 'Only for advertising orders', condition: (data) => data.orderType !== 'product' },
      fields: [
        { name: 'companyName', type: 'text' },
        { name: 'toolName', type: 'text' },
        { name: 'websiteUrl', type: 'text' },
        { name: 'notes', type: 'textarea' },
      ],
    },
  ],
  timestamps: true,
}
