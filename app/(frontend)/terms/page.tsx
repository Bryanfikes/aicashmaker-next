import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — AICashMaker',
  description: 'AICashMaker terms of service. Rules for using our site, marketplace, and tools directory.',
}

export default function TermsPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">Terms of Service</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: March 2025</p>

        <div className="space-y-10 text-sm leading-relaxed text-slate-600">

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using AICashMaker ("the Site"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Site.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">2. Use of the Site</h2>
            <p className="mb-3">You may use the Site for lawful purposes only. You agree not to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Violate any applicable laws or regulations</li>
              <li>Submit false, misleading, or fraudulent content</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Attempt to gain unauthorized access to any part of the Site</li>
              <li>Use automated tools to scrape or harvest data without permission</li>
              <li>Submit spam or unsolicited commercial communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">3. Tool Directory & Listings</h2>
            <p>Tool listings on AICashMaker are provided for informational purposes. We do not endorse or guarantee the quality, safety, or effectiveness of any listed tool. Tool information may become outdated — always verify pricing and features directly with the tool provider.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">4. Marketplace Products</h2>
            <p className="mb-3">When purchasing digital products (prompt packs, automation templates, courses) from the AICashMaker Marketplace:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>All sales are final. Digital products are not eligible for refunds once delivered, unless the product is materially different from its description.</li>
              <li>You receive a personal, non-transferable license to use the product.</li>
              <li>You may not resell, redistribute, or sublicense products without written permission from the creator.</li>
              <li>AICashMaker acts as a marketplace facilitator, not the seller. Creators are responsible for the accuracy of their product descriptions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">5. Creator Revenue Share</h2>
            <p>Creators who sell products through the AICashMaker Marketplace receive 80% of each sale after Stripe processing fees. AICashMaker retains 20% as a platform fee. Payouts are processed via Stripe Connect on a rolling 7-day basis. AICashMaker reserves the right to modify the revenue split with 30 days notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">6. Tool Submissions</h2>
            <p>By submitting a tool listing, you represent that you have the authority to list the tool and that all information provided is accurate. AICashMaker reserves the right to reject, edit, or remove any listing at its discretion. Submission does not guarantee listing approval.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">7. Affiliate Links & Income Disclosures</h2>
            <p>Some links on AICashMaker are affiliate links. We may receive compensation when you click and make a purchase. This does not affect the price you pay. See our full <Link href="/affiliate-disclosure" className="text-sky-500 underline">Affiliate Disclosure</Link>.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">8. Income Disclaimers</h2>
            <p>Income examples, case studies, and earnings projections on this site are for illustrative purposes only. Results are not typical and will vary based on individual effort, experience, and market conditions. AICashMaker does not guarantee any specific income or results from using AI tools or implementing strategies described on the Site.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">9. Intellectual Property</h2>
            <p>All content on AICashMaker — including text, graphics, logos, and code — is the property of AICashMaker unless otherwise noted. You may not reproduce, distribute, or create derivative works without written permission.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">10. Limitation of Liability</h2>
            <p>AICashMaker is provided "as is" without warranties of any kind. To the maximum extent permitted by law, AICashMaker shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Site or any products purchased through it.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">11. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Changes take effect upon posting. Continued use of the Site after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">12. Governing Law</h2>
            <p>These Terms are governed by the laws of the United States. Any disputes shall be resolved in the appropriate courts.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">13. Contact</h2>
            <p>Questions about these Terms? <Link href="/contact" className="text-sky-500 underline">Contact us</Link> or email legal@aicashmaker.com.</p>
          </section>

        </div>
      </div>
    </>
  )
}
