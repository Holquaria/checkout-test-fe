// lib/api/checkoutClient.ts
import type { PricingRules, Sku, Totals } from '@/lib/types' // you renamed to 'types'

export type CheckoutRequest = {
  items: Array<{ sku: Sku; qty: number }>;
  pricingRules: Array<{ sku: Sku; unitPrice: number; specials?: Array<{ qty: number; price: number }> }>;
};

const BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? 'http://localhost:8080';

if (typeof window !== 'undefined') console.log('BE URL:', BASE);

export async function fetchTotalsFromBackend(items: Sku[], rules: PricingRules): Promise<Totals> {
  const counts = items.reduce((acc, s) => {
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {} as Record<Sku, number>);

  const body: CheckoutRequest = {
    items: Object.entries(counts).map(([sku, qty]) => ({ sku, qty })),
    pricingRules: Object.values(rules).map(r => ({ ...r, specials: r.specials ?? [] }))
  };

  const res = await fetch(`${BASE}/api/checkout/total`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error(`Backend error (${res.status})`);

  return (await res.json()) as Totals;
}
