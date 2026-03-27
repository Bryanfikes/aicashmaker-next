import type { CollectionConfig } from 'payload'

export const SideHustles: CollectionConfig = {
  slug: 'side-hustles',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'difficulty', 'incomeLow', 'incomeHigh', 'published'],
  },
  access: {
    read: () => true,
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
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
    },
    {
      name: 'emoji',
      type: 'text',
      admin: { description: 'Emoji icon e.g. ✍️' },
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
    },
    {
      name: 'incomeLow',
      type: 'number',
      required: true,
      admin: { description: 'Monthly USD low end' },
    },
    {
      name: 'incomeHigh',
      type: 'number',
      required: true,
      admin: { description: 'Monthly USD high end' },
    },
    {
      name: 'timeToFirstDollar',
      type: 'text',
      admin: { description: 'e.g. "1–2 weeks"' },
    },
    {
      name: 'startupCost',
      type: 'text',
      admin: { description: 'e.g. "$0" or "$20/mo"' },
    },
    {
      name: 'timeCommitment',
      type: 'text',
      admin: { description: 'e.g. "5–10 hours/week"' },
    },
    {
      name: 'heroStats',
      type: 'array',
      label: 'Hero stat cards',
      maxRows: 4,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Step-by-step guide',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'richText' },
      ],
    },
    {
      name: 'toolsNeeded',
      type: 'relationship',
      relationTo: 'tools',
      hasMany: true,
      label: 'Tools needed',
    },
    {
      name: 'proTips',
      type: 'array',
      fields: [
        { name: 'icon', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'body', type: 'textarea' },
      ],
    },
    {
      name: 'incomeTable',
      type: 'array',
      label: 'Income breakdown table rows',
      fields: [
        { name: 'stage', type: 'text' },
        { name: 'volume', type: 'text' },
        { name: 'rate', type: 'text' },
        { name: 'monthlyIncome', type: 'text' },
        { name: 'hoursPerWeek', type: 'number' },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Full guide content',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}
