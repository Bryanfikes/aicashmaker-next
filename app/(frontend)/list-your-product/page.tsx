import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'List Your AI Product — AICashMaker',
  description: 'Get your AI tool, prompt pack, or coaching course in front of 10,000+ monthly buyers. Free basic listings. Featured upgrades available.',
}

const LISTING_TYPES = [
  {
    icon: '🛠️',
    gradient: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
    title: 'AI Tools',
    subtitle: 'Free basic · $199/mo featured',
    description: 'List your AI software, SaaS tool, or app. Reach buyers actively searching for tools to make money and grow their business.',
    perks: [
      'Free basic listing — live within 48 hours',
      'Featured badge + top placement for $199/mo',
      'Bring your own affiliate link',
      'Newsletter shoutout with featured tier',
    ],
    cta: 'Submit a Tool',
    href: '/submit-tool',
    ctaColor: 'bg-sky-500 hover:bg-sky-600',
  },
  {
    icon: '💬',
    gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
    title: 'AI Prompts',
    subtitle: '80% revenue share · you keep $4 of every $5',
    description: 'Sell your prompt packs, system prompts, and AI workflows in our marketplace. We handle payments, delivery, and customer support.',
    perks: [
      '80/20 revenue split — you keep 80%',
      'Works with ChatGPT, Claude, Midjourney & more',
      'Stripe payouts directly to you',
      'We handle checkout, delivery, and support',
    ],
    cta: 'List Your Prompts',
    href: '/submit-product',
    ctaColor: 'bg-violet-500 hover:bg-violet-600',
  },
  {
    icon: '🎓',
    gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
    title: 'Coaching Courses',
    subtitle: '80% revenue share · you keep $4 of every $5',
    description: 'Sell your AI coaching program, course, or workshop. We list it, market it, and process payments — you focus on teaching.',
    perks: [
      '80/20 revenue split — you keep 80%',
      'Course, cohort, and workshop formats welcome',
      'Stripe payouts directly to you',
      'Featured in AI education section',
    ],
    cta: 'List Your Course',
    href: '/submit-product',
    ctaColor: 'bg-amber-500 hover:bg-amber-600',
  },
]

const FAQS = [
  {
    q: 'How long does the review process take?',
    a: 'We review all submissions within 48 hours. You\'ll receive an email once your listing is live.',
  },
  {
    q: 'Is there a cost to get listed?',
    a: 'Basic tool listings are completely free. Product marketplace listings (prompts, courses) are free to submit — we only earn when you make a sale (20% platform fee). Featured tool placements are $199/month.',
  },
  {
    q: 'Who is the audience here?',
    a: 'Our 10,000+ monthly visitors are freelancers, agency owners, entrepreneurs, and side-hustlers actively searching for AI tools and resources to make money.',
  },
  {
    q: 'What happens after I submit?',
    a: 'Our team reviews your submission, approves it, and publishes it. For products, you\'ll receive a confirmation email with your listing URL. Featured listing customers are contacted to complete payment.',
  },
]

export default function ListYourProductPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">List Your Product</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-sky-950 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            10,000+ monthly buyers
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Get Listed on AICashMaker
          </h1>
          <p className="text-sky-200 text-base max-w-xl mx-auto">
            Reach an audience of freelancers, agency owners, and entrepreneurs actively searching for AI tools, prompts, and courses to grow their income.
          </p>
        </div>
      </section>

      {/* 3 listing type cards */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-xl font-extrabold text-slate-900 text-center mb-10">Choose Your Listing Type</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {LISTING_TYPES.map(({ icon, gradient, title, subtitle, description, perks, cta, href, ctaColor }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col">
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 flex-shrink-0"
                style={{ background: gradient }}
              >
                {icon}
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">{title}</h3>
              <p className="text-xs font-semibold text-slate-500 mb-3">{subtitle}</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{description}</p>
              <ul className="list-none p-0 m-0 space-y-2 mb-7 flex-1">
                {perks.map(perk => (
                  <li key={perk} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <Link
                href={href}
                className={`block text-center text-sm font-bold py-3 rounded-xl text-white transition-colors no-underline ${ctaColor}`}
              >
                {cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof strip */}
      <section className="bg-slate-50 border-y border-slate-100 py-10 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { stat: '10,000+', label: 'Monthly visitors' },
            { stat: '170+', label: 'Tools reviewed' },
            { stat: '48 hrs', label: 'Review turnaround' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat}</div>
              <div className="text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-xl font-extrabold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-sm font-bold text-slate-900 mb-2">{q}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-sky-500 to-sky-600 py-14 px-4 text-center mb-0">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white mb-3">Ready to get in front of buyers?</h2>
          <p className="text-sky-100 text-sm mb-7">Choose a listing type above and submit in under 5 minutes.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/submit-tool" className="inline-flex items-center text-sm font-bold px-5 py-2.5 rounded-xl bg-white text-sky-600 hover:bg-sky-50 transition-colors no-underline">
              Submit a Tool
            </Link>
            <Link href="/submit-product" className="inline-flex items-center text-sm font-bold px-5 py-2.5 rounded-xl bg-sky-700 text-white hover:bg-sky-800 transition-colors no-underline">
              List Prompts or Course
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
