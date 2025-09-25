'use client'

import { useEffect } from 'react'
import type { Sku } from '@/lib/types'

type Props = {
  validSkus: string[]
  onScan: (sku: Sku) => void
}

/** Type a SKU letter and press Enter to scan */
export default function ScanInput({ validSkus, onScan }: Props) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Enter') return
      const key = e.key.toUpperCase()
      if (validSkus.includes(key)) {
        onScan(key)
      }
    }
    window.addEventListener('keypress', handler)
    return () => window.removeEventListener('keypress', handler)
  }, [validSkus, onScan])

  return null
}
