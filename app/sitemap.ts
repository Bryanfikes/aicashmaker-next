import { MetadataRoute } from 'next'
import { getPayload } from '@/lib/payload'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aicashmaker.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let tools: { docs: any[] } = { docs: [] }
  let blogPosts: { docs: any[] } = { docs: [] }
  let sideHustles: { docs: any[] } = { docs: [] }

  try {
    const payload = await getPayload()
    ;[tools, blogPosts, sideHustles] = await Promise.all([
      payload.find({ collection: 'tools', where: { published: { equals: true } }, limit: 1000, depth: 0 }),
      payload.find({ collection: 'blog-posts', where: { published: { equals: true } }, limit: 1000, depth: 0 }),
      payload.find({ collection: 'side-hustles', where: { published: { equals: true } }, limit: 1000, depth: 0 }),
    ])
  } catch {
    // No DB at build time — return static pages only
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/tools`,               lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/side-hustles`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/prompts`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/automations`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/blog`,                lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/deals`,               lastModified: new Date(), changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE_URL}/about`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/newsletter`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/submit-tool`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/submit-product`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/advertise`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/affiliate-disclosure`,lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE_URL}/privacy`,             lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE_URL}/terms`,               lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
  ]

  const toolPages: MetadataRoute.Sitemap = tools.docs.map((tool: any) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: new Date(tool.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const blogPages: MetadataRoute.Sitemap = blogPosts.docs.map((post: any) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const sideHustlePages: MetadataRoute.Sitemap = sideHustles.docs.map((hustle: any) => ({
    url: `${BASE_URL}/side-hustles/${hustle.slug}`,
    lastModified: new Date(hustle.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...toolPages, ...blogPages, ...sideHustlePages]
}

export const dynamic = 'force-dynamic'
