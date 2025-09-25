'use client'

import type { PricingRules, Sku } from '@/lib/types'

type Props = {
  rules: PricingRules
  onScan: (sku: Sku) => void
  onClear: () => void
}

export default function ItemPad({ rules, onScan, onClear }: Props) {
  const skus = Object.keys(rules)

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
      {skus.map((sku) => (
        <button key={sku} onClick={() => onScan(sku)} aria-label={`Scan ${sku}`}>
          Scan {sku}
        </button>
      ))}
      <button onClick={onClear} aria-label="Clear basket">Clear</button>
    </div>
  )
}
