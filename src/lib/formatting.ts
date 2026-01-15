export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
export function calculateVariance(billed: number, fmv: number) {
  const variance = billed - fmv;
  const variancePercent = fmv > 0 ? (variance / fmv) * 100 : 0;
  return {
    variance,
    variancePercent
  };
}
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}