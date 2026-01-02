export function applyDeduction(amount: number, percentage: number = 5): number {
  const deducted = amount * (percentage / 100);
  return Math.round(deducted * 100) / 100;
}
