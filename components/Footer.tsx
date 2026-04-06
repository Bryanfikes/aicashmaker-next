import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 text-white font-extrabold text-base no-underline mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#0ea5e9" />
              </svg>
              AICashMaker
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              The #1 AI tools directory for making money with AI.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">AI Tools</h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {[
                ['All Tools', '/tools'],
                ['ChatGPT Plus', '/tools/chatgpt-plus'],
                ['Midjourney', '/tools/midjourney'],
                ['Claude Pro', '/tools/claude-pro'],
                ['ElevenLabs', '/tools/elevenlabs'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-500 hover:text-white transition-colors no-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Side Hustles */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Side Hustles</h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {[
                ['All Side Hustles', '/side-hustles'],
                ['AI Content Writing', '/side-hustles/ai-content-writing'],
                ['AI SEO Agency', '/side-hustles/ai-seo-agency'],
                ['AI Video Creation', '/side-hustles/ai-video-creation'],
                ['Prompt Engineering', '/side-hustles/prompt-engineering'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-500 hover:text-white transition-colors no-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {[
                ['Blog', '/blog'],
                ['About', '/about'],
                ['Contact', '/contact'],
                ['Newsletter', '/newsletter'],
                ['Submit a Tool', '/submit-tool'],
                ['Advertise', '/advertise'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-500 hover:text-white transition-colors no-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">© 2025 AICashMaker.com</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Affiliate Disclosure', '/affiliate-disclosure']].map(([label, href]) => (
              <Link key={href} href={href} className="text-xs text-slate-600 hover:text-slate-400 transition-colors no-underline">
                {label}
              </Link>
            ))}
            <span className="text-slate-700 text-xs hidden sm:inline">·</span>
            <Link href="/login" className="text-xs text-slate-500 hover:text-white transition-colors no-underline">
              User Login
            </Link>
            <Link
              href="/admin"
              className="text-xs text-slate-600 hover:text-sky-400 transition-colors no-underline"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
