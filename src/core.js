import { exercises, sessionsFor } from './catalog.js';

export const emptyState = () => ({ onboardingComplete: false, profile: null, smtp: null, queue: { nextIndex: 0, pendingMakeups: [] }, lifts: {}, history: [] });
export function isoDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function requireThat(ok, message) { if (!ok) throw new Error(message); }
function number(value, min, max, label) {
  requireThat(typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max, `${label} must be between ${min} and ${max}.`);
  return value;
}
export function validateProfile(profile) {
  requireThat(profile && typeof profile.name === 'string' && profile.name.trim().length > 0 && profile.name.length <= 100, 'Enter a name (up to 100 characters).');
  number(profile.heightCm, 50, 260, 'Height');
  number(profile.weightKg, 20, 500, 'Body weight');
  requireThat(['couple', 'ull'].includes(profile.program), 'Choose a valid program.');
  requireThat(Array.isArray(profile.gymDays) && profile.gymDays.length > 0 && profile.gymDays.every(d => Number.isInteger(d) && d >= 0 && d <= 6), 'Choose at least one valid gym day.');
  requireThat(typeof profile.email === 'string' && (!profile.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)), 'Enter a valid email address or leave it empty.');
  return { name: profile.name.trim(), email: profile.email.trim(), heightCm: profile.heightCm, weightKg: profile.weightKg, program: profile.program, gymDays: [...new Set(profile.gymDays)].sort() };
}
export function seedLifts(weightKg, existing = {}) {
  return Object.fromEntries(exercises.map(ex => [ex.id, existing[ex.id] ?? { workingKg: Math.max(2.5, Math.round(Math.max(40, weightKg) * ex.bodyweightFactor / 2.5) * 2.5), lastSets: [], lastDate: null, estimated: true }]));
}
export function normalizeState(raw) {
  requireThat(raw && typeof raw === 'object' && !Array.isArray(raw), 'Saved data is invalid. Restore a backup.');
  const state = { ...emptyState(), ...raw };
  if (state.onboardingComplete) state.profile = validateProfile(state.profile);
  state.queue = { ...emptyState().queue, ...state.queue };
  requireThat(Number.isSafeInteger(state.queue.nextIndex) && state.queue.nextIndex >= 0 && Array.isArray(state.queue.pendingMakeups) && Array.isArray(state.history), 'Saved workout data is invalid. Restore a backup.');
  requireThat(state.history.every(entry => entry && /^\d{4}-\d{2}-\d{2}$/.test(entry.date) && typeof entry.sessionName === 'string' && typeof entry.done === 'boolean' && Array.isArray(entry.skippedExerciseIds)), 'Saved history is invalid. Restore a backup.');
  requireThat(state.queue.pendingMakeups.every(entry => entry && exercises.some(ex => ex.id === entry.exerciseId) && typeof entry.sessionId === 'string' && Number.isFinite(entry.workingKg) && entry.workingKg >= 0), 'Saved skipped exercises are invalid. Restore a backup.');
  state.lifts = seedLifts(state.profile?.weightKg ?? 60, state.lifts ?? {});
  state.startedOn ??= state.history.length ? state.history.map(entry => entry.date).sort()[0] : isoDate();
  for (const lift of Object.values(state.lifts)) number(lift.workingKg, 0, 2000, 'Saved working weight');
  return state;
}
export function reduceState(input, action, payload, date = isoDate()) {
  const state = normalizeState(input);
  if (action === 'onboard') {
    requireThat(!state.onboardingComplete, 'Setup is already complete.');
    const profile = validateProfile(payload.profile);
    return { ...state, onboardingComplete: true, startedOn: date, profile, smtp: null, lifts: seedLifts(profile.weightKg), queue: emptyState().queue };
  }
  requireThat(state.onboardingComplete, 'Finish setup first.');
  if (action === 'profile') {
    requireThat(payload && Object.keys(payload).every(key => ['name', 'email', 'heightCm', 'weightKg', 'gymDays'].includes(key)), 'Use the Program screen to change programs.');
    return { ...state, profile: validateProfile({ ...state.profile, ...payload }) };
  }
  if (action === 'program') {
    requireThat(['couple', 'ull'].includes(payload), 'Choose a valid program.');
    return payload === state.profile.program ? state : { ...state, profile: { ...state.profile, program: payload }, queue: emptyState().queue };
  }
  if (action === 'smtp') {
    if (payload !== null) {
      requireThat(payload && typeof payload.user === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.user), 'Enter a valid Gmail address.');
      requireThat(typeof payload.appPassword === 'string' && /^[a-zA-Z0-9]{16}$/.test(payload.appPassword.replace(/\s/g, '')), 'Enter a 16-character Gmail app password.');
      payload = { user: payload.user.trim(), appPassword: payload.appPassword.replace(/\s/g, '') };
    }
    return { ...state, smtp: payload };
  }
  if (action === 'lift') {
    requireThat(exercises.some(ex => ex.id === payload.exerciseId), 'Unknown exercise.');
    number(payload.workingKg, 0, 2000, 'Working weight');
    return { ...state, lifts: { ...state.lifts, [payload.exerciseId]: { ...state.lifts[payload.exerciseId], workingKg: payload.workingKg, estimated: false } } };
  }
  requireThat(action === 'complete' || action === 'skip-session', 'Unknown action.');
  const sessions = sessionsFor(state.profile.program);
  const session = sessions[state.queue.nextIndex % sessions.length];
  requireThat(payload?.sessionId === session.id, 'This workout is no longer at the front of the queue. Reopen Home.');
  requireThat(!state.history.some(h => h.date === date), 'A workout is already logged for today.');
  const entry = { date, program: state.profile.program, sessionId: session.id, sessionName: session.name, done: action === 'complete', skippedExerciseIds: [] };
  if (action === 'skip-session') {
    entry.skippedExerciseIds = [...session.exerciseIds];
    return { ...state, history: [entry, ...state.history] };
  }
  const results = payload.results;
  requireThat(Array.isArray(results) && results.length === session.exerciseIds.length && new Set(results.map(r => r.exerciseId)).size === results.length && results.every(r => session.exerciseIds.includes(r.exerciseId)), 'Include each workout exercise exactly once.');
  const lifts = { ...state.lifts };
  const makeups = new Map(state.queue.pendingMakeups.map(m => [`${m.sessionId}:${m.exerciseId}`, m]));
  for (const result of results) {
    const ex = exercises.find(e => e.id === result.exerciseId);
    requireThat(typeof result.skipped === 'boolean', 'Mark each exercise finished or skipped.');
    const key = `${session.id}:${ex.id}`;
    if (result.skipped) {
      entry.skippedExerciseIds.push(ex.id);
      if (!makeups.has(key)) makeups.set(key, { exerciseId: ex.id, sessionId: session.id, workingKg: lifts[ex.id].workingKg });
      continue;
    }
    requireThat(Array.isArray(result.reps) && result.reps.length >= ex.defaultSets && result.reps.length <= 30 && result.reps.every(r => Number.isInteger(r) && r >= 0 && r <= 200), 'Finish all sets with whole reps between 0 and 200, or skip the exercise.');
    const kg = result.workingKg ?? makeups.get(key)?.workingKg ?? lifts[ex.id].workingKg;
    number(kg, 0, 2000, 'Working weight');
    const progressed = result.reps.every(r => r >= ex.maxReps);
    lifts[ex.id] = { workingKg: Math.min(2000, kg + (progressed ? 2.5 : 0)), lastSets: [...result.reps], lastDate: date, estimated: false };
    makeups.delete(key);
  }
  requireThat(results.some(r => !r.skipped), 'No exercises completed. Use Skip this day instead.');
  entry.results = results.map(r => ({ ...r, workingKg: r.workingKg ?? state.lifts[r.exerciseId].workingKg }));
  return { ...state, lifts, queue: { nextIndex: state.queue.nextIndex + 1, pendingMakeups: [...makeups.values()] }, history: [entry, ...state.history] };
}
