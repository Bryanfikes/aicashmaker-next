import { getPayload } from 'payload'
import config from '../payload.config'

const TOOL_LINKS: Record<string, string> = {
  'chatgpt-plus':  'https://chat.openai.com/',
  'midjourney':    'https://www.midjourney.com/',
  'claude-pro':    'https://claude.ai/',
  'elevenlabs':    'https://elevenlabs.io/',
  'jasper-ai':     'https://www.jasper.ai/',
  'heygen':        'https://www.heygen.com/',
  'surfer-seo':    'https://surferseo.com/',
  'canva-ai':      'https://www.canva.com/',
  'notion-ai':     'https://www.notion.so/',
}

async function run() {
  const payload = await getPayload({ config })

  for (const [slug, url] of Object.entries(TOOL_LINKS)) {
    const result = await payload.find({
      collection: 'tools',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const tool = result.docs[0]
    if (!tool) {
      console.log(`⚠️  Not found: ${slug}`)
      continue
    }

    await payload.update({
      collection: 'tools',
      id: tool.id,
      data: { affiliateLink: url },
    })

    console.log(`✅  ${tool.name} → ${url}`)
  }

  console.log('\nDone.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
