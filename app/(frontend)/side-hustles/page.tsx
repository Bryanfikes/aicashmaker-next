import { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'AI Side Hustle Guides — Make $2k–$30k/Month with AI',
  description: 'Step-by-step blueprints for starting profitable AI side hustles. From AI content writing to automation consulting — with real income ranges.',
}

export const revalidate = 3600

const FALLBACK_HUSTLES = [
  { id: '1', slug: 'ai-content-writing', name: 'AI Content Writing', tagline: 'Write 10x faster and charge premium rates with AI', icon: '✍️', difficulty: 'beginner', incomeLow: 2000, incomeHigh: 8000, timeToFirstDollar: '1–2 weeks', startupCost: '$20/mo', gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)' },
  { id: '2', slug: 'ai-seo-agency', name: 'AI SEO Agency', tagline: 'Build a $5k–$20k/mo agency using AI-powered SEO tools', icon: '📈', difficulty: 'intermediate', incomeLow: 5000, incomeHigh: 20000, timeToFirstDollar: '2–4 weeks', startupCost: '$89/mo', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: '3', slug: 'ai-video-creation', name: 'AI Video Creation', tagline: 'Create faceless YouTube channels that earn while you sleep', icon: '🎬', difficulty: 'beginner', incomeLow: 3000, incomeHigh: 12000, timeToFirstDollar: '3–6 weeks', startupCost: '$49/mo', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  { id: '4', slug: 'ai-automation-consulting', name: 'AI Automation Consulting', tagline: 'Charge $150/hr to automate business workflows with AI', icon: '🤖', difficulty: 'advanced', incomeLow: 8000, incomeHigh: 30000, timeToFirstDollar: '1–2 weeks', startupCost: '$0', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { id: '5', slug: 'ai-social-media', name: 'AI Social Media Agency', tagline: 'Manage 10+ client accounts with AI-powered content systems', icon: '📱', difficulty: 'intermediate', incomeLow: 3000, incomeHigh: 10000, timeToFirstDollar: '2–3 weeks', startupCost: '$30/mo', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
  { id: '6', slug: 'ai-course-creation', name: 'AI Course Creation', tagline: 'Build and sell online courses 5x faster using AI tools', icon: '🎓', difficulty: 'intermediate', incomeLow: 2000, incomeHigh: 15000, timeToFirstDollar: '4–8 weeks', startupCost: '$49/mo', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  { id: '7', slug: 'prompt-engineering', name: 'Prompt Engineering', tagline: 'Package and sell AI prompts for $500–$5,000/month', icon: '💬', difficulty: 'beginner', incomeLow: 2000, incomeHigh: 15000, timeToFirstDollar: '1 week', startupCost: '$0', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  { id: '8', slug: 'ai-affiliate-marketing', name: 'AI Affiliate Marketing', tagline: 'Earn 30–40% recurring commission promoting AI tools', icon: '🔗', difficulty: 'beginner', incomeLow: 1000, incomeHigh: 10000, timeToFirstDollar: '2–4 weeks', startupCost: '$0', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
  { id: '9', slug: 'ai-image-selling', name: 'AI Image Selling', tagline: 'Sell AI artwork on Etsy, stock sites, and print-on-demand', icon: '🎨', difficulty: 'beginner', incomeLow: 500, incomeHigh: 5000, timeToFirstDollar: '1–2 weeks', startupCost: '$10/mo', gradient: 'linear-gradient(135deg, #e879f9, #d946ef)' },
  { id: '10', slug: 'ai-chatbot-building', name: 'AI Chatbot Building', tagline: 'Build custom AI chatbots for small businesses at $500–$2k each', icon: '💼', difficulty: 'intermediate', incomeLow: 3000, incomeHigh: 12000, timeToFirstDollar: '2–3 weeks', startupCost: '$20/mo', gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
]

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
}

async function getHustles() {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'side-hustles',
      where: { published: { equals: true } },
      limit: 50,
      sort: '-incomeHigh',
    })
    return result.docs
  } catch {
    return []
  }
}

export default async function SideHustlesPage() {
  const hustles = await getHustles()
  const displayHustles = hustles.length > 0 ? hustles : FALLBACK_HUSTLES

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white pt-12 pb-10 px-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">Side Hustles</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">AI Side Hustle Guides</h1>
          <p className="text-slate-500 text-base max-w-2xl">
            {displayHustles.length} proven ways to make money with AI — with real income ranges, startup costs, and step-by-step blueprints.
          </p>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
              <Link
                key={level}
                href={level === 'All' ? '/side-hustles' : `/side-hustles?level=${level.toLowerCase()}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors no-underline bg-white"
              >
                {level}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayHustles.map((hustle: any) => {
            const incomeRange = hustle.incomeLow && hustle.incomeHigh
              ? `$${hustle.incomeLow.toLocaleString()}–$${hustle.incomeHigh.toLocaleString()}/mo`
              : null
            const gradient = hustle.gradient || 'linear-gradient(135deg, #0ea5e9, #0284c7)'

            return (
              <Link
                key={hustle.id || hustle.slug}
                href={`/side-hustles/${hustle.slug}`}
                className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline"
              >
                {/* Gradient header */}
                <div
                  className="h-24 flex items-center justify-center text-4xl"
                  style={{ background: gradient }}
                >
                  {hustle.icon}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {hustle.name}
                    </h3>
                    {hustle.difficulty && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${DIFFICULTY_COLORS[hustle.difficulty] || ''}`}>
                        {hustle.difficulty}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{hustle.tagline}</p>

                  <div className="grid grid-cols-2 gap-3">
                    {incomeRange && (
                      <div className="bg-emerald-50 rounded-xl p-2.5">
                        <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-0.5">Income</div>
                        <div className="text-xs font-bold text-emerald-700">{incomeRange}</div>
                      </div>
                    )}
                    {hustle.timeToFirstDollar && (
                      <div className="bg-sky-50 rounded-xl p-2.5">
                        <div className="text-[10px] font-semibold text-sky-600 uppercase tracking-wide mb-0.5">First $</div>
                        <div className="text-xs font-bold text-sky-700">{hustle.timeToFirstDollar}</div>
                      </div>
                    )}
                    {hustle.startupCost !== undefined && (
                      <div className="bg-slate-50 rounded-xl p-2.5 col-span-2">
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Startup Cost</div>
                        <div className="text-xs font-bold text-slate-700">{hustle.startupCost}</div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
