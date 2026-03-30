/**
 * Seed all 20 prompt packs into the database.
 * Usage: NEXT_PUBLIC_SITE_URL=https://www.aicashmaker.com npx tsx scripts/seed-prompts.ts
 */

import { config as dotenvConfig } from 'dotenv'
import { expand } from 'dotenv-expand'
import path from 'path'
import fs from 'fs'

expand(dotenvConfig({ path: path.resolve(process.cwd(), '.env.local') }))
expand(dotenvConfig({ path: path.resolve(process.cwd(), '.env') }))

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aicashmaker.com'
const ADMIN_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL || 'admin@aicashmaker.com'
const ADMIN_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD || ''

const GRADIENTS = [
  'linear-gradient(135deg,#f97316,#ea580c)',
  'linear-gradient(135deg,#a855f7,#9333ea)',
  'linear-gradient(135deg,#ec4899,#db2777)',
  'linear-gradient(135deg,#0ea5e9,#0284c7)',
  'linear-gradient(135deg,#6366f1,#4f46e5)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#d97706)',
  'linear-gradient(135deg,#8b5cf6,#7c3aed)',
  'linear-gradient(135deg,#14b8a6,#0d9488)',
  'linear-gradient(135deg,#06b6d4,#0891b2)',
]

function pickGradient(slug: string): string {
  const hash = slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return GRADIENTS[hash % GRADIENTS.length]
}

const PACKS = [
  { slug: 'ultimate-chatgpt-business-bundle',   title: 'Ultimate ChatGPT Business Bundle',    model: 'Multiple',    category: 'Business',    price: 97,  promptCount: '500+ prompts', difficulty: 'Beginner',     rating: 4.9, reviewCount: '1,247', creatorName: 'AICashMaker Editorial', featured: true,  excerpt: '500+ prompts for sales, marketing, copywriting, HR, legal, and finance. The only pack you\'ll ever need for running a business with AI.' },
  { slug: 'midjourney-mastery-pack',             title: 'Midjourney Mastery Pack',             model: 'Midjourney',  category: 'Art & Design',price: 49,  promptCount: '300+ prompts', difficulty: 'Intermediate', rating: 4.8, reviewCount: '623',   creatorName: 'AICashMaker Editorial', featured: true,  excerpt: 'The complete system for generating stunning, commercial-quality images every time. Includes style guides, lighting formulas, and composition blueprints.' },
  { slug: 'ai-freelancer-starter-kit',           title: 'AI Freelancer Starter Kit',           model: 'Multiple',    category: 'Freelancing', price: 29,  promptCount: '200+ prompts', difficulty: 'Beginner',     rating: 4.9, reviewCount: '2,103', creatorName: 'AICashMaker Editorial', featured: true,  excerpt: 'Everything a freelancer needs to deliver faster and charge more — prompts for proposals, client emails, content, SEO, design briefs, and cold outreach.' },
  { slug: 'high-converting-sales-page-pack',     title: 'High-Converting Sales Page Pack',     model: 'ChatGPT',     category: 'Copywriting', price: 29,  promptCount: '85 prompts',   difficulty: 'Beginner',     rating: 4.9, reviewCount: '847',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Complete prompt system for writing sales pages, VSLs, and email sequences that convert. Used by 2,000+ copywriters worldwide.' },
  { slug: 'seo-blog-content-system',             title: 'SEO Blog Content System',             model: 'ChatGPT',     category: 'SEO',         price: 19,  promptCount: '45 prompts',   difficulty: 'Beginner',     rating: 4.7, reviewCount: '1,204', creatorName: 'AICashMaker Editorial', featured: false, excerpt: '90-day content calendar system with research prompts, outline generators, and full article writers optimized for Google rankings.' },
  { slug: 'social-media-growth-pack',            title: 'Social Media Growth Pack',            model: 'Multiple',    category: 'Marketing',   price: 24,  promptCount: '180 prompts',  difficulty: 'Beginner',     rating: 4.8, reviewCount: '934',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Platform-specific prompt packs for Instagram, LinkedIn, X/Twitter, and TikTok. Includes hooks, captions, scripts, and content calendars.' },
  { slug: 'cold-email-outreach-system',          title: 'Cold Email & Outreach System',        model: 'ChatGPT',     category: 'Freelancing', price: 29,  promptCount: '75 prompts',   difficulty: 'Beginner',     rating: 4.9, reviewCount: '2,103', creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'High-response cold email templates, follow-up sequences, LinkedIn messages, and proposal frameworks for freelancers and agencies.' },
  { slug: 'executive-strategy-pack',             title: 'Executive Strategy Pack',             model: 'Claude',      category: 'Business',    price: 49,  promptCount: '60 prompts',   difficulty: 'Intermediate', rating: 4.9, reviewCount: '412',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Prompts for strategic planning, competitive analysis, investor memos, board presentations, and executive communication.' },
  { slug: 'fiction-storytelling-pack',           title: 'Fiction & Storytelling Pack',         model: 'Claude',      category: 'Writing',     price: 22,  promptCount: '110 prompts',  difficulty: 'Beginner',     rating: 4.7, reviewCount: '389',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Character development, world-building, plot structuring, and scene-writing prompts for novelists, screenwriters, and content creators.' },
  { slug: 'course-creator-toolkit',              title: 'Course Creator Toolkit',              model: 'Multiple',    category: 'Education',   price: 44,  promptCount: '95 prompts',   difficulty: 'Intermediate', rating: 4.8, reviewCount: '756',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'End-to-end prompts for building online courses: curriculum design, lesson scripts, quiz creation, marketing copy, and sales pages.' },
  { slug: 'photorealistic-portrait-masterclass', title: 'Photorealistic Portrait Masterclass', model: 'Midjourney',  category: 'Art & Design',price: 39,  promptCount: '120 prompts',  difficulty: 'Intermediate', rating: 4.8, reviewCount: '623',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'The exact prompt formulas for generating magazine-quality portraits with perfect lighting, skin texture, and mood control.' },
  { slug: 'product-photography-prompts',         title: 'Product Photography Prompts',         model: 'Midjourney',  category: 'Ecommerce',   price: 34,  promptCount: '95 prompts',   difficulty: 'Beginner',     rating: 4.6, reviewCount: '567',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Create stunning product mockups without a photographer. Includes lifestyle shots, white backgrounds, and brand-specific style guides.' },
  { slug: 'youtube-content-creator-pack',        title: 'YouTube Content Creator Pack',        model: 'ChatGPT',     category: 'Content',     price: 29,  promptCount: '70 prompts',   difficulty: 'Beginner',     rating: 4.7, reviewCount: '531',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Scripts, titles, thumbnails, SEO descriptions, and community post templates for YouTube creators who want to grow faster with AI.' },
  { slug: 'linkedin-thought-leadership-pack',    title: 'LinkedIn Thought Leadership Pack',    model: 'Claude',      category: 'Marketing',   price: 19,  promptCount: '55 prompts',   difficulty: 'Beginner',     rating: 4.8, reviewCount: '728',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Build a powerful LinkedIn presence and attract inbound leads with hooks, carousels, comment templates, and viral post frameworks.' },
  { slug: 'ecommerce-conversion-copywriter',     title: 'E-commerce Conversion Copywriter',   model: 'ChatGPT',     category: 'Ecommerce',   price: 34,  promptCount: '80 prompts',   difficulty: 'Beginner',     rating: 4.7, reviewCount: '612',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Product descriptions, collection pages, ad copy, email flows, and abandoned cart sequences that convert browsers into buyers.' },
  { slug: 'real-estate-agent-ai-kit',            title: 'Real Estate Agent AI Kit',            model: 'ChatGPT',     category: 'Business',    price: 39,  promptCount: '90 prompts',   difficulty: 'Beginner',     rating: 4.8, reviewCount: '489',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Listing descriptions, buyer presentations, email drip campaigns, and social content for real estate agents using AI to close more deals.' },
  { slug: 'newsletter-email-marketing-system',   title: 'Newsletter & Email Marketing System', model: 'Claude',      category: 'Marketing',   price: 24,  promptCount: '65 prompts',   difficulty: 'Beginner',     rating: 4.9, reviewCount: '834',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Subject lines, full email drafts, welcome sequences, weekly newsletter formats, and re-engagement campaigns optimized for open rates.' },
  { slug: 'ai-code-dev-toolkit',                 title: 'AI Code & Dev Toolkit',               model: 'Claude',      category: 'Tutorials',   price: 29,  promptCount: '80 prompts',   difficulty: 'Intermediate', rating: 4.9, reviewCount: '1,056', creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Code review, debugging, architecture planning, documentation, test writing, and code refactoring prompts for developers using AI to ship faster.' },
  { slug: 'consulting-agency-proposal-pack',     title: 'Consulting & Agency Proposal Pack',   model: 'Claude',      category: 'Business',    price: 44,  promptCount: '55 prompts',   difficulty: 'Intermediate', rating: 4.8, reviewCount: '367',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Scope-of-work documents, discovery call scripts, proposal templates, case study frameworks, and retainer agreements for consultants and agencies.' },
  { slug: 'podcast-content-creator-pack',        title: 'Podcast Content Creator Pack',        model: 'ChatGPT',     category: 'Content',     price: 19,  promptCount: '50 prompts',   difficulty: 'Beginner',     rating: 4.6, reviewCount: '298',   creatorName: 'AICashMaker Editorial', featured: false, excerpt: 'Episode outlines, show notes, guest questions, social clips, email announcements, and listener growth strategies for podcasters.' },
]

async function login(): Promise<string> {
  const res = await fetch(`${SITE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const data = await res.json() as { token?: string; errors?: any[] }
  if (!data.token) throw new Error(`Login failed: ${JSON.stringify(data)}`)
  return data.token
}

async function run() {
  console.log(`\n🚀  Seeding ${PACKS.length} prompt packs to ${SITE_URL}\n`)

  if (!ADMIN_PASSWORD) {
    console.error('❌  Set PAYLOAD_ADMIN_PASSWORD env var')
    process.exit(1)
  }

  const token = await login()
  console.log('✓ Logged in\n')

  let created = 0
  let skipped = 0
  let failed = 0

  for (const pack of PACKS) {
    const htmlFile = `/tmp/prompt-${pack.slug}.html`
    const contentHtml = fs.existsSync(htmlFile) ? fs.readFileSync(htmlFile, 'utf-8') : null

    // Check if exists
    const checkRes = await fetch(
      `${SITE_URL}/api/prompts?where%5Bslug%5D%5Bequals%5D=${pack.slug}&limit=1`,
      { headers: { Authorization: `JWT ${token}` } }
    )
    const checkData = await checkRes.json() as { totalDocs: number; docs: { id: string }[] }

    if (checkData.totalDocs > 0) {
      // Update contentHtml if we have it
      if (contentHtml) {
        const patchRes = await fetch(`${SITE_URL}/api/prompts/${checkData.docs[0].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
          body: JSON.stringify({ contentHtml }),
        })
        if (patchRes.ok) {
          console.log(`  ↺  Updated HTML: ${pack.slug}`)
        }
      } else {
        console.log(`  ⏭  Skipping (exists): ${pack.slug}`)
      }
      skipped++
      continue
    }

    const res = await fetch(`${SITE_URL}/api/prompts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify({
        ...pack,
        contentHtml: contentHtml || null,
        featuredImageGradient: pickGradient(pack.slug),
        published: true,
      }),
    })

    const data = await res.json() as { doc?: { id: string }; errors?: any[] }

    if (!res.ok || data.errors) {
      console.error(`  ❌  Failed: ${pack.slug}`)
      console.error('     ', JSON.stringify(data.errors || data).slice(0, 200))
      failed++
    } else {
      const htmlStatus = contentHtml ? '✓ HTML' : '(no HTML)'
      console.log(`  ✅  Created: ${pack.slug} ${htmlStatus}`)
      created++
    }
  }

  console.log(`\n📊  Done: ${created} created · ${skipped} skipped · ${failed} failed\n`)
}

run().catch(err => {
  console.error('❌  Fatal:', err.message || err)
  process.exit(1)
})
