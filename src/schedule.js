// Calendar arithmetic uses local noon, including across daylight-saving boundaries.
const stamp = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const shiftDate = (date, amount) => {
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + amount);
  return stamp(value);
};
export const weekStart = (date) =>
  shiftDate(date, -((new Date(`${date}T12:00:00`).getDay() + 6) % 7));
export const emptySchedule = () => ({ flexible: false, trainingDates: [], extraDates: [] });
export function validateSchedule(value) {
  const result = { ...emptySchedule(), ...value };
  const validDate = (date) =>
    typeof date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    Number.isFinite(Date.parse(`${date}T12:00:00`)) &&
    stamp(new Date(`${date}T12:00:00`)) === date;
  if (
    typeof result.flexible !== 'boolean' ||
    ![result.trainingDates, result.extraDates].every(
      (dates) => Array.isArray(dates) && dates.length <= 2000 && dates.every(validDate),
    )
  )
    throw new Error('Saved calendar is invalid. Restore a backup.');
  return {
    flexible: result.flexible,
    trainingDates: [...new Set(result.trainingDates)].sort(),
    extraDates: [...new Set(result.extraDates)].sort(),
  };
}
export function calendarWeek(state, today, start = weekStart(today)) {
  const settings = state.schedule ?? emptySchedule();
  const end = shiftDate(start, 6),
    slots = new Map();
  const history = new Map(state.history.map((entry) => [entry.date, entry]));
  for (let i = 0; i < 7; i++) {
    const date = shiftDate(start, i);
    if (
      date >= state.startedOn &&
      state.profile.gymDays.includes(new Date(`${date}T12:00:00`).getDay())
    )
      slots.set(date, { date, optional: false });
  }
  for (const date of settings.extraDates)
    if (date >= start && date <= end && date >= state.startedOn)
      slots.set(date, { date, optional: true });
  for (let date = start; date <= end && date <= today; date = shiftDate(date, 1)) {
    const entry = history.get(date);
    const training = settings.trainingDates.includes(date);
    if ((entry?.done || training) && !slots.has(date)) {
      const replacement = settings.flexible
        ? [...slots.keys()].filter((day) => day > date).sort()[0]
        : undefined;
      if (replacement) slots.delete(replacement);
      slots.set(date, { date, optional: !replacement, movedFrom: replacement });
    }
    if (entry?.done) {
      slots.delete(date);
      continue;
    }
    const missed = (entry && !entry.done) || date < today;
    if (slots.has(date) && missed) {
      const slot = slots.get(date);
      slots.delete(date);
      if (settings.flexible && !slot.optional) {
        let next = shiftDate(date, 1);
        while (next <= end && slots.has(next)) next = shiftDate(next, 1);
        if (next <= end)
          slots.set(next, { ...slot, date: next, movedFrom: slot.movedFrom ?? date });
      }
    }
  }
  return [...slots.values()]
    .filter((slot) => slot.date >= today && !history.has(slot.date))
    .sort((a, b) => a.date.localeCompare(b.date));
}
export function plannedDates(state, today, count = 6) {
  const dates = [];
  for (
    let start = weekStart(today), weeks = 0;
    dates.length < count && weeks < 105;
    weeks++, start = shiftDate(start, 7)
  )
    dates.push(...calendarWeek(state, today, start));
  return dates.slice(0, count);
}
