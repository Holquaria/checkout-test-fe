'use client'

import { useEffect, useMemo, useState } from 'react'
import type { PricingRules } from '@/lib/types'
import { PricingRulesArraySchema } from '@/lib/schemas'

type Props = {
  initial: PricingRules
  onApply: (rules: PricingRules) => void
}

export default function PricingRulesEditor({ initial, onApply }: Props) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | undefined>()

  // keep a formatted JSON in the editor when opened
  const pretty = useMemo(() => JSON.stringify(Object.values(initial), null, 2), [initial])

  useEffect(() => {
    if (open) setText(pretty)
  }, [open, pretty])

  function apply() {
    try {
      setError(undefined)
      const parsed = JSON.parse(text)
      const arr = PricingRulesArraySchema.parse(parsed) // validate + normalise specials
      const obj = Object.fromEntries(arr.map(r => [r.sku, r]))
      onApply(obj)
      setOpen(false)
    } catch (e: any) {
      setError(e?.message ?? 'Invalid rules JSON')
    }
  }

  return (
    <section style={{ margin: '12px 0', border: '1px solid rgba(0,0,0,.1)', borderRadius: 8 }}>
      <header style={{ padding: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Pricing rules</strong>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setOpen(o => !o)} aria-expanded={open}>
            {open ? 'Close editor' : 'Edit rules'}
          </button>
        </div>
      </header>

      {open && (
        <div style={{ padding: 8 }}>
          <p style={{ marginTop: 0 }}>
            Paste or edit rules as JSON array. Example:
            <code> [&#123; "sku":"A","unitPrice":50,"specials":[&#123;"qty":3,"price":130&#125;] &#125;] </code>
          </p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            spellCheck={false}
            rows={12}
            style={{ width: '100%', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13 }}
          />
          {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={apply}>Apply</button>
            <button onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  )
}
