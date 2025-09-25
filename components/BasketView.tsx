'use client'

type Props = {
  counts: Record<string, number>
  onRemoveOne?: (sku: string) => void
}

export default function BasketView({ counts, onRemoveOne }: Props) {
  const entries = Object.entries(counts)

  return (
    <div>
      <h3>Basket</h3>
      {entries.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No items yet</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {entries.map(([sku, qty]) => (
            <li key={sku} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 28, display: 'inline-block' }}>{sku}</span>
              <span>× {qty}</span>
              {onRemoveOne && (
                <button onClick={() => onRemoveOne(sku)} aria-label={`Remove one ${sku}`}>
                  −1
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
