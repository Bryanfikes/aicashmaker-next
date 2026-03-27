import type { CollectionConfig } from 'payload'

export const ToolSubmissions: CollectionConfig = {
  slug: 'tool-submissions',
  admin: {
    useAsTitle: 'toolName',
    group: 'Submissions',
    defaultColumns: ['toolName', 'category', 'submitterEmail', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'toolName',
      type: 'text',
      required: true,
    },
    {
      name: 'toolUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'affiliateLink',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        'AI Writing', 'AI Image', 'AI Video', 'AI Voice', 'AI Marketing',
        'AI SEO', 'AI Automation', 'AI Sales', 'AI Chatbots', 'AI Coding',
        'AI Design', 'AI Productivity', 'AI Lead Gen', 'AI Social Media', 'AI E-commerce',
      ].map(v => ({ label: v, value: v })),
    },
    {
      name: 'pricingModel',
      type: 'select',
      options: ['Free', 'Freemium', 'Paid', 'Enterprise'].map(v => ({ label: v, value: v })),
    },
    {
      name: 'price',
      type: 'text',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
    },
    {
      name: 'fullDescription',
      type: 'textarea',
    },
    {
      name: 'logoUrl',
      type: 'text',
    },
    {
      name: 'submitterName',
      type: 'text',
    },
    {
      name: 'submitterEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'featuredUpgrade',
      type: 'checkbox',
      defaultValue: false,
      label: 'Requested featured upgrade ($49/mo)',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'reviewerNotes',
      type: 'textarea',
      admin: { description: 'Internal notes from reviewer' },
    },
  ],
  timestamps: true,
}
