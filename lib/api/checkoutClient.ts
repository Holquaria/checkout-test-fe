// lib/api/checkoutClient.ts
import type { PricingRules, Sku, Totals } from '@/lib/types'
import { postJson } from '@/lib/api/http'

export type CheckoutRequest = {
  items: Array<{ sku: Sku; qty: number }>
  pricingRules: Array<{ sku: Sku; unitPrice: number; specials?: Array<{ qty: number; price: number }> }>
}

const BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? 'http://localhost:8080'
const URL = `${BASE}/api/checkout/total`

export async function fetchTotalsFromBackend(
  items: Sku[],
  rules: PricingRules,
  opts?: { timeoutMs?: number; signal?: AbortSignal }
): Promise<Totals> {
  const counts = items.reduce((acc, s) => {
    acc[s] = (acc[s] ?? 0) + 1
    return acc
  }, {} as Record<Sku, number>)

  const body: CheckoutRequest = {
    items: Object.entries(counts).map(([sku, qty]) => ({ sku, qty })),
    // normalise specials to [] to avoid null issues
    pricingRules: Object.values(rules).map((r) => ({ ...r, specials: r.specials ?? [] })),
  }

  return postJson<Totals>(URL, body, opts)
}
