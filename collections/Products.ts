import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Marketplace',
    defaultColumns: ['name', 'type', 'price', 'creator', 'approved', 'salesCount'],
  },
  access: {
    read: ({ doc }) => {
      if (!doc) return true
      return doc.approved === true
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-friendly identifier' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Prompt Pack', value: 'prompt-pack' },
        { label: 'AI Template', value: 'template' },
        { label: 'Course', value: 'course' },
        { label: 'Automation', value: 'automation' },
        { label: 'Digital Tool', value: 'digital-tool' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'aiPlatform',
      type: 'select',
      options: [
        { label: 'ChatGPT', value: 'ChatGPT' },
        { label: 'Midjourney', value: 'Midjourney' },
        { label: 'Claude', value: 'Claude' },
        { label: 'Gemini', value: 'Gemini' },
        { label: 'Multiple', value: 'Multiple' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'whatsIncluded',
      type: 'array',
      fields: [{ name: 'item', type: 'text' }],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'demoUrl',
      type: 'text',
      admin: { description: 'Preview or demo link' },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 5,
      admin: { description: 'Price in USD' },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: { description: 'Stripe Price ID — auto-created on approve', readOnly: true },
    },
    {
      name: 'stripeProductId',
      type: 'text',
      admin: { description: 'Stripe Product ID — auto-created on approve', readOnly: true },
    },
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'creators',
      required: true,
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      label: 'Approved for marketplace',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'salesCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'downloadUrl',
      type: 'text',
      admin: { description: 'Sent to buyer after purchase (internal — never public)' },
    },
  ],
  timestamps: true,
}
