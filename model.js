/** Illustrative circa-1990 USD only; not an engineering estimate. */
export function calculateBudget(cost, foreignShare, years) {
  if (![cost, foreignShare, years].every(Number.isFinite) || cost <= 0 || years <= 0 || foreignShare < 0 || foreignShare > 100) throw new RangeError('Invalid scenario inputs');
  const foreign = cost * foreignShare / 100;
  return {
    domestic: cost - foreign, foreign, annual: cost / years,
    partners: [cost - foreign, foreign * .5, foreign * .3, foreign * .2],
    categories: [65, 25, 12, 8, 4, 6].map(value => cost * value / 120)
  };
}
export function readState(search) {
  const params = new URLSearchParams(search);
  const number = (key, fallback, min, max, step) => {
    const raw = params.get(key);
    if (raw === null || raw.trim() === '') return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value / step) * step)) : fallback;
  };
  return { cost: number('cost', 120, 60, 300, 10), share: number('share', 60, 0, 90, 5), years: number('years', 15, 5, 30, 1), alternative: params.get('future') === 'alternative' };
}
