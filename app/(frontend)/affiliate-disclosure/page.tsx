import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — AICashMaker',
  description: 'AICashMaker affiliate disclosure. We may earn commissions from qualifying purchases through links on this site.',
}

export default function AffiliateDisclosurePage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">Affiliate Disclosure</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Affiliate Disclosure</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: March 2025</p>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-600">

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h2 className="text-base font-extrabold text-slate-900 mb-2">Summary</h2>
            <p>AICashMaker participates in affiliate programs. When you click certain links on this site and make a purchase, we may earn a commission at <strong>no additional cost to you</strong>. This helps us keep the site free and continue creating content.</p>
          </div>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">What Is an Affiliate Link?</h2>
            <p>An affiliate link is a specially tracked URL that credits AICashMaker when a visitor clicks through and completes a qualifying action (usually a purchase or signup). The price you pay is identical to the standard price — we do not add any fees or markups.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">Which Programs We Participate In</h2>
            <p>AICashMaker has affiliate relationships with many of the AI tools, software platforms, and services we review and recommend. These include but are not limited to:</p>
            <ul className="list-disc list-inside space-y-1 mt-3">
              {['Jasper AI', 'Surfer SEO', 'ElevenLabs', 'Midjourney', 'Writesonic', 'Pictory', 'Copy.ai', 'HeyGen', 'Notion AI', 'Various other AI tools and platforms'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">How This Affects Our Reviews</h2>
            <p>We maintain strict editorial independence. The existence of an affiliate relationship does not influence whether a tool receives a positive or negative review. We have declined affiliate deals with tools we don't recommend, and we have recommended tools with no affiliate relationship at all.</p>
            <p className="mt-3">Our goal is to provide accurate, useful information that helps our readers make good decisions. If a tool isn't worth it, we say so — regardless of any financial relationship.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">FTC Compliance</h2>
            <p>In accordance with the Federal Trade Commission (FTC) guidelines, we disclose our affiliate relationships. When a page or article contains affiliate links, it is indicated at the top of that page. This disclosure page serves as a site-wide notice of our affiliate practices.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">Questions?</h2>
            <p>If you have questions about our affiliate relationships or editorial policies, please <Link href="/contact" className="text-sky-500 underline">contact us</Link>.</p>
          </section>

        </div>
      </div>
    </>
  )
}
