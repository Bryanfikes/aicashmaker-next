import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — AICashMaker',
  description: 'AICashMaker privacy policy. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 no-underline">Home</Link>
            <span className="mx-1.5">›</span>
            <span className="text-slate-600">Privacy Policy</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: March 2025</p>

        <div className="space-y-10 text-sm leading-relaxed text-slate-600">

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">1. Information We Collect</h2>
            <p className="mb-3">We collect information you provide directly, including:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Email address</strong> — when you subscribe to our newsletter or submit a form</li>
              <li><strong>Name</strong> — when you submit a tool, product, or contact form</li>
              <li><strong>Payment information</strong> — processed securely by Stripe; we never store card numbers</li>
              <li><strong>Usage data</strong> — pages visited, clicks, and time on site (via analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To send our weekly newsletter (only if you've subscribed)</li>
              <li>To process purchases and deliver digital products</li>
              <li>To respond to support requests and form submissions</li>
              <li>To improve the site based on usage analytics</li>
              <li>To send transactional emails (order confirmations, submission updates)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">3. Email Communications</h2>
            <p>If you subscribe to our newsletter, you will receive weekly emails. You can unsubscribe at any time by clicking the unsubscribe link in any email. We do not sell or rent your email address to third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">4. Cookies & Analytics</h2>
            <p>We use cookies and analytics tools (such as Google Analytics) to understand how visitors use the site. This data is aggregated and anonymized. You can disable cookies in your browser settings, though some site functionality may be affected.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">5. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services, each with their own privacy policies:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Supabase</strong> — database and authentication</li>
              <li><strong>Vercel</strong> — hosting and analytics</li>
              <li><strong>Google Analytics</strong> — site analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">6. Data Retention</h2>
            <p>We retain your data for as long as necessary to provide our services. Newsletter subscriber data is deleted within 30 days of unsubscribing upon request. Purchase records are retained for 7 years for tax and legal compliance.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">7. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. To exercise these rights, please <Link href="/contact" className="text-sky-500 underline">contact us</Link>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">8. Children's Privacy</h2>
            <p>AICashMaker is not directed at children under 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will delete it.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">9. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify newsletter subscribers of material changes. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">10. Contact</h2>
            <p>For privacy-related questions, please <Link href="/contact" className="text-sky-500 underline">contact us</Link> or email privacy@aicashmaker.com.</p>
          </section>

        </div>
      </div>
    </>
  )
}
