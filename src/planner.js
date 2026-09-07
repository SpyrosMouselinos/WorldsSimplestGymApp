import { exercises, sessionsFor } from './catalog.js';
import { isoDate, normalizeState } from './core.js';

export const programNames = { couple: 'Major + minor', ull: 'Upper / Lower / Legs' };
export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function nextSession(state) {
  const sessions = sessionsFor(state.profile.program);
  return sessions[state.queue.nextIndex % sessions.length];
}
export function upcoming(state, from = new Date(), count = 6) {
  const dates = [],
    cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const logged = new Set(state.history.map((entry) => entry.date));
  const sessions = sessionsFor(state.profile.program);
  for (
    let offset = 0;
    dates.length < count && offset < 730;
    offset++, cursor.setDate(cursor.getDate() + 1)
  ) {
    if (state.profile.gymDays.includes(cursor.getDay()) && !logged.has(isoDate(cursor)))
      dates.push({
        date: isoDate(cursor),
        session: sessions[(state.queue.nextIndex + dates.length) % sessions.length],
      });
  }
  return dates;
}
export function formatDay(stamp, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return new Date(`${stamp}T12:00:00`).toLocaleDateString(undefined, options);
}
export function draftKey(state) {
  return `gym-draft-v2:${state.profile.program}:${state.queue.nextIndex}:${state.queue.generation ?? 0}`;
}
export function createDraft(state) {
  return Object.fromEntries(
    nextSession(state).exerciseIds.map((id) => {
      const exercise = exercises.find((ex) => ex.id === id);
      const replay = state.queue.pendingMakeups.find(
        (item) => item.sessionId === nextSession(state).id && item.exerciseId === id,
      );
      return [
        id,
        {
          kg: replay?.workingKg ?? state.lifts[id].workingKg,
          skipped: false,
          sets: Array.from({ length: exercise.defaultSets }, () => ({
            reps: exercise.maxReps,
            done: false,
          })),
        },
      ];
    }),
  );
}
export function validateDraft(state, raw) {
  const draft = createDraft(state);
  for (const id of Object.keys(draft)) {
    const log = raw?.[id];
    if (
      log &&
      Number.isFinite(log.kg) &&
      log.kg >= 0 &&
      log.kg <= 2000 &&
      typeof log.skipped === 'boolean' &&
      Array.isArray(log.sets) &&
      log.sets.length >= 3 &&
      log.sets.length <= 30 &&
      log.sets.every(
        (set) =>
          Number.isInteger(set.reps) &&
          set.reps >= 0 &&
          set.reps <= 200 &&
          typeof set.done === 'boolean',
      )
    )
      draft[id] = { kg: log.kg, skipped: log.skipped, sets: log.sets.map((set) => ({ ...set })) };
  }
  return draft;
}
export const wrapped = (log) => log.skipped || log.sets.every((set) => set.done);
export function workoutStats(history) {
  const completed = history.filter((entry) => entry.done);
  const results = completed
    .flatMap((entry) => entry.results ?? [])
    .filter((result) => !result.skipped);
  return {
    sessions: completed.length,
    sets: results.reduce((sum, result) => sum + result.reps.length, 0),
    volume: results.reduce(
      (sum, result) =>
        sum + result.reps.reduce((total, reps) => total + reps * result.workingKg, 0),
      0,
    ),
  };
}
export function liftHistory(history, exerciseId) {
  return history
    .filter((entry) => entry.done)
    .flatMap((entry) => {
      const result = entry.results?.find(
        (result) => result.exerciseId === exerciseId && !result.skipped,
      );
      return result ? [{ date: entry.date, kg: result.workingKg, reps: result.reps }] : [];
    })
    .reverse();
}
export function createBackup(state) {
  const { onboardingComplete, startedOn, profile, queue, lifts, history } = normalizeState(state);
  return {
    format: 'worlds-simplest-gym',
    version: 1,
    exportedAt: new Date().toISOString(),
    state: { onboardingComplete, startedOn, profile, queue, lifts, history, smtp: null },
  };
}
export function parseBackup(value) {
  if (
    value?.format !== 'worlds-simplest-gym' ||
    value.version !== 1 ||
    !value.state?.onboardingComplete
  )
    throw new Error('This is not a supported gym backup. Choose a backup exported from this app.');
  const state = normalizeState(value.state);
  return { ...state, smtp: null, undo: null };
}
