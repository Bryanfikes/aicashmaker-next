import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'icon', 'toolCount'],
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
      admin: { description: 'URL-safe identifier, e.g. ai-writing' },
    },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Emoji or icon identifier, e.g. ✍️' },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'toolCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, description: 'Auto-calculated' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show on homepage category grid',
    },
  ],
  timestamps: true,
}
