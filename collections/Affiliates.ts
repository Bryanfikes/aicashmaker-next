import type { CollectionConfig } from 'payload'

export const Affiliates: CollectionConfig = {
  slug: 'affiliates',
  admin: {
    useAsTitle: 'displayName',
    group: 'Affiliates',
    defaultColumns: ['displayName', 'referralCode', 'commissionRate', 'totalEarned', 'status'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'super-admin') return true
      // Affiliates can read their own doc
      return {
        id: {
          equals:
            req.user?.role === 'affiliate' && typeof req.user.affiliate === 'object'
              ? req.user.affiliate?.id
              : req.user?.affiliate,
        },
      }
    },
    create: ({ req }) => req.user?.role === 'super-admin',
    update: ({ req }) => {
      if (req.user?.role === 'super-admin') return true
      return {
        id: {
          equals:
            req.user?.role === 'affiliate' && typeof req.user.affiliate === 'object'
              ? req.user.affiliate?.id
              : req.user?.affiliate,
        },
      }
    },
    delete: ({ req }) => req.user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      required: true,
    },
    {
      name: 'referralCode',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Unique code appended to links: ?ref=CODE' },
    },
    {
      name: 'commissionRate',
      type: 'number',
      required: true,
      defaultValue: 30,
      admin: { description: 'Commission percentage (e.g. 30 = 30%)' },
    },
    {
      name: 'payoutEmail',
      type: 'email',
      admin: { description: 'PayPal or payment email for payouts' },
    },
    {
      name: 'payoutMethod',
      type: 'select',
      options: [
        { label: 'PayPal', value: 'paypal' },
        { label: 'Bank Transfer', value: 'bank' },
        { label: 'Stripe', value: 'stripe' },
      ],
      defaultValue: 'paypal',
    },
    {
      name: 'totalClicks',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lifetime referral link clicks' },
    },
    {
      name: 'totalConversions',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lifetime sales attributed to this affiliate' },
    },
    {
      name: 'totalEarned',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lifetime commission earned in cents' },
    },
    {
      name: 'totalPaid',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Total amount paid out in cents' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Pending Approval', value: 'pending' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal admin notes' },
    },
  ],
  timestamps: true,
}
