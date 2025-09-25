'use client'

import { useCheckout } from '@/hooks/useCheckout'
import { usePricingRules } from '@/hooks/usePricingRules'
import type { PricingRules } from '@/lib/types'
import ItemPad from '@/components/ItemPad'
import BasketView from '@/components/BasketView'
import TotalsBar from '@/components/TotalsBar'
import BreakdownTable from '@/components/BreakdownTable'
import ScanInput from '@/components/ScanInput'
import StatusBadge from '@/components/StatusBadge'
import PricingRulesEditor from '@/components/PricingRulesEditor'

export default function Page() {
  const { rules, setRules, loaded } = usePricingRules()

  const { totals, counts, add, removeOne, clear, loading, error } = useCheckout(rules)

  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: 900, margin: '2rem auto', padding: 16 }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        Checkout <StatusBadge loading={loading} error={error} />
      </h1>

      <p>Scan SKUs to see a running total. You can edit pricing rules below.</p>

      {/* Rules editor controls the rules for this session */}
      <PricingRulesEditor initial={rules} onApply={setRules} />

      {/* Disable scanning until rules are loaded (first paint) */}
      <div aria-disabled={!loaded} style={{ opacity: loaded ? 1 : 0.5, pointerEvents: loaded ? 'auto' : 'none' }}>
        <ItemPad rules={rules} onScan={add} onClear={clear} />
        <ScanInput validSkus={Object.keys(rules)} onScan={add} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
        <BasketView counts={counts} onRemoveOne={removeOne} />
        <TotalsBar subtotal={totals.subtotal} discount={totals.discount} total={totals.total} />
      </div>

      <BreakdownTable totals={totals} />
    </main>
  )
}
