import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../(frontend)/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Creator Dashboard — AICashMaker',
    template: '%s — AICashMaker Dashboard',
  },
  robots: { index: false, follow: false },
}

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  )
}
