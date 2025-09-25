'use client'

type Props = {
  subtotal: number
  discount: number
  total: number
}

export default function TotalsBar({ subtotal, discount, total }: Props) {
  return (
    <div>
      <h3>Totals</h3>
      <div>Subtotal: {subtotal}</div>
      <div>Discount: {discount}</div>
      <div><strong>Total: {total}</strong></div>
    </div>
  )
}
