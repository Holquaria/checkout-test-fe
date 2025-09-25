import type { PricingRules } from '@/lib/types'

// A default preset you can show/edit, but not hard-code into the flow.
export const presetRules: PricingRules = {
  A: { sku: 'A', unitPrice: 50, specials: [{ qty: 3, price: 130 }] },
  B: { sku: 'B', unitPrice: 30, specials: [{ qty: 2, price: 45 }] },
  C: { sku: 'C', unitPrice: 20, specials: [] },
  D: { sku: 'D', unitPrice: 15, specials: [] },
}
