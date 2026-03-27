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
      // Payload's CodeEditor calls useEditorConfig() during SSR; without a
      // Monaco context it returns undefined, crashing the admin pages.
      config.resolve = config.resolve || {}
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '@monaco-editor/react': path.resolve('./mocks/monaco-editor-react.js'),
      }
    }
    return config
  },
}

export default withPayload(nextConfig)
