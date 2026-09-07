import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, reduceState, normalizeState } from '../src/core.js';
import { sessionsFor } from '../src/catalog.js';
const profile = {
  name: 'Test',
  email: '',
  heightCm: 170,
  weightKg: 70,
  gymDays: [1, 3, 5],
  program: 'couple',
};
const onboard = () => reduceState(emptyState(), 'onboard', { profile });
function workout(state, overrides = {}) {
  const session = sessionsFor(state.profile.program)[state.queue.nextIndex % 3];
  return {
    sessionId: session.id,
    results: session.exerciseIds.map((exerciseId) => ({
      exerciseId,
      reps: [12, 12, 12],
      skipped: false,
      workingKg: 20,
      ...overrides,
    })),
  };
}
test('onboarding validates and seeds all lifts', () => {
  assert.equal(Object.keys(onboard().lifts).length, 16);
  for (const patch of [
    { name: '' },
    { weightKg: NaN },
    { heightCm: 0 },
    { gymDays: [] },
    { program: 'bad' },
    { email: 'invalid' },
  ])
    assert.throws(() =>
      reduceState(emptyState(), 'onboard', { profile: { ...profile, ...patch } }),
    );
});
test('only complete sets progress and the actual working weight is used', () => {
  const state = onboard();
  const next = reduceState(state, 'complete', workout(state), '2026-09-07');
  assert.equal(next.lifts['chest-press'].workingKg, 22.5);
  assert.deepEqual(next.lifts['chest-press'].lastSets, [12, 12, 12]);
  assert.equal(next.lifts['chest-press'].estimated, false);
  assert.equal(next.history[0].results[0].workingKg, 20);
  assert.equal(state.queue.nextIndex, 0);
  assert.equal(next.queue.nextIndex, 1);
  const partial = reduceState(
    state,
    'complete',
    workout(state, { reps: [12, 11, 12], workingKg: 21 }),
    '2026-09-07',
  );
  assert.equal(partial.lifts['chest-press'].workingKg, 21);
  const zero = reduceState(
    state,
    'complete',
    workout(state, { reps: [0, 0, 0], workingKg: 0 }),
    '2026-09-07',
  );
  assert.equal(zero.lifts['chest-press'].workingKg, 0);
});
test('reject invalid, missing, duplicate and incomplete exercise results atomically', () => {
  const state = onboard();
  const before = structuredClone(state);
  for (const patch of [
    { reps: [] },
    { reps: [12] },
    { reps: [NaN, 12, 12] },
    { reps: [1.5, 12, 12] },
    { workingKg: -1 },
    { workingKg: Infinity },
  ])
    assert.throws(() => reduceState(state, 'complete', workout(state, patch)));
  const payload = workout(state);
  payload.results[0] = payload.results[1];
  assert.throws(() => reduceState(state, 'complete', payload));
  assert.throws(() => reduceState(state, 'complete', { ...workout(state), results: [] }));
  assert.deepEqual(state, before);
});
test('duplicate completion is rejected, including a different next workout on the same date', () => {
  const state = onboard();
  const payload = workout(state);
  const next = reduceState(state, 'complete', payload, '2026-09-07');
  assert.throws(() => reduceState(next, 'complete', payload, '2026-09-07'));
  assert.throws(() => reduceState(next, 'complete', workout(next), '2026-09-07'));
});
test('skipped days keep the unfinished session and prevent duplicate logging', () => {
  const state = onboard();
  const skipped = reduceState(state, 'skip-session', { sessionId: 'chest-tris' }, '2026-09-07');
  assert.equal(skipped.queue.nextIndex, 0);
  assert.equal(skipped.history[0].done, false);
  assert.throws(() => reduceState(skipped, 'complete', workout(skipped), '2026-09-07'));
  assert.equal(reduceState(skipped, 'complete', workout(skipped), '2026-09-09').queue.nextIndex, 1);
});
test('skipped exercises replay the original weight and clear after completion', () => {
  const state = onboard();
  const payload = workout(state);
  payload.results[0].skipped = true;
  let next = reduceState(state, 'complete', payload, '2026-09-07');
  const original = state.lifts['chest-press'].workingKg;
  assert.equal(next.queue.pendingMakeups[0].workingKg, original);
  next = reduceState(next, 'complete', workout(next), '2026-09-09');
  next = reduceState(next, 'complete', workout(next), '2026-09-11');
  const replay = workout(next);
  delete replay.results[0].workingKg;
  next = reduceState(next, 'complete', replay, '2026-09-14');
  assert.equal(next.lifts['chest-press'].workingKg, original + 2.5);
  assert.equal(next.queue.pendingMakeups.length, 0);
});
test('program switches preserve lifts and history', () => {
  let state = onboard();
  state = reduceState(state, 'complete', workout(state), '2026-09-07');
  const switched = reduceState(state, 'program', 'ull');
  assert.deepEqual(switched.lifts, state.lifts);
  assert.deepEqual(switched.history, state.history);
  assert.equal(switched.queue.nextIndex, 0);
});
test('weights, SMTP settings and corrupted saves are validated', () => {
  const state = onboard();
  assert.throws(() => reduceState(state, 'lift', { exerciseId: 'bad', workingKg: 20 }));
  assert.throws(() => reduceState(state, 'lift', { exerciseId: 'chest-press', workingKg: -20 }));
  assert.throws(() =>
    reduceState(state, 'smtp', { user: 'test@example.com', appPassword: 'short' }),
  );
  assert.equal(
    reduceState(state, 'smtp', { user: 'test@example.com', appPassword: 'abcd efgh ijkl mnop' })
      .smtp.appPassword,
    'abcdefghijklmnop',
  );
  assert.throws(() => normalizeState({ ...state, queue: { nextIndex: -1 } }));
  assert.throws(() => normalizeState({ ...state, profile: null }));
  assert.throws(() => reduceState(state, 'complete', workout(state, { skipped: true })));
});
