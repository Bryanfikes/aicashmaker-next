'use client'

import { useState } from 'react'

interface Props {
  value: string
  label?: string
  className?: string
}

export default function CopyCodeButton({ value, label = 'Copy', className }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select the text
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={
        className ||
        'shrink-0 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors'
      }
    >
      {copied ? 'Copied!' : label}
    </button>
  )
}
