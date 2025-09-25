'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PricingRules } from '@/lib/types'
import { PricingRulesArraySchema } from '@/lib/schemas'
import { presetRules } from '@/lib/presets'

const STORAGE_KEY = 'checkout.pricingRules.v1'

function objectToArray(rules: PricingRules) {
  return Object.values(rules)
}
function arrayToObject(arr: z.infer<typeof PricingRulesArraySchema>): PricingRules {
  return Object.fromEntries(arr.map(r => [r.sku, { ...r, specials: r.specials ?? [] }]))
}

// z is used only for types; import type to avoid bundling if desired
import type { z } from 'zod'

export function usePricingRules() {
  const [rules, setRules] = useState<PricingRules>(presetRules)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        const arr = PricingRulesArraySchema.parse(parsed)
        setRules(arrayToObject(arr))
      } else {
        // seed storage with preset for convenience
        localStorage.setItem(STORAGE_KEY, JSON.stringify(objectToArray(presetRules)))
      }
    } catch {
      // If parse/validation fails, fall back to preset
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectToArray(presetRules)))
      setRules(presetRules)
    } finally {
      setLoaded(true)
    }
  }, [])

  const saveRules = useCallback((next: PricingRules) => {
    setRules(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objectToArray(next)))
  }, [])

  const exportJson = useCallback(() => JSON.stringify(objectToArray(rules), null, 2), [rules])

  return { rules, setRules: saveRules, exportJson, loaded }
}
