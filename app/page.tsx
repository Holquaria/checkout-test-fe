'use client'
import { useMemo, useReducer } from 'react'
import { calculateTotals } from '@/lib/calculation'
import type { PricingRules, Sku } from '@/lib/types'

const defaultRules: PricingRules = {
  A: { sku: 'A', unitPrice: 50, specials: [{ qty: 3, price: 130 }] },
  B: { sku: 'B', unitPrice: 30, specials: [{ qty: 2, price: 45 }] },
  C: { sku: 'C', unitPrice: 20 },
  D: { sku: 'D', unitPrice: 15 },
}

type State = { items: Sku[] }
type Action = { type: 'add'; sku: Sku } | { type: 'clear' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return { items: [...state.items, action.sku] }
    case 'clear':
      return { items: [] }
    default:
      return state
  }
}

export default function Page() {
  const [state, dispatch] = useReducer(reducer, { items: [] })
  const totals = useMemo(() => calculateTotals(state.items, defaultRules), [state.items])

  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: 820, margin: '2rem auto', padding: 16 }}>
      <h1>Checkout Kata (Next.js)</h1>
      <p>Click a SKU to scan it. Running total updates instantly.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {Object.keys(defaultRules).map((sku) => (
          <button key={sku} onClick={() => dispatch({ type: 'add', sku })}>
            Scan {sku}
          </button>
        ))}
        <button onClick={() => dispatch({ type: 'clear' })}>Clear</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
        <div>
          <h3>Basket</h3>
          <ul>
            {Object.entries(groupByCount(state.items)).map(([sku, qty]) => (
              <li key={sku}>
                {sku}: {qty}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Totals</h3>
          <div>Subtotal: {totals.subtotal}</div>
          <div>Discount: {totals.discount}</div>
          <div><strong>Total: {totals.total}</strong></div>
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Breakdown</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>SKU</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Subtotal</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {totals.lines.map((l) => (
            <tr key={l.sku}>
              <td>{l.sku}</td>
              <td style={{ textAlign: 'center' }}>{l.qty}</td>
              <td style={{ textAlign: 'right' }}>{l.unitPrice}</td>
              <td style={{ textAlign: 'right' }}>{l.lineSubtotal}</td>
              <td style={{ textAlign: 'right' }}>{l.lineDiscount}</td>
              <td style={{ textAlign: 'right' }}>{l.lineTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

function groupByCount(items: Sku[]): Record<string, number> {
  return items.reduce((acc, sku) => {
    acc[sku] = (acc[sku] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)
}
