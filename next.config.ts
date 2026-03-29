import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: '*.supabase.co' },
      { hostname: '*.vercel.app' },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // On the server, replace @monaco-editor/react with a safe stub.
      config.resolve = config.resolve || {}
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '@monaco-editor/react': path.resolve('./mocks/monaco-editor-react.js'),
      }
      // pino-pretty uses worker_threads which isn't resolvable in webpack bundles
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'pino-pretty',
        'worker_threads',
      ]
    }
    return config
  },
}

export default withPayload(nextConfig)
