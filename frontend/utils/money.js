/**
 * Format a number as Pakistani Rupees.
 * Example: 1250.5 -> "Rs 1,250.50"
 */
export function formatRs(amount) {
  const value = Number(amount) || 0
  // en-PK gives thousands separators; always show 2 decimals
  return `Rs ${value.toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
