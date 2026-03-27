import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
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
      <body className="font-sans">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
