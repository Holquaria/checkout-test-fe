'use client'

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { calculateTotals } from '@/lib/calculation'
import { fetchTotalsFromBackend } from '@/lib/api/checkoutClient'
import type { PricingRules, Sku, Totals } from '@/lib/types'

const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND === 'true'

type State = { items: Sku[] }
type Action = { type: 'add'; sku: Sku } | { type: 'removeOne'; sku: Sku } | { type: 'clear' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': return { items: [...state.items, action.sku] }
    case 'removeOne': {
      const idx = state.items.lastIndexOf(action.sku)
      if (idx === -1) return state
      const copy = state.items.slice(); copy.splice(idx, 1)
      return { items: copy }
    }
    case 'clear': return { items: [] }
    default: return state
  }
}

export function useCheckout(rules: PricingRules) {
  const [state, dispatch] = useReducer(reducer, { items: [] })
  const localTotals: Totals = useMemo(() => calculateTotals(state.items, rules), [state.items, rules])

  const [remoteTotals, setRemoteTotals] = useState<Totals | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Track the latest request to avoid race conditions
  const latestReq = useRef<{ id: number; controller: AbortController } | null>(null)
  const seq = useRef(0)

  useEffect(() => {
    if (!USE_BACKEND) return

    // abort previous request
    latestReq.current?.controller.abort()
    const controller = new AbortController()
    const id = ++seq.current
    latestReq.current = { id, controller }

    setLoading(true)
    setError(undefined)

    fetchTotalsFromBackend(state.items, rules, { signal: controller.signal, timeoutMs: 7000 })
      .then((t) => {
        if (latestReq.current?.id === id) setRemoteTotals(t) // ignore stale responses
      })
      .catch((e: any) => {
        if (latestReq.current?.id === id) setError(e?.message ?? 'Backend error')
      })
      .finally(() => {
        if (latestReq.current?.id === id) setLoading(false)
      })
  }, [state.items, rules])

  const counts = useMemo(() => {
    return state.items.reduce((acc, s) => {
      acc[s] = (acc[s] ?? 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [state.items])

  const totals = USE_BACKEND ? (remoteTotals ?? localTotals) : localTotals
  const add = useCallback((sku: Sku) => dispatch({ type: 'add', sku }), [])
  const removeOne = useCallback((sku: Sku) => dispatch({ type: 'removeOne', sku }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  return { items: state.items, totals, counts, add, removeOne, clear, loading, error }
}
