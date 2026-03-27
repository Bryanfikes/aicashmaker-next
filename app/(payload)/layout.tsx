import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import config from '@payload-config'
import { importMap } from './admin/importMap.js'

type Args = {
  children: React.ReactNode
}

const serverFunction = async (args: Parameters<typeof handleServerFunctions>[0]) => {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default async function Layout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
