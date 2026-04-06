import React from 'react'

/** AICashMaker brand logo for the Payload admin header */
export default function AdminLogo() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
      }}
    >
      {/* Brand mark */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '9px',
          background: 'linear-gradient(135deg, #34d399, #0ea5e9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 10px rgba(52, 211, 153, 0.35)',
          fontWeight: 900,
          fontSize: '16px',
          color: 'white',
          letterSpacing: '-0.02em',
        }}
      >
        A
      </div>

      {/* Wordmark */}
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.02em',
            lineHeight: '1',
          }}
        >
          AICashMaker
        </div>
        <div
          style={{
            fontSize: '10px',
            color: 'rgba(100,116,139,1)',
            marginTop: '2px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Admin Console
        </div>
      </div>
    </div>
  )
}
