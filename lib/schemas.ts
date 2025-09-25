import { z } from 'zod'

export const SpecialSchema = z.object({
  qty: z.number().int().min(1),
  price: z.number().int().min(0),
})

export const PricingRuleSchema = z.object({
  sku: z.string().min(1),
  unitPrice: z.number().int().min(0),
  specials: z.array(SpecialSchema).optional().default([]),
})

export const PricingRulesArraySchema = z.array(PricingRuleSchema)

export type SpecialInput = z.infer<typeof SpecialSchema>
export type PricingRuleInput = z.infer<typeof PricingRuleSchema>
export type PricingRulesArrayInput = z.infer<typeof PricingRulesArraySchema>
