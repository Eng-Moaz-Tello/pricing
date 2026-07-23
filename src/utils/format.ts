export function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

interface Priced {
  quantity: number
  unitPriceSYP: number
  unitPriceUSD: number
}

export function projectTotals(items: Priced[]) {
  return items.reduce(
    (acc, it) => ({
      syp: acc.syp + it.quantity * it.unitPriceSYP,
      usd: acc.usd + it.quantity * it.unitPriceUSD,
    }),
    { syp: 0, usd: 0 },
  )
}