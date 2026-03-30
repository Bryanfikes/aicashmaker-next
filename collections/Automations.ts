import type { CollectionConfig } from 'payload'

export const Automations: CollectionConfig = {
  slug: 'automations',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'platform', 'category', 'price', 'published'],
    listSearchableFields: ['title', 'excerpt'],
    pagination: { defaultLimit: 25 },
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'platform',
      type: 'select',
      required: true,
      options: [
        { label: 'Make.com', value: 'Make.com' },
        { label: 'Zapier', value: 'Zapier' },
        { label: 'n8n', value: 'n8n' },
        { label: 'Custom API', value: 'Custom API' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        'Lead Gen', 'Content', 'Social Media', 'Sales', 'E-commerce',
        'Marketing', 'Analytics', 'Support', 'Finance', 'HR',
      ].map(v => ({ label: v, value: v })),
    },
    {
      name: 'complexity',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' },
      ],
      defaultValue: 'Beginner',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: { description: 'Price in USD' },
    },
    {
      name: 'timeSaved',
      type: 'text',
      admin: { description: 'e.g. "10+ hours/month"' },
    },
    {
      name: 'setupTime',
      type: 'text',
      admin: { description: 'e.g. "30 minutes"' },
    },
    {
      name: 'features',
      type: 'array',
      fields: [{ name: 'feature', type: 'text' }],
      admin: { description: 'Key feature bullet points (shown on card)' },
    },
    {
      name: 'creatorName',
      type: 'text',
      defaultValue: 'AICashMaker Editorial',
    },
    {
      name: 'featuredImageGradient',
      type: 'text',
    },
    {
      name: 'contentHtml',
      type: 'textarea',
      admin: {
        description: 'Full detail page HTML content.',
        rows: 15,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}
