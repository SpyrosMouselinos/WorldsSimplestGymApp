import { exercises, sessionsFor } from './catalog.js';
import { emptySchedule, validateSchedule, plannedDates, shiftDate } from './schedule.js';

export const emptyState = () => ({
  onboardingComplete: false,
  profile: null,
  smtp: null,
  queue: { nextIndex: 0, pendingMakeups: [] },
  lifts: {},
  history: [],
  schedule: emptySchedule(),
});
export function isoDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function requireThat(ok, message) {
  if (!ok) throw new Error(message);
}
function number(value, min, max, label) {
  requireThat(
    typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max,
    `${label} must be between ${min} and ${max}.`,
  );
  return value;
}
function validDate(value) {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(`${value}T12:00:00Z`)) &&
    new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value
  );
}
export function validateProfile(profile) {
  requireThat(
    profile &&
      typeof profile.name === 'string' &&
      profile.name.trim().length > 0 &&
      profile.name.length <= 100,
    'Enter a name (up to 100 characters).',
  );
  number(profile.heightCm, 50, 260, 'Height');
  number(profile.weightKg, 20, 500, 'Body weight');
  requireThat(['couple', 'ull'].includes(profile.program), 'Choose a valid program.');
  requireThat(
    Array.isArray(profile.gymDays) &&
      profile.gymDays.length > 0 &&
      profile.gymDays.every((d) => Number.isInteger(d) && d >= 0 && d <= 6),
    'Choose at least one valid gym day.',
  );
  requireThat(
    typeof profile.email === 'string' &&
      (!profile.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)),
    'Enter a valid email address or leave it empty.',
  );
  return {
    name: profile.name.trim(),
    email: profile.email.trim(),
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    program: profile.program,
    gymDays: [...new Set(profile.gymDays)].sort(),
  };
}
export function seedLifts(weightKg, existing = {}) {
  return Object.fromEntries(
    exercises.map((ex) => [
      ex.id,
      existing[ex.id] ?? {
        workingKg: Math.max(
          2.5,
          Math.round((Math.max(40, weightKg) * ex.bodyweightFactor) / 2.5) * 2.5,
        ),
        lastSets: [],
        lastDate: null,
        estimated: true,
      },
    ]),
  );
}
export function normalizeState(raw) {
  requireThat(
    raw && typeof raw === 'object' && !Array.isArray(raw),
    'Saved data is invalid. Restore a backup.',
  );
  const state = { ...emptyState(), ...raw };
  state.schedule = validateSchedule(state.schedule);
  if (state.onboardingComplete) state.profile = validateProfile(state.profile);
  state.queue = { ...emptyState().queue, ...state.queue };
  requireThat(
    Number.isSafeInteger(state.queue.nextIndex) &&
      state.queue.nextIndex >= 0 &&
      Array.isArray(state.queue.pendingMakeups) &&
      Array.isArray(state.history),
    'Saved workout data is invalid. Restore a backup.',
  );
  requireThat(
    state.queue.generation === undefined ||
      (Number.isSafeInteger(state.queue.generation) && state.queue.generation >= 0),
    'Saved queue version is invalid.',
  );
  const knownExercise = (id) => exercises.some((ex) => ex.id === id);
  const knownSession = (id) =>
    [...sessionsFor('couple'), ...sessionsFor('ull')].some((session) => session.id === id);
  const validReps = (reps) =>
    Array.isArray(reps) &&
    reps.length <= 30 &&
    reps.every((rep) => Number.isInteger(rep) && rep >= 0 && rep <= 200);
  const validResult = (result) =>
    result &&
    knownExercise(result.exerciseId) &&
    typeof result.skipped === 'boolean' &&
    validReps(result.reps) &&
    Number.isFinite(result.workingKg) &&
    result.workingKg >= 0 &&
    result.workingKg <= 2000;
  requireThat(
    state.history.every(
      (entry) =>
        entry &&
        validDate(entry.date) &&
        knownSession(entry.sessionId) &&
        typeof entry.sessionName === 'string' &&
        typeof entry.done === 'boolean' &&
        Array.isArray(entry.skippedExerciseIds) &&
        entry.skippedExerciseIds.every(knownExercise) &&
        (entry.results === undefined ||
          (Array.isArray(entry.results) && entry.results.every(validResult))),
    ),
    'Saved history is invalid. Restore a backup.',
  );
  requireThat(
    state.queue.pendingMakeups.every(
      (entry) =>
        entry &&
        knownExercise(entry.exerciseId) &&
        knownSession(entry.sessionId) &&
        Number.isFinite(entry.workingKg) &&
        entry.workingKg >= 0 &&
        entry.workingKg <= 2000,
    ),
    'Saved skipped exercises are invalid. Restore a backup.',
  );
  state.lifts = seedLifts(state.profile?.weightKg ?? 60, state.lifts ?? {});
  state.startedOn ??= state.history.length
    ? state.history.map((entry) => entry.date).sort()[0]
    : isoDate();
  requireThat(validDate(state.startedOn), 'Saved start date is invalid.');
  for (const lift of Object.values(state.lifts)) {
    number(lift?.workingKg, 0, 2000, 'Saved working weight');
    requireThat(
      validReps(lift.lastSets) &&
        (lift.lastDate === null || validDate(lift.lastDate)) &&
        typeof lift.estimated === 'boolean',
      'Saved exercise data is invalid.',
    );
  }
  return state;
}
export function reduceState(input, action, payload, date = isoDate()) {
  const state = normalizeState(input);
  if (action === 'onboard') {
    requireThat(!state.onboardingComplete, 'Setup is already complete.');
    const profile = validateProfile(payload.profile);
    return {
      ...state,
      onboardingComplete: true,
      startedOn: date,
      profile,
      smtp: null,
      lifts: seedLifts(profile.weightKg),
      queue: emptyState().queue,
    };
  }
  requireThat(state.onboardingComplete, 'Finish setup first.');
  if (action === 'schedule') {
    requireThat(payload && typeof payload.flexible === 'boolean', 'Choose a scheduling mode.');
    return { ...state, schedule: { ...state.schedule, flexible: payload.flexible } };
  }
  if (action === 'train-today') {
    requireThat(
      !state.history.some((entry) => entry.date === date),
      'Today is already logged. Undo the log first.',
    );
    return {
      ...state,
      schedule: validateSchedule({
        ...state.schedule,
        trainingDates: [...state.schedule.trainingDates, date],
      }),
    };
  }
  if (action === 'cancel-training') {
    requireThat(
      !state.history.some((entry) => entry.date === date),
      'Today is already logged. Undo the log first.',
    );
    return {
      ...state,
      schedule: {
        ...state.schedule,
        trainingDates: state.schedule.trainingDates.filter((day) => day !== date),
      },
    };
  }
  if (action === 'extra-day') {
    const settings = validateSchedule({ ...state.schedule, extraDates: [payload?.date] });
    const extra = settings.extraDates[0];
    requireThat(
      extra >= date && extra <= shiftDate(date, 90),
      'Choose an extra day within the next 90 days.',
    );
    requireThat(
      !state.history.some((entry) => entry.date === extra),
      'That day is already logged.',
    );
    requireThat(
      !plannedDates(state, date, 100).some((slot) => slot.date === extra),
      'That day is already planned.',
    );
    return {
      ...state,
      schedule: validateSchedule({
        ...state.schedule,
        extraDates: [...state.schedule.extraDates, extra],
      }),
    };
  }
  if (action === 'remove-extra') {
    requireThat(
      payload?.date >= date && !state.history.some((entry) => entry.date === payload.date),
      'Only an upcoming extra day can be removed.',
    );
    return {
      ...state,
      schedule: {
        ...state.schedule,
        extraDates: state.schedule.extraDates.filter((day) => day !== payload.date),
      },
    };
  }
  if (action === 'undo-session') {
    const latest = state.history[0];
    requireThat(
      state.undo &&
        latest &&
        latest.date === date &&
        latest.date === state.undo.date &&
        latest.sessionId === state.undo.sessionId,
      'Only today’s latest workout can be undone.',
    );
    return {
      ...state,
      lifts: state.undo.lifts,
      queue: state.undo.queue,
      history: state.history.slice(1),
      undo: null,
    };
  }
  if (action === 'profile') {
    requireThat(
      payload &&
        Object.keys(payload).every((key) =>
          ['name', 'email', 'heightCm', 'weightKg', 'gymDays'].includes(key),
        ),
      'Use the Program screen to change programs.',
    );
    return { ...state, profile: validateProfile({ ...state.profile, ...payload }) };
  }
  if (action === 'program') {
    requireThat(['couple', 'ull'].includes(payload), 'Choose a valid program.');
    return payload === state.profile.program
      ? state
      : {
          ...state,
          profile: { ...state.profile, program: payload },
          queue: { ...emptyState().queue, generation: (state.queue.generation ?? 0) + 1 },
          undo: null,
        };
  }
  if (action === 'smtp') {
    if (payload !== null) {
      requireThat(
        payload &&
          typeof payload.user === 'string' &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.user),
        'Enter a valid Gmail address.',
      );
      requireThat(
        typeof payload.appPassword === 'string' &&
          /^[a-zA-Z0-9]{16}$/.test(payload.appPassword.replace(/\s/g, '')),
        'Enter a 16-character Gmail app password.',
      );
      payload = { user: payload.user.trim(), appPassword: payload.appPassword.replace(/\s/g, '') };
    }
    return { ...state, smtp: payload };
  }
  if (action === 'lift') {
    requireThat(
      exercises.some((ex) => ex.id === payload.exerciseId),
      'Unknown exercise.',
    );
    number(payload.workingKg, 0, 2000, 'Working weight');
    return {
      ...state,
      undo: null,
      lifts: {
        ...state.lifts,
        [payload.exerciseId]: {
          ...state.lifts[payload.exerciseId],
          workingKg: payload.workingKg,
          estimated: false,
        },
      },
    };
  }
  requireThat(action === 'complete' || action === 'skip-session', 'Unknown action.');
  const sessions = sessionsFor(state.profile.program);
  const session = sessions[state.queue.nextIndex % sessions.length];
  requireThat(
    payload?.sessionId === session.id,
    'This workout is no longer at the front of the queue. Reopen Home.',
  );
  requireThat(
    !state.history.some((h) => h.date === date),
    'A workout is already logged for today.',
  );
  const entry = {
    date,
    program: state.profile.program,
    sessionId: session.id,
    sessionName: session.name,
    done: action === 'complete',
    skippedExerciseIds: [],
  };
  const undo = {
    date,
    sessionId: session.id,
    lifts: structuredClone(state.lifts),
    queue: structuredClone(state.queue),
  };
  if (action === 'skip-session') {
    entry.skippedExerciseIds = [...session.exerciseIds];
    return { ...state, undo, history: [entry, ...state.history] };
  }
  const results = payload.results;
  requireThat(
    Array.isArray(results) &&
      results.length === session.exerciseIds.length &&
      new Set(results.map((r) => r.exerciseId)).size === results.length &&
      results.every((r) => session.exerciseIds.includes(r.exerciseId)),
    'Include each workout exercise exactly once.',
  );
  const lifts = { ...state.lifts };
  const usedWeights = {};
  const makeups = new Map(
    state.queue.pendingMakeups.map((m) => [`${m.sessionId}:${m.exerciseId}`, m]),
  );
  for (const result of results) {
    const ex = exercises.find((e) => e.id === result.exerciseId);
    requireThat(typeof result.skipped === 'boolean', 'Mark each exercise finished or skipped.');
    requireThat(
      Array.isArray(result.reps) &&
        result.reps.length <= 30 &&
        result.reps.every((rep) => Number.isInteger(rep) && rep >= 0 && rep <= 200),
      'Use whole reps between 0 and 200.',
    );
    if (result.workingKg !== undefined) number(result.workingKg, 0, 2000, 'Working weight');
    const key = `${session.id}:${ex.id}`;
    if (result.skipped) {
      entry.skippedExerciseIds.push(ex.id);
      if (!makeups.has(key))
        makeups.set(key, {
          exerciseId: ex.id,
          sessionId: session.id,
          workingKg: lifts[ex.id].workingKg,
        });
      continue;
    }
    requireThat(
      Array.isArray(result.reps) &&
        result.reps.length >= ex.defaultSets &&
        result.reps.length <= 30 &&
        result.reps.every((r) => Number.isInteger(r) && r >= 0 && r <= 200),
      'Finish all sets with whole reps between 0 and 200, or skip the exercise.',
    );
    const kg = result.workingKg ?? makeups.get(key)?.workingKg ?? lifts[ex.id].workingKg;
    number(kg, 0, 2000, 'Working weight');
    usedWeights[ex.id] = kg;
    const progressed = result.reps.every((r) => r >= ex.maxReps);
    lifts[ex.id] = {
      workingKg: Math.min(2000, kg + (progressed ? 2.5 : 0)),
      lastSets: [...result.reps],
      lastDate: date,
      estimated: false,
    };
    makeups.delete(key);
  }
  requireThat(
    results.some((r) => !r.skipped),
    'No exercises completed. Use Skip this day instead.',
  );
  entry.results = results.map((r) => ({
    ...r,
    workingKg: usedWeights[r.exerciseId] ?? r.workingKg ?? state.lifts[r.exerciseId].workingKg,
  }));
  return {
    ...state,
    undo,
    lifts,
    queue: {
      ...state.queue,
      nextIndex: state.queue.nextIndex + 1,
      pendingMakeups: [...makeups.values()],
    },
    history: [entry, ...state.history],
  };
}
