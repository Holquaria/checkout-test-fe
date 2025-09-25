'use client'

export default function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span
        aria-hidden
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          display: 'inline-block',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span>{label}</span>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
