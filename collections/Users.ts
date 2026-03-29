import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
        { label: 'Creator', value: 'creator' },
        { label: 'Customer', value: 'customer' },
        { label: 'Affiliate', value: 'affiliate' },
      ],
      defaultValue: 'customer',
      required: true,
    },
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'creators',
      admin: {
        description: 'Linked creator profile (for creator role users)',
        condition: (data) => data.role === 'creator',
      },
    },
    {
      name: 'affiliate',
      type: 'relationship',
      relationTo: 'affiliates',
      admin: {
        description: 'Linked affiliate profile (for affiliate role users)',
        condition: (data) => data.role === 'affiliate',
      },
    },
  ],
  timestamps: true,
}
