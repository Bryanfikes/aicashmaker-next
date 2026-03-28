import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tools } from './collections/Tools'
import { BlogPosts } from './collections/BlogPosts'
import { SideHustles } from './collections/SideHustles'
import { Deals } from './collections/Deals'
import { Creators } from './collections/Creators'
import { Categories } from './collections/Categories'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { ToolSubmissions } from './collections/ToolSubmissions'
import { ProductSubmissions } from './collections/ProductSubmissions'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— AICashMaker Admin',
    },
  },
  collections: [
    Users,
    Media,
    Tools,
    BlogPosts,
    SideHustles,
    Deals,
    Creators,
    Categories,
    NewsletterSubscribers,
    ToolSubmissions,
    ProductSubmissions,
    Products,
    Orders,
  ],
  editor: lexicalEditor(),
  sharp,
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-change-me-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
    },
  }),
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
  cors: [process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
})
