import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, reduceState, normalizeState } from '../src/core.js';
import { calendarWeek, plannedDates, shiftDate } from '../src/schedule.js';
import { createDraft, nextSession, createBackup, parseBackup } from '../src/planner.js';
const monday = '2026-09-07';
const onboard = () =>
  reduceState(
    emptyState(),
    'onboard',
    {
      profile: {
        name: 'Narmin',
        heightCm: 165,
        weightKg: 60,
        email: '',
        program: 'couple',
        gymDays: [1, 3, 5],
      },
    },
    monday,
  );
const flex = () => reduceState(onboard(), 'schedule', { flexible: true }, monday);
const dates = (state, date) => calendarWeek(state, date).map((slot) => slot.date);
const done = (state, date) =>
  reduceState(
    state,
    'complete',
    {
      sessionId: nextSession(state).id,
      results: Object.entries(createDraft(state)).map(([exerciseId, log]) => ({
        exerciseId,
        workingKg: log.kg,
        reps: [12, 12, 12],
        skipped: false,
      })),
    },
    date,
  );
test('missed Monday becomes Tuesday Wednesday Friday, including an unopened app', () => {
  const state = flex();
  assert.deepEqual(dates(state, '2026-09-08'), ['2026-09-08', '2026-09-09', '2026-09-11']);
  const skipped = reduceState(state, 'skip-session', { sessionId: nextSession(state).id }, monday);
  assert.deepEqual(dates(skipped, monday), ['2026-09-08', '2026-09-09', '2026-09-11']);
  assert.equal(skipped.queue.nextIndex, 0);
  const undone = reduceState(skipped, 'undo-session', null, monday);
  assert.deepEqual(dates(undone, monday), [monday, '2026-09-09', '2026-09-11']);
});
test('Tuesday Wednesday then early Thursday replaces Friday, optional Saturday is independent', () => {
  let state = done(done(flex(), '2026-09-08'), '2026-09-09');
  assert.deepEqual(dates(state, '2026-09-10'), ['2026-09-11']);
  state = reduceState(state, 'train-today', null, '2026-09-10');
  assert.deepEqual(dates(state, '2026-09-10'), ['2026-09-10']);
  assert.equal(state.queue.nextIndex, 2);
  assert.deepEqual(dates(normalizeState(JSON.parse(JSON.stringify(state))), '2026-09-10'), [
    '2026-09-10',
  ]);
  const cancelled = reduceState(state, 'cancel-training', null, '2026-09-10');
  assert.deepEqual(dates(cancelled, '2026-09-10'), ['2026-09-11']);
  state = done(state, '2026-09-10');
  assert.deepEqual(dates(state, '2026-09-10'), []);
  state = reduceState(state, 'extra-day', { date: '2026-09-12' }, '2026-09-10');
  assert.deepEqual(dates(state, '2026-09-10'), ['2026-09-12']);
  assert.equal(calendarWeek(state, '2026-09-10')[0].optional, true);
  assert.deepEqual(dates(state, '2026-09-13'), []);
  assert.deepEqual(dates(state, '2026-09-14'), ['2026-09-14', '2026-09-16', '2026-09-18']);
  assert.deepEqual(dates(parseBackup(createBackup(state)), '2026-09-10'), ['2026-09-12']);
  state = reduceState(state, 'remove-extra', { date: '2026-09-12' }, '2026-09-10');
  assert.deepEqual(dates(state, '2026-09-10'), []);
});
test('fixed mode is preserved for older saves and extra training does not remove a slot', () => {
  const state = onboard();
  delete state.schedule;
  assert.equal(normalizeState(state).schedule.flexible, false);
  const training = reduceState(state, 'train-today', null, '2026-09-08');
  assert.deepEqual(dates(training, '2026-09-08'), ['2026-09-08', '2026-09-09', '2026-09-11']);
  assert.deepEqual(dates(done(state, '2026-09-08'), '2026-09-08'), ['2026-09-09', '2026-09-11']);
});
test('multiple missed days avoid collisions and a missed week never piles up', () => {
  const state = flex();
  assert.deepEqual(dates(state, '2026-09-10'), ['2026-09-10', '2026-09-11', '2026-09-12']);
  const future = plannedDates(state, '2026-10-05', 6);
  assert.equal(new Set(future.map((slot) => slot.date)).size, 6);
  assert.deepEqual(
    future.slice(0, 3).map((slot) => slot.date),
    ['2026-10-05', '2026-10-07', '2026-10-09'],
  );
});
test('reject duplicate, corrupt, past and distant extra dates without changing a save', () => {
  const state = flex();
  for (const date of [monday, '2026-09-06', '2026-02-31', 'garbage', '2027-01-01'])
    assert.throws(() => reduceState(state, 'extra-day', { date }, monday));
  const added = reduceState(state, 'extra-day', { date: '2026-09-12' }, monday);
  assert.throws(() => reduceState(added, 'extra-day', { date: '2026-09-12' }, monday));
  assert.throws(() => normalizeState({ ...state, schedule: { flexible: 'yes' } }));
  assert.equal(state.schedule.extraDates.length, 0);
});
test('week edges, new accounts and daylight saving dates stay local and bounded', () => {
  const state = reduceState(
    emptyState(),
    'onboard',
    { profile: { ...onboard().profile } },
    '2026-09-09',
  );
  state.schedule.flexible = true;
  assert.deepEqual(dates(state, '2026-09-09'), ['2026-09-09', '2026-09-11']);
  assert.equal(shiftDate('2026-10-25', 1), '2026-10-26');
  assert.equal(shiftDate('2026-12-31', 1), '2027-01-01');
  const daily = { ...flex(), profile: { ...flex().profile, gymDays: [0, 1, 2, 3, 4, 5, 6] } };
  const skipped = reduceState(
    daily,
    'skip-session',
    { sessionId: nextSession(daily).id },
    '2026-09-13',
  );
  assert.deepEqual(dates(skipped, '2026-09-13'), []);
  assert.equal(plannedDates(skipped, '2026-09-13')[0].date, '2026-09-14');
});
