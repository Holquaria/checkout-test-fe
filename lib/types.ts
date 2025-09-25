export type Sku = string

export type Special = {
  qty: number
  price: number // bundle price for qty units
}

export type PricingRule = {
  sku: Sku
  unitPrice: number
  specials?: Special[]
}

export type PricingRules = Record<Sku, PricingRule>

export type LineBreakdown = {
  sku: Sku
  qty: number
  unitPrice: number
  specialsApplied?: { qty: number; price: number; bundles: number }[]
  lineSubtotal: number
  lineDiscount: number
  lineTotal: number
}

export type Totals = {
  subtotal: number
  discount: number
  total: number
  lines: LineBreakdown[]
}
