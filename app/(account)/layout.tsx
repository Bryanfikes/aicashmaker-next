import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GTMHead, GTMNoscript } from '@/components/GoogleTagManager'
import '../(frontend)/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'My Account — AICashMaker',
    template: '%s — AICashMaker Account',
  },
  robots: { index: false, follow: false },
}

export default function AccountRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <GTMHead />
      </head>
      <body className="font-sans bg-slate-50 text-slate-900">
        <GTMNoscript />
        {children}
      </body>
    </html>
  )
}
