import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, reduceState } from '../src/core.js';
import {
  createBackup,
  parseBackup,
  createDraft,
  draftKey,
  validateDraft,
  upcoming,
  workoutStats,
  liftHistory,
} from '../src/planner.js';
const profile = {
  name: 'Alex',
  email: '',
  heightCm: 170,
  weightKg: 70,
  gymDays: [1, 3, 5],
  program: 'couple',
};
const onboard = () => reduceState(emptyState(), 'onboard', { profile }, '2026-09-07');
const payload = (state) => ({
  sessionId: 'chest-tris',
  results: Object.keys(createDraft(state)).map((exerciseId) => ({
    exerciseId,
    workingKg: 20,
    reps: [12, 12, 12],
    skipped: false,
  })),
});
test('undo restores exact weights, queue, and previous history, and is single use', () => {
  const state = onboard(),
    done = reduceState(state, 'complete', payload(state), '2026-09-07');
  const undone = reduceState(done, 'undo-session', null, '2026-09-07');
  assert.deepEqual(undone.lifts, state.lifts);
  assert.deepEqual(undone.queue, state.queue);
  assert.equal(undone.history.length, 0);
  assert.throws(() => reduceState(undone, 'undo-session', null, '2026-09-07'));
  assert.throws(() => reduceState(done, 'undo-session', null, '2026-09-08'));
  const edited = reduceState(done, 'lift', { exerciseId: 'chest-press', workingKg: 30 });
  assert.throws(() => reduceState(edited, 'undo-session', null, '2026-09-07'));
});
test('backup is portable, strips credentials and undo data, and rejects corrupt history', () => {
  const state = onboard(),
    done = reduceState(state, 'complete', payload(state), '2026-09-07');
  done.smtp = { user: 'test@example.com', appPassword: 'secret' };
  const backup = createBackup(done),
    restored = parseBackup(backup);
  assert.equal(backup.state.smtp, null);
  assert.equal(backup.state.undo, undefined);
  assert.deepEqual(restored.history, done.history);
  assert.throws(() => parseBackup({ ...backup, version: 3 }));
  const invalid = structuredClone(backup);
  invalid.state.history[0].results[0].reps = ['12'];
  assert.throws(() => parseBackup(invalid));
  invalid.state.history[0].date = '2026-02-31';
  assert.throws(() => parseBackup(invalid));
});
test('schedule respects gym days, local dates and logged dates', () => {
  const state = onboard();
  let schedule = upcoming(state, new Date(2026, 8, 7), 3);
  assert.deepEqual(
    schedule.map((row) => row.date),
    ['2026-09-07', '2026-09-09', '2026-09-11'],
  );
  const skipped = reduceState(state, 'skip-session', { sessionId: 'chest-tris' }, '2026-09-07');
  schedule = upcoming(skipped, new Date(2026, 8, 7), 3);
  assert.equal(schedule[0].date, '2026-09-09');
  assert.equal(schedule[0].session.id, 'chest-tris');
});
test('draft validation drops corrupt entries and program switches cannot resurrect old drafts', () => {
  const state = onboard(),
    draft = createDraft(state);
  draft['chest-press'].kg = -50;
  assert.equal(validateDraft(state, draft)['chest-press'].kg, state.lifts['chest-press'].workingKg);
  const switched = reduceState(reduceState(state, 'program', 'ull'), 'program', 'couple');
  assert.notEqual(draftKey(switched), draftKey(state));
});
test('progress counts only actual completed results and leaves legacy sessions visible', () => {
  const state = onboard(),
    p = payload(state);
  p.results[0].skipped = true;
  const done = reduceState(state, 'complete', p, '2026-09-07');
  assert.deepEqual(workoutStats(done.history), { sessions: 1, sets: 12, volume: 2880 });
  assert.equal(liftHistory(done.history, 'chest-press').length, 0);
  assert.equal(liftHistory(done.history, 'pec-deck')[0].kg, 20);
  assert.equal(workoutStats([{ done: true }]).sessions, 1);
});
