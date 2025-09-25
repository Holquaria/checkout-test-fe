'use client'

import type { Totals } from '@/lib/types'

type Props = {
  totals: Totals
}

export default function BreakdownTable({ totals }: Props) {
  return (
    <div>
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
    </div>
  )
}
