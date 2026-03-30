import type { CollectionConfig } from 'payload'

export const Prompts: CollectionConfig = {
  slug: 'prompts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'model', 'category', 'price', 'published'],
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
      admin: { description: 'Shown in cards and meta description (max 200 chars)' },
    },
    {
      name: 'model',
      type: 'select',
      required: true,
      options: [
        { label: 'ChatGPT', value: 'ChatGPT' },
        { label: 'Claude', value: 'Claude' },
        { label: 'Midjourney', value: 'Midjourney' },
        { label: 'Gemini', value: 'Gemini' },
        { label: 'Multiple', value: 'Multiple' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        'Copywriting', 'Business', 'Marketing', 'SEO', 'Content',
        'Freelancing', 'Writing', 'Art & Design', 'Education',
        'Ecommerce', 'Tutorials',
      ].map(v => ({ label: v, value: v })),
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: { description: 'Price in USD (e.g. 29 for $29)' },
    },
    {
      name: 'promptCount',
      type: 'text',
      admin: { description: 'e.g. "85 prompts" or "500+ prompts"' },
    },
    {
      name: 'difficulty',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' },
      ],
      defaultValue: 'Beginner',
    },
    {
      name: 'rating',
      type: 'number',
      admin: { description: 'Rating out of 5 (e.g. 4.9)' },
    },
    {
      name: 'reviewCount',
      type: 'text',
      admin: { description: 'e.g. "847" or "1,204"' },
    },
    {
      name: 'creatorName',
      type: 'text',
      defaultValue: 'AICashMaker Editorial',
    },
    {
      name: 'featuredImageGradient',
      type: 'text',
      admin: { description: 'CSS gradient, e.g. linear-gradient(135deg,#8b5cf6,#7c3aed)' },
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
      admin: { description: 'Show in Featured Packs section' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}
