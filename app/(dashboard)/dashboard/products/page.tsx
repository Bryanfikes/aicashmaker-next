import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Product } from '@/payload-types'

export const metadata = { title: 'Products' }

const typeLabels: Record<string, string> = {
  'prompt-pack': 'Prompt Pack',
  template: 'AI Template',
  course: 'Course',
  automation: 'Automation',
  'digital-tool': 'Digital Tool',
  other: 'Other',
}

export default async function DashboardProductsPage() {
  let products: Product[] = []

  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) redirect('/login')

    if (user.creator) {
      const creatorId = typeof user.creator === 'object' ? user.creator.id : user.creator
      const result = await payload.find({
        collection: 'products',
        where: { creator: { equals: creatorId } },
        overrideAccess: true,
        sort: '-createdAt',
        limit: 100,
      })
      products = result.docs as Product[]
    }
  } catch {
    redirect('/login')
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Gradient header strip */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f2344] to-slate-900 px-8 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">My Products</h1>
            <p className="text-sm text-slate-400 mt-1">Manage your marketplace listings.</p>
          </div>
          <a
            href="/submit-product"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl px-4 py-2 text-sm transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </a>
        </div>
      </div>

      <div className="p-8">
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-16 text-center">
            <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="font-extrabold tracking-tight text-slate-900">No products yet</p>
            <p className="text-sm text-slate-400 mt-1 mb-6">Submit your first product to start earning.</p>
            <a
              href="/submit-product"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl px-5 py-2 text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Submit a product
            </a>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-4 font-medium text-slate-500">Product</th>
                  <th className="text-left px-6 py-4 font-medium text-slate-500">Type</th>
                  <th className="text-left px-6 py-4 font-medium text-slate-500">Price</th>
                  <th className="text-left px-6 py-4 font-medium text-slate-500">Sales</th>
                  <th className="text-left px-6 py-4 font-medium text-slate-500">Status</th>
                  <th className="text-left px-6 py-4 font-medium text-slate-500">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{product.tagline}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {typeLabels[product.type] || product.type}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {product.salesCount ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      {product.approved ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                          Pending review
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {formatDate(product.createdAt as string)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
