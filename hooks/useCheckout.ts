'use client'

import { useMemo, useReducer, useCallback } from 'react'
import { calculateTotals } from '@/lib/calculation'
import type { PricingRules, Sku, Totals } from '@/lib/types'

type State = { items: Sku[]; rules: PricingRules }
type Action =
  | { type: 'add'; sku: Sku }
  | { type: 'removeOne'; sku: Sku }
  | { type: 'clear' }
  | { type: 'setRules'; rules: PricingRules }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return { ...state, items: [...state.items, action.sku] }
    case 'removeOne': {
      const idx = state.items.lastIndexOf(action.sku)
      if (idx === -1) return state
      const copy = state.items.slice()
      copy.splice(idx, 1)
      return { ...state, items: copy }
    }
    case 'clear':
      return { ...state, items: [] }
    case 'setRules':
      return { ...state, rules: action.rules }
    default:
      return state
  }
}

export function useCheckout(initialRules: PricingRules) {
  const [state, dispatch] = useReducer(reducer, { items: [], rules: initialRules })

  const totals: Totals = useMemo(
    () => calculateTotals(state.items, state.rules),
    [state.items, state.rules]
  )

  const add = useCallback((sku: Sku) => dispatch({ type: 'add', sku }), [])
  const removeOne = useCallback((sku: Sku) => dispatch({ type: 'removeOne', sku }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])
  const setRules = useCallback((rules: PricingRules) => dispatch({ type: 'setRules', rules }), [])

  const counts = useMemo(() => {
    return state.items.reduce((acc, s) => {
      acc[s] = (acc[s] ?? 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [state.items])

  return {
    items: state.items,
    rules: state.rules,
    totals,
    counts,
    add,
    removeOne,
    clear,
    setRules,
  }
}
