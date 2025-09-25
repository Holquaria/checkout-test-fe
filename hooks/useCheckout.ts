'use client'

import { useMemo, useReducer, useCallback } from 'react'
import { calculateTotals } from '@/lib/calculation'
import { fetchTotalsFromBackend } from '@/lib/api/checkoutClient'
import type { PricingRules, Sku, Totals } from '@/lib/types'

const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND === 'true'

type State = { items: Sku[]; rules: PricingRules; totals: Totals | null; loading: boolean; error?: string }
type Action =
  | { type: 'add'; sku: Sku }
  | { type: 'removeOne'; sku: Sku }
  | { type: 'clear' }
  | { type: 'setRules'; rules: PricingRules }
  | { type: 'setTotals'; totals: Totals }
  | { type: 'loading'; value: boolean }
  | { type: 'error'; message?: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': return { ...state, items: [...state.items, action.sku] }
    case 'removeOne': {
      const idx = state.items.lastIndexOf(action.sku)
      if (idx === -1) return state
      const items = state.items.slice()
      items.splice(idx, 1)
      return { ...state, items }
    }
    case 'clear': return { ...state, items: [] }
    case 'setRules': return { ...state, rules: action.rules }
    case 'setTotals': return { ...state, totals: action.totals, error: undefined }
    case 'loading': return { ...state, loading: action.value }
    case 'error': return { ...state, error: action.message, loading: false }
    default: return state
  }
}

export function useCheckout(initialRules: PricingRules) {
  const initialTotals = useMemo<Totals>(() => calculateTotals([], initialRules), [initialRules])
  const [state, dispatch] = useReducer(reducer, { items: [], rules: initialRules, totals: initialTotals, loading: false })

  // derived counts (for UI)
  const counts = useMemo(() => {
    return state.items.reduce((acc, s) => {
      acc[s] = (acc[s] ?? 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [state.items])

  // compute totals locally when not using backend
  const localTotals: Totals = useMemo(() => {
    if (USE_BACKEND) return state.totals ?? calculateTotals(state.items, state.rules)
    return calculateTotals(state.items, state.rules)
  }, [state.items, state.rules, state.totals])

  const recalc = useCallback(async (items: Sku[], rules: PricingRules) => {
    if (!USE_BACKEND) return
    try {
      dispatch({ type: 'loading', value: true })
      const totals = await fetchTotalsFromBackend(items, rules)
      dispatch({ type: 'setTotals', totals })
    } catch (e: any) {
      dispatch({ type: 'error', message: e?.message ?? 'Unknown backend error' })
    } finally {
      dispatch({ type: 'loading', value: false })
    }
  }, [])

  const add = useCallback((sku: Sku) => {
    dispatch({ type: 'add', sku })
    if (USE_BACKEND) recalc([...state.items, sku], state.rules)
  }, [recalc, state.items, state.rules])

  const removeOne = useCallback((sku: Sku) => {
    dispatch({ type: 'removeOne', sku })
    if (USE_BACKEND) {
      const idx = state.items.lastIndexOf(sku)
      if (idx !== -1) {
        const next = state.items.slice()
        next.splice(idx, 1)
        recalc(next, state.rules)
      }
    }
  }, [recalc, state.items, state.rules])

  const clear = useCallback(() => {
    dispatch({ type: 'clear' })
    if (USE_BACKEND) recalc([], state.rules)
  }, [recalc, state.rules])

  const setRules = useCallback((rules: PricingRules) => {
    dispatch({ type: 'setRules', rules })
    if (USE_BACKEND) recalc(state.items, rules)
  }, [recalc, state.items])

  return {
    items: state.items,
    rules: state.rules,
    totals: localTotals,
    counts,
    loading: state.loading,
    error: state.error,
    add,
    removeOne,
    clear,
    setRules,
  }
}
