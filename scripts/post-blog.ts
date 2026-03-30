/**
 * Blog post automation script
 * Usage: npx tsx scripts/post-blog.ts --title "..." --slug "..." --excerpt "..." --category "..." --html-file "/path/to/content.html" [--read-time 8]
 *
 * Categories: AI Side Hustles | AI Tools | Best AI Tools | AI SEO | AI Automation | AI Marketing | Tutorials | Income Reports
 */

import { config as dotenvConfig } from 'dotenv'
import { expand } from 'dotenv-expand'
import path from 'path'
import fs from 'fs'

expand(dotenvConfig({ path: path.resolve(process.cwd(), '.env.local') }))
expand(dotenvConfig({ path: path.resolve(process.cwd(), '.env') }))

import { getPayload } from 'payload'
import config from '../payload.config'

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Minimal valid empty Lexical state for the required body field
const EMPTY_LEXICAL_STATE = {
  root: {
    children: [{ children: [], direction: null, format: '', indent: 0, type: 'paragraph', version: 1 }],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
}

// Gradient palette — cycles based on slug hash
const GRADIENTS = [
  'linear-gradient(135deg,#0ea5e9,#0284c7)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#8b5cf6,#7c3aed)',
  'linear-gradient(135deg,#f97316,#ea580c)',
  'linear-gradient(135deg,#ec4899,#db2777)',
  'linear-gradient(135deg,#f59e0b,#d97706)',
  'linear-gradient(135deg,#6366f1,#4f46e5)',
  'linear-gradient(135deg,#14b8a6,#0d9488)',
]

function pickGradient(slug: string): string {
  const hash = slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return GRADIENTS[hash % GRADIENTS.length]
}

async function run() {
  const title = arg('title')
  const excerpt = arg('excerpt')
  const category = arg('category') || 'AI Tools'
  const htmlFile = arg('html-file')
  const readTime = parseInt(arg('read-time') || '7', 10)
  const authorName = arg('author-name') || 'AICashMaker Editorial'
  let slug = arg('slug') || (title ? slugify(title) : '')

  if (!title || !excerpt || !htmlFile) {
    console.error('\n❌  Missing required args: --title, --excerpt, --html-file\n')
    console.error('Example:')
    console.error('  npx tsx scripts/post-blog.ts \\')
    console.error('    --title "10 Ways to Make Money with ChatGPT" \\')
    console.error('    --slug "10-ways-to-make-money-with-chatgpt" \\')
    console.error('    --excerpt "From freelance writing to SaaS, here are the top ways..." \\')
    console.error('    --category "AI Side Hustles" \\')
    console.error('    --html-file /tmp/post-content.html \\')
    console.error('    --read-time 8\n')
    process.exit(1)
  }

  if (!fs.existsSync(htmlFile)) {
    console.error(`\n❌  HTML file not found: ${htmlFile}\n`)
    process.exit(1)
  }

  const contentHtml = fs.readFileSync(htmlFile, 'utf-8')

  console.log(`\n📝  Posting: "${title}"`)
  console.log(`   Slug:     ${slug}`)
  console.log(`   Category: ${category}`)
  console.log(`   Read time: ${readTime} min`)

  const payload = await getPayload({ config })

  // Get admin user to satisfy author field
  const users = await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
  if (users.totalDocs === 0) {
    console.error('\n❌  No users found. Run scripts/seed-admin.ts first.\n')
    process.exit(1)
  }
  const adminUser = users.docs[0]

  // Check for slug collision and auto-increment if needed
  const existing = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.totalDocs > 0) {
    slug = `${slug}-${Date.now()}`
    console.log(`   ⚠️  Slug collision — using: ${slug}`)
  }

  const post = await payload.create({
    collection: 'blog-posts',
    data: {
      title,
      slug,
      excerpt,
      category: category as any,
      authorName,
      author: adminUser.id,
      body: EMPTY_LEXICAL_STATE as any,
      contentHtml,
      featuredImageGradient: pickGradient(slug),
      readTimeMinutes: readTime,
      published: true,
      publishedAt: new Date().toISOString(),
    },
    overrideAccess: true,
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aicashmaker.com'
  console.log(`\n✅  Published!`)
  console.log(`   ID:   ${post.id}`)
  console.log(`   Live: ${siteUrl}/blog/${slug}\n`)

  process.exit(0)
}

run().catch((err) => {
  console.error('❌  Failed:', err)
  process.exit(1)
})
