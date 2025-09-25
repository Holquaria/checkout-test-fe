import type { PricingRules, Sku, Totals, LineBreakdown, PricingRule } from '@/lib/types'

/**
 * Calculate totals for a list of scanned SKUs using greedy highest-qty specials.
 * Deterministic, pure, order-independent.
 */
export function calculateTotals(items: Sku[], rules: PricingRules): Totals {
  const counts = new Map<Sku, number>()
  for (const sku of items) {
    counts.set(sku, (counts.get(sku) ?? 0) + 1)
  }

  const lines: LineBreakdown[] = []

  for (const [sku, qty] of counts) {
    const rule = rules[sku]
    if (!rule) {
      throw new Error(`Unknown SKU: ${sku}`)
    }
    lines.push(calcLine(rule, qty))
  }

  lines.sort((a, b) => a.sku.localeCompare(b.sku))

  const subtotal = sum(lines.map(l => l.lineSubtotal))
  const discount = sum(lines.map(l => l.lineDiscount))
  const total = subtotal - discount

  return { subtotal, discount, total, lines }
}

function calcLine(rule: PricingRule, qty: number): LineBreakdown {
  if (!Number.isInteger(qty) || qty < 0) throw new Error(`Invalid qty for ${rule.sku}: ${qty}`)
  const unit = rule.unitPrice
  const lineSubtotal = qty * unit
  let remaining = qty
  let lineDiscount = 0
  const applied: { qty: number; price: number; bundles: number }[] = []

  const specials = [...(rule.specials ?? [])].sort((a, b) => b.qty - a.qty)

  for (const s of specials) {
    if (s.qty <= 0) continue
    const bundles = Math.floor(remaining / s.qty)
    if (bundles > 0) {
      const regularCost = bundles * s.qty * unit
      const specialCost = bundles * s.price
      const discount = regularCost - specialCost
      lineDiscount += discount
      remaining -= bundles * s.qty
      applied.push({ qty: s.qty, price: s.price, bundles })
    }
  }

  const lineTotal = lineSubtotal - lineDiscount

  return {
    sku: rule.sku,
    qty,
    unitPrice: unit,
    specialsApplied: applied.length ? applied : undefined,
    lineSubtotal,
    lineDiscount,
    lineTotal,
  }
}

function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0)
}
