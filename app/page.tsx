'use client'

import { useCheckout } from '@/hooks/useCheckout'
import type { PricingRules } from '@/lib/types'
import ItemPad from '@/components/ItemPad'
import BasketView from '@/components/BasketView'
import TotalsBar from '@/components/TotalsBar'
import BreakdownTable from '@/components/BreakdownTable'
import ScanInput from '@/components/ScanInput'

const defaultRules: PricingRules = {
  A: { sku: 'A', unitPrice: 50, specials: [{ qty: 3, price: 130 }] },
  B: { sku: 'B', unitPrice: 30, specials: [{ qty: 2, price: 45 }] },
  C: { sku: 'C', unitPrice: 20 },
  D: { sku: 'D', unitPrice: 15 },
}

export default function Page() {
  const { rules, totals, counts, add, removeOne, clear } = useCheckout(defaultRules)

  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: 900, margin: '2rem auto', padding: 16 }}>
      <h1>Checkout</h1>
      <p>Click a SKU to scan it. Running total updates instantly.</p>

      <ItemPad rules={rules} onScan={add} onClear={clear} />
      <ScanInput validSkus={Object.keys(rules)} onScan={add} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
        <BasketView counts={counts} onRemoveOne={removeOne} />
        <TotalsBar subtotal={totals.subtotal} discount={totals.discount} total={totals.total} />
      </div>

      <BreakdownTable totals={totals} />
    </main>
  )
}
