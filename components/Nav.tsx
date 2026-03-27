'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

const navLinks = [
  { href: '/tools', label: 'Tools' },
  { href: '/side-hustles', label: 'Side Hustles' },
  { href: '/prompts', label: 'Prompts' },
  { href: '/automations', label: 'Automations' },
  { href: '/blog', label: 'Blog' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white/97 backdrop-blur-lg border-b border-slate-200 transition-shadow ${
        scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.08)]' : ''
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[1.1rem] font-extrabold text-slate-900 no-underline flex-shrink-0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#0ea5e9" stroke="#0ea5e9" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          AICashMaker
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center list-none m-0 p-0 gap-0.5 flex-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`inline-flex items-center text-sm font-medium px-3 py-[7px] rounded-lg transition-colors no-underline ${
                    active
                      ? 'text-sky-500 bg-sky-50'
                      : 'text-slate-600 hover:text-sky-500 hover:bg-sky-50/70'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <Link
            href="/submit-tool"
            className="inline-flex items-center text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-sky-300 hover:text-sky-600 transition-colors no-underline"
          >
            Submit a Tool
          </Link>
          <Link
            href="/newsletter"
            className="inline-flex items-center text-sm font-semibold px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors no-underline"
          >
            Newsletter
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden flex items-center justify-center w-9 h-9 border border-slate-200 rounded-lg bg-transparent cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="text-slate-600 text-lg leading-none">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2">
          <ul className="list-none m-0 p-0 flex flex-col gap-1" ref={menuRef}>
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block text-sm font-medium px-3 py-2.5 rounded-lg no-underline ${
                      active ? 'text-sky-500 bg-sky-50' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
            <Link
              href="/submit-tool"
              className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl border border-slate-200 text-slate-700 no-underline"
              onClick={() => setMenuOpen(false)}
            >
              Submit a Tool
            </Link>
            <Link
              href="/newsletter"
              className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl bg-sky-500 text-white no-underline"
              onClick={() => setMenuOpen(false)}
            >
              Newsletter
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
