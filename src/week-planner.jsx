import React, { useState } from 'react';
import { isoDate } from './core.js';
import { calendarWeek, shiftDate, weekStart } from './schedule.js';
import { formatDay } from './planner.js';
import './week-planner.css';
export function WeekPlanner({ state, onState, today = isoDate(), expanded = false }) {
  const start = weekStart(today),
    plan = calendarWeek(state, today);
  const [extra, setExtra] = useState(
    shiftDate(today, (6 - new Date(`${today}T12:00:00`).getDay() + 7) % 7),
  );
  const [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  async function save(action) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      onState(await action());
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  const done = state.history.filter(
    (entry) => entry.done && entry.date >= start && entry.date <= shiftDate(start, 6),
  ).length;
  return (
    <details className="panel week-planner" open={expanded || undefined}>
      <summary>
        This week · {state.schedule.flexible ? 'Flexible' : 'Usual days'}{' '}
        <span>
          {done} done · {plan.length} planned
        </span>
      </summary>
      <div className="week-planner-content">
        <label className="flex-toggle">
          <input
            type="checkbox"
            checked={state.schedule.flexible}
            disabled={busy}
            onChange={(event) =>
              save(() => window.gym.updateSchedule({ flexible: event.target.checked }))
            }
          />{' '}
          Automatically rebalance my week
        </label>
        <p className="help">
          {state.schedule.flexible
            ? 'Miss a day: its workout moves to the next free day this week. Train early: the next later slot disappears. Your workout order stays intact.'
            : 'Workouts stay on your usual weekdays. Switch on flexible scheduling to move missed days and replace later slots when you train early.'}
        </p>
        <div className="week-days" aria-label="This week’s calendar">
          {Array.from({ length: 7 }, (_, index) => {
            const date = shiftDate(start, index),
              slot = plan.find((item) => item.date === date),
              entry = state.history.find((item) => item.date === date);
            return (
              <div
                key={date}
                className={`week-day ${slot ? 'planned' : ''} ${entry?.done ? 'done' : ''} ${date === today ? 'is-today' : ''}`}
                aria-current={date === today ? 'date' : undefined}
              >
                <span>{formatDay(date, { weekday: 'short' })}</span>
                <strong>{new Date(`${date}T12:00:00`).getDate()}</strong>
                <small>
                  {entry
                    ? entry.done
                      ? 'Done'
                      : 'Skipped'
                    : slot
                      ? slot.optional
                        ? 'Extra'
                        : 'Gym'
                      : date < today
                        ? '—'
                        : 'Rest'}
                </small>
                {slot?.movedFrom && (
                  <small>From {formatDay(slot.movedFrom, { weekday: 'short' })}</small>
                )}
              </div>
            );
          })}
        </div>
        <p className="help">
          Usual weekdays return next week. Unfinished workouts stay next in line; missed weeks don’t
          pile up extra sessions. Extra days are your choice.
        </p>
        <div className="extra-day-form">
          <label>
            Optional extra day
            <input
              type="date"
              value={extra}
              min={today}
              max={shiftDate(today, 90)}
              disabled={busy}
              onChange={(event) => setExtra(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="button secondary"
            disabled={busy || !extra}
            onClick={() => save(() => window.gym.addExtraDay(extra))}
          >
            Add extra day
          </button>
        </div>
        {state.schedule.extraDates
          .filter((date) => date >= today && !state.history.some((entry) => entry.date === date))
          .map((date) => (
            <div className="extra-day-row" key={date}>
              <span>{formatDay(date)} · optional extra</span>
              <button
                type="button"
                className="text-button"
                disabled={busy}
                onClick={() => save(() => window.gym.removeExtraDay(date))}
              >
                Remove {formatDay(date, { weekday: 'short', month: 'short', day: 'numeric' })}
              </button>
            </div>
          ))}
        {state.schedule.trainingDates.includes(today) &&
          !state.history.some((entry) => entry.date === today) && (
            <button
              type="button"
              className="text-button"
              disabled={busy}
              onClick={() => save(() => window.gym.cancelTraining())}
            >
              Put today’s moved workout back
            </button>
          )}
        {error && (
          <p role="alert" className="calendar-error">
            {error}
          </p>
        )}
      </div>
    </details>
  );
}
