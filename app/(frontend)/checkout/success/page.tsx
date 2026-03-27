import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Purchase Complete — AICashMaker' }

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Purchase Complete!</h1>
        <p className="text-slate-600 mb-2">
          Your download link has been sent to your email address.
        </p>
        <p className="text-sm text-slate-500 mb-8">
          Can&apos;t find it? Check your spam folder or contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/marketplace"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Browse More Products
          </Link>
          <Link
            href="/"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
