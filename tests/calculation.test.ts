import { calculateTotals } from '@/lib/calculation'
import type { PricingRules } from '@/lib/types'

const rules: PricingRules = {
  A: { sku: 'A', unitPrice: 50, specials: [{ qty: 3, price: 130 }] },
  B: { sku: 'B', unitPrice: 30, specials: [{ qty: 2, price: 45 }] },
  C: { sku: 'C', unitPrice: 20 },
  D: { sku: 'D', unitPrice: 15 }
}

function calculateTotalForItems(items: string[]) {
  return calculateTotals(items, rules).total
}

describe('calculateTotals', () => {
  it('handles empty basket', () => {
    expect(calculateTotalForItems([])).toBe(0)
  })

  it('sums simple items', () => {
    expect(calculateTotalForItems(['A'])).toBe(50)
    expect(calculateTotalForItems(['C', 'D'])).toBe(35)
  })

  it('applies specials greedily (A: 3 for 130)', () => {
    expect(calculateTotalForItems(['A', 'A', 'A'])).toBe(130)
    expect(calculateTotalForItems(['A', 'A', 'A', 'A'])).toBe(180) // 130 + 50
  })

  it('applies specials for B: 2 for 45', () => {
    expect(calculateTotalForItems(['B', 'B'])).toBe(45)
    expect(calculateTotalForItems(['B', 'A', 'B'])).toBe(95)
  })

  it('is order independent', () => {
    const a = calculateTotalForItems(['B', 'A', 'B', 'A', 'A'])
    const b = calculateTotalForItems(['A', 'B', 'A', 'A', 'B'])
    expect(a).toBe(b)
  })

  it('throws on unknown SKU', () => {
    expect(() => calculateTotalForItems(['Z' as any])).toThrow()
  })
})
