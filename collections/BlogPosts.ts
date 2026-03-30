import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'author', 'category', 'publishedAt', 'published'],
    listSearchableFields: ['title', 'excerpt'],
    pagination: { defaultLimit: 20 },
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
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'featuredImageGradient',
      type: 'text',
      admin: { description: 'CSS gradient fallback, e.g. linear-gradient(135deg,#0ea5e9,#7c3aed)' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        'AI Side Hustles', 'AI Tools', 'Best AI Tools', 'AI SEO',
        'AI Automation', 'AI Marketing', 'Tutorials', 'Income Reports',
      ].map(v => ({ label: v, value: v })),
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'authorName',
      type: 'text',
      admin: { description: 'Display name override (if different from user name)' },
    },
    {
      name: 'readTimeMinutes',
      type: 'number',
      defaultValue: 5,
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'contentHtml',
      type: 'textarea',
      admin: {
        description: 'Auto-generated HTML content — used instead of the rich text body when present. Do not edit manually.',
        rows: 10,
      },
    },
    {
      name: 'toolsMentioned',
      type: 'relationship',
      relationTo: 'tools',
      hasMany: true,
      admin: { description: 'Tools referenced in this article (shown in sidebar)' },
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'blog-posts',
      hasMany: true,
    },
    {
      name: 'metaTitle',
      type: 'text',
      admin: { description: 'SEO title override (defaults to post title)' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: { description: 'SEO meta description' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
  timestamps: true,
}
