import React from 'react'

/**
 * Injected before nav links in the Payload admin sidebar.
 * Adds a "Back to Dashboard" shortcut and quick-link row.
 */
export default function AdminNavHeader() {
  return (
    <div
      style={{
        padding: '8px 12px 4px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '4px',
      }}
    >
      {/* Back to main dashboard */}
      <a
        href="/admin-dashboard"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 10px',
          borderRadius: '8px',
          background: 'rgba(16,185,129,0.10)',
          border: '1px solid rgba(16,185,129,0.18)',
          color: 'rgb(52,211,153)',
          fontSize: '12px',
          fontWeight: 700,
          textDecoration: 'none',
          marginBottom: '6px',
          transition: 'background 0.15s',
        }}
      >
        <span style={{ fontSize: '13px' }}>◈</span>
        <span>Main Dashboard</span>
        <span style={{ marginLeft: 'auto', opacity: 0.6, fontSize: '11px' }}>↗</span>
      </a>

      {/* Quick links row */}
      <div
        style={{
          display: 'flex',
          gap: '5px',
          marginBottom: '2px',
        }}
      >
        {[
          { label: 'Live Site', href: '/', icon: '⬡' },
          { label: 'Ads', href: '/admin/collections/advertisements', icon: '◈' },
          { label: 'Preview', href: '/ad-preview', icon: '🖼' },
        ].map(({ label, href, icon }) => (
          <a
            key={href}
            href={href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              padding: '6px 4px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgb(148,163,184)',
              fontSize: '10px',
              fontWeight: 600,
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            <span style={{ fontSize: '13px' }}>{icon}</span>
            <span>{label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
