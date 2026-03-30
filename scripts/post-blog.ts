/**
 * Blog post automation script — uses Payload REST API
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aicashmaker.com'
const ADMIN_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL || 'admin@aicashmaker.com'
const ADMIN_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD || 'ChangeMe123!'

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

const EMPTY_BODY = {
  root: {
    children: [
      {
        children: [
          { detail: 0, format: 0, mode: 'normal', style: '', text: ' ', type: 'text', version: 1 },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
}

async function login(): Promise<string> {
  const res = await fetch(`${SITE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const data = await res.json() as { token?: string; errors?: any[] }
  if (!data.token) {
    throw new Error(`Login failed: ${JSON.stringify(data)}`)
  }
  return data.token
}

async function run() {
  const title = arg('title')
  const excerpt = arg('excerpt')
  const category = arg('category') || 'AI Tools'
  const htmlFile = arg('html-file')
  const readTime = parseInt(arg('read-time') || '7', 10)
  const authorName = arg('author-name') || 'AICashMaker Editorial'
  const updateSlug = arg('update-slug') // PATCH mode: update existing post by slug
  let slug = arg('slug') || (title ? slugify(title) : '')

  if (!htmlFile) {
    console.error('\n❌  Missing required arg: --html-file\n')
    process.exit(1)
  }

  if (!updateSlug && (!title || !excerpt)) {
    console.error('\n❌  For new posts: --title, --excerpt, --html-file are required')
    console.error('    For updating existing posts: --update-slug, --html-file\n')
    process.exit(1)
  }

  if (!fs.existsSync(htmlFile)) {
    console.error(`\n❌  HTML file not found: ${htmlFile}\n`)
    process.exit(1)
  }

  const contentHtml = fs.readFileSync(htmlFile, 'utf-8')

  console.log(`\n📝  Mode: ${updateSlug ? `UPDATE (${updateSlug})` : `CREATE (${slug})`}`)
  console.log(`   Site: ${SITE_URL}`)

  // Authenticate
  console.log('\n🔐  Logging in...')
  const token = await login()
  console.log('   ✓ Token received')

  // PATCH mode — update existing post
  if (updateSlug) {
    const findRes = await fetch(
      `${SITE_URL}/api/blog-posts?where[slug][equals]=${updateSlug}&limit=1`,
      { headers: { Authorization: `JWT ${token}` } }
    )
    const findData = await findRes.json() as { docs: { id: string }[] }
    const post = findData.docs[0]
    if (!post) {
      console.error(`\n❌  No post found with slug: ${updateSlug}\n`)
      process.exit(1)
    }

    console.log(`\n📤  Patching post ID ${post.id}...`)
    const patchRes = await fetch(`${SITE_URL}/api/blog-posts/${post.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ contentHtml }),
    })
    const patchData = await patchRes.json() as { doc?: { id: string }; errors?: any[] }

    if (!patchRes.ok || patchData.errors) {
      console.error('\n❌  Failed to update post:')
      console.error(JSON.stringify(patchData, null, 2))
      process.exit(1)
    }

    console.log(`\n✅  Updated!`)
    console.log(`   Live: ${SITE_URL}/blog/${updateSlug}\n`)
    return
  }

  // CREATE mode
  console.log(`   Title:     ${title}`)
  console.log(`   Slug:      ${slug}`)
  console.log(`   Category:  ${category}`)
  console.log(`   Read time: ${readTime} min`)

  // Get admin user ID
  const usersRes = await fetch(`${SITE_URL}/api/users?limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const usersData = await usersRes.json() as { docs: { id: string }[] }
  const adminId = usersData.docs[0]?.id
  if (!adminId) throw new Error('No admin user found')

  // Check for slug collision
  const checkRes = await fetch(`${SITE_URL}/api/blog-posts?where[slug][equals]=${slug}&limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const checkData = await checkRes.json() as { totalDocs: number }
  if (checkData.totalDocs > 0) {
    slug = `${slug}-${Date.now()}`
    console.log(`   ⚠️  Slug collision — using: ${slug}`)
  }

  // Create the post
  console.log('\n📤  Creating post...')
  const createRes = await fetch(`${SITE_URL}/api/blog-posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      title,
      slug,
      excerpt,
      category,
      authorName,
      author: adminId,
      body: EMPTY_BODY,
      contentHtml,
      featuredImageGradient: pickGradient(slug),
      readTimeMinutes: readTime,
      published: true,
      publishedAt: new Date().toISOString(),
    }),
  })

  const post = await createRes.json() as { doc?: { id: string }; errors?: any[] }

  if (!createRes.ok || post.errors) {
    console.error('\n❌  Failed to create post:')
    console.error(JSON.stringify(post, null, 2))
    process.exit(1)
  }

  console.log(`\n✅  Published!`)
  console.log(`   ID:   ${post.doc?.id}`)
  console.log(`   Live: ${SITE_URL}/blog/${slug}\n`)
}

run().catch((err) => {
  console.error('❌  Failed:', err.message || err)
  process.exit(1)
})
