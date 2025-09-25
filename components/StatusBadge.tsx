'use client'

import Spinner from '@/components/Spinner'

export default function StatusBadge({
  loading,
  error,
}: {
  loading: boolean
  error?: string
}) {
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 20, 
  }

  if (loading) {
    return (
      <span style={style} aria-live="polite">
        <Spinner label="Calculating…" />
      </span>
    )
  }

  if (error) {
    return (
      <span style={style} aria-live="polite">
        <span style={{ color: 'crimson' }}>Error: {error}</span>
      </span>
    )
  }

  return (
    <span style={{ ...style, visibility: 'hidden' }}>
      <Spinner label="Idle" />
    </span>
  )
}
