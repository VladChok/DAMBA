import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBudget, readState } from '../model.js';

test('baseline: partners and cost categories reconcile with the $120B total', () => {
  const result = calculateBudget(120, 60, 15);
  assert.equal(result.foreign, 72);
  assert.equal(result.domestic, 48);
  assert.equal(result.annual, 8);
  assert.deepEqual(result.partners, [48, 36, 21.599999999999998, 14.4]);
  assert.deepEqual(result.categories, [65, 25, 12, 8, 4, 6]);
});
test('every allowed UI combination conserves capital; zero foreign share remains valid', () => {
  for (let cost = 60; cost <= 300; cost += 10) for (let share = 0; share <= 90; share += 5) for (let years = 5; years <= 30; years++) {
    const r = calculateBudget(cost, share, years);
    assert.ok(Math.abs(r.partners.reduce((a, b) => a + b, 0) - cost) < 1e-9);
    assert.ok(Math.abs(r.categories.reduce((a, b) => a + b, 0) - cost) < 1e-9);
    assert.equal(r.foreign + r.domestic, cost);
    assert.ok(Number.isFinite(r.annual));
  }
});
test('invalid numeric model inputs are rejected', () => {
  for (const args of [[0, 50, 15], [120, 50, 0], [NaN, 60, 15], [120, -1, 15], [120, 101, 15]]) assert.throws(() => calculateBudget(...args), RangeError);
});
test('shared URL sanitizes malformed, out-of-range and off-step inputs', () => {
  assert.deepEqual(readState('?cost=999&share=-1&years=0&future=alternative'), { cost: 300, share: 0, years: 5, alternative: true });
  assert.deepEqual(readState('?cost=abc&share=&years=Infinity'), readState(''));
  assert.deepEqual(readState('?cost=125&share=67&years=21.2'), { cost: 130, share: 65, years: 21, alternative: false });
});
