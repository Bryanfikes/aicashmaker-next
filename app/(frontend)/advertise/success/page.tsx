import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Payment Confirmed — AICashMaker' }

export default function AdvertiseSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Payment Confirmed!</h1>
        <p className="text-slate-600 mb-6">
          Thank you for advertising with AICashMaker. You&apos;ll receive an email confirmation shortly, and our team will reach out within 1 business day to get started.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
