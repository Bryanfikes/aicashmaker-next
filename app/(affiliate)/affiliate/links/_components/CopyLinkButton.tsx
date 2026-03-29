'use client'

import { useState } from 'react'

interface Props {
  url: string
}

export default function CopyLinkButton({ url }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 px-3.5 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
