import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AdUnit from '@/components/AdUnit'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AICashMaker — Make Money with AI Tools',
    template: '%s — AICashMaker',
  },
  description: 'The #1 AI tools directory for making money with AI. Reviews, side hustle guides, prompts, and automation templates.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aicashmaker.com'),
  openGraph: {
    type: 'website',
    siteName: 'AICashMaker',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* OTTO / Search Atlas dynamic optimization — must be in <head> for OTTO to verify connection */}
        <script
          id="sa-dynamic-optimization"
          data-uuid="d774e5d9-cd91-4ddc-915e-5eb0c240b8f5"
          src="https://digitaldojo.bonsaimarketingcompany.com/scripts/dynamic_optimization.js"
          async
        />
      </head>
      <body className="font-sans">
        <Nav />
        {/* Leaderboard 728×90 — global, below nav */}
        <div className="bg-slate-50 border-b border-slate-100 py-2 px-4 hidden sm:flex justify-center overflow-hidden">
          <AdUnit size="leaderboard" placement="global" />
        </div>
        {/* Mobile Banner 320×50 — shown only on small screens */}
        <div className="sm:hidden py-1 px-2 bg-slate-50 border-b border-slate-100 flex justify-center overflow-hidden">
          <AdUnit size="mobile-banner" placement="global" />
        </div>
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
