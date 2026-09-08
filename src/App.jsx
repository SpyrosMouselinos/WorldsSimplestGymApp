import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { exercises, sessionsFor } from './catalog.js';
import { isoDate, validateProfile } from './core.js';
import {
  createBackup,
  parseBackup,
  createDraft,
  validateDraft,
  draftKey,
  nextSession,
  upcoming,
  formatDay,
  programNames,
  days,
  wrapped,
  workoutStats,
  liftHistory,
} from './planner.js';
import { Icon, Spotter, Button, Field, Modal, Message } from './ui.jsx';
import { AnimalSettings, DayAnimal, EasterEgg } from './animals.jsx';
import { playBark, prepareBark } from './bark.js';
import { MachineIllustration } from './illustrations.js';
import { AnatomyDiagram } from './anatomy.jsx';
import { WeekPlanner } from './week-planner.jsx';
import { Tutorial } from './tutorial.jsx';
import './professional.css';

const api = window.gym;
const nav = [
  { id: 'today', label: 'Today', sub: 'A little stronger' },
  { id: 'progress', label: 'Progress', sub: 'Receipts, please' },
  { id: 'learn', label: 'Learn', sub: 'Meet the machines' },
  { id: 'program', label: 'Program', sub: 'Your game plan' },
  { id: 'settings', label: 'Settings', sub: 'Make yourself at home' },
];
const cleanError = (error) =>
  error.message?.replace(/^Error invoking remote method '[^']+': Error: /, '') ||
  'Something went wrong. Please try again.';
const greetings = [
  'Your muscles called. They appreciate the consistency.',
  'Small steps. Slightly heavier objects.',
  'You showed up. That is the hardest rep.',
  'Strong opinions. Stronger triceps.',
];
function useToday() {
  const [today, setToday] = useState(isoDate());
  useEffect(() => {
    const update = () => setToday(isoDate());
    window.addEventListener('focus', update);
    window.addEventListener('pointerdown', update);
    window.addEventListener('keydown', update);
    return () => {
      window.removeEventListener('focus', update);
      window.removeEventListener('pointerdown', update);
      window.removeEventListener('keydown', update);
    };
  }, []);
  return today;
}
function loadDraft(state) {
  try {
    return validateDraft(
      state,
      JSON.parse(
        localStorage.getItem(draftKey(state)) ??
          ((state.queue.generation ?? 0) === 0
            ? localStorage.getItem(`gym-draft:${state.profile.program}:${state.queue.nextIndex}`)
            : null) ??
          '{}',
      ),
    );
  } catch {
    return createDraft(state);
  }
}
function TitleBar({ onTutorial }) {
  return (
    <header className="window-bar">
      <span>
        <span className="status-dot" /> Worlds Simplest Gym{' '}
        <span className="edition">/ Narmin’s little wins club</span>
        {onTutorial && (
          <button type="button" className="tutorial-launch" onClick={onTutorial}>
            Tutorial
          </button>
        )}
      </span>
      {!document.documentElement.dataset.browser && (
        <div className="window-actions">
          <button aria-label="Minimize" onClick={() => api.minimize()}>
            −
          </button>
          <button aria-label="Maximize" onClick={() => api.maximize()}>
            □
          </button>
          <button aria-label="Close" onClick={() => api.close()}>
            ×
          </button>
        </div>
      )}
    </header>
  );
}
function ScreenHeading({ eyebrow, title, description, children }) {
  return (
    <div className="screen-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
function App() {
  const [tutorial, setTutorial] = useState(false);
  const [offerTutorial, setOfferTutorial] = useState(() => {
    try {
      return localStorage.getItem('gym-tutorial-offer-v1') !== 'seen';
    } catch {
      return true;
    }
  });
  const dismissTutorialOffer = () => {
    setOfferTutorial(false);
    try {
      localStorage.setItem('gym-tutorial-offer-v1', 'seen');
    } catch {}
  };
  const [state, setState] = useState(null),
    [error, setError] = useState(''),
    [screen, setScreen] = useState('today');
  const today = useToday();
  const reload = () => {
    setError('');
    api
      .getState()
      .then(setState)
      .catch((error) => setError(cleanError(error)));
  };
  useEffect(reload, []);
  return (
    <div className="gym-app">
      <TitleBar onTutorial={() => setTutorial(true)} />
      {error ? (
        <main className="opening">
          <Spotter />
          <h1>Let’s get your workouts back.</h1>
          <Message error>{error}</Message>
          <p>Your saved data has not been reset.</p>
          <Button onClick={reload}>Try again</Button>
        </main>
      ) : !state ? (
        <main className="opening">
          <Spotter />
          <p role="status">Warming up the room…</p>
        </main>
      ) : !state.onboardingComplete ? (
        <Onboarding onDone={setState} />
      ) : (
        <div className="app-layout">
          <aside className="sidebar">
            <a
              className="brand"
              href="#today"
              onClick={(event) => {
                event.preventDefault();
                setScreen('today');
              }}
              aria-label="Go to Today"
            >
              <div className="brand-mark">
                <Icon name="weight" size={25} />
              </div>
              <span>
                Worlds
                <br />
                <strong>Simplest Gym.</strong>
              </span>
            </a>
            <p className="sidebar-label">YOUR CORNER</p>
            <nav aria-label="Main navigation">
              {nav.map((item) => (
                <button
                  key={item.id}
                  className={`nav-item ${screen === item.id ? 'active' : ''}`}
                  onClick={() => setScreen(item.id)}
                  aria-current={screen === item.id ? 'page' : undefined}
                  aria-label={item.label}
                >
                  <Icon name={item.id} />
                  <span>
                    {item.label}
                    <small>{item.sub}</small>
                  </span>
                  {screen === item.id && <span className="nav-dot" />}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="club-note">
                <Spotter />
                <p>
                  Big fan of your
                  <br />
                  <strong>showing-up era.</strong>
                </p>
              </div>
              <div className="local-note">
                <Icon name="save" size={15} /> Saved on this device
              </div>
              <div className="user-chip">
                <span>{state.profile.name.slice(0, 1).toUpperCase()}</span>
                <div>
                  <strong>{state.profile.name}</strong>
                  <small>{programNames[state.profile.program]}</small>
                </div>
              </div>
            </div>
          </aside>
          <main
            key={screen}
            id="main-content"
            className={`workspace ${screen === 'today' ? 'workout-workspace' : ''}`}
          >
            {offerTutorial && (
              <div className="tutorial-invite">
                <p>
                  <strong>New here?</strong> Try a short practice workout and learn the buttons.
                </p>
                <Button variant="secondary" onClick={() => setTutorial(true)}>
                  Start tutorial
                </Button>
                <button type="button" className="text-button" onClick={dismissTutorialOffer}>
                  Not now
                </button>
              </div>
            )}
            {screen === 'today' && (
              <Today
                key={`${draftKey(state)}:${today}:${!!state.history.find((entry) => entry.date === today)}`}
                state={state}
                onState={setState}
                today={today}
                onProgress={() => setScreen('progress')}
              />
            )}
            {screen === 'progress' && <Progress state={state} />}
            {screen === 'learn' && <Learn />}
            {screen === 'program' && <Program state={state} onState={setState} />}
            {screen === 'settings' && <Settings state={state} onState={setState} />}
          </main>
        </div>
      )}
      {tutorial && (
        <Tutorial
          onClose={() => {
            setTutorial(false);
            dismissTutorialOffer();
          }}
        />
      )}
    </div>
  );
}

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0),
    [profile, setProfile] = useState({
      name: 'Narmin',
      email: '',
      heightCm: 165,
      weightKg: 60,
      program: 'couple',
      gymDays: [1, 3, 5],
    }),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const titles = [
    'A small app. A stronger you.',
    'A starting point. Not a verdict.',
    'Pick your kind of simple.',
    'Make a little room for you.',
  ];
  const update = (key, value) => setProfile((previous) => ({ ...previous, [key]: value }));
  async function next() {
    setError('');
    try {
      if (!profile.name.trim()) throw new Error('What should we call you?');
      if (step >= 1)
        validateProfile({ ...profile, gymDays: profile.gymDays.length ? profile.gymDays : [1] });
      if (step < 3) {
        setStep(step + 1);
        return;
      }
      validateProfile(profile);
      setBusy(true);
      onDone(await api.completeOnboarding({ profile, smtp: null }));
    } catch (error) {
      setError(cleanError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="onboarding">
      <section className="onboarding-story">
        <div className="eyebrow">WELCOME TO THE LITTLE WINS CLUB</div>
        <h1>
          Less overthinking.
          <br />
          More <em>doing the thing.</em>
        </h1>
        <Spotter happy />
        <p>
          A plan, your reps, and a very supportive bear.
          <br />
          No feed. No leaderboards. No protein powder ads.
        </p>
        <div className="pill">Local first. Yours always.</div>
      </section>
      <section className="setup-card">
        <div className="steps" aria-label={`Setup step ${step + 1} of 4`}>
          {[0, 1, 2, 3].map((index) => (
            <span key={index} className={index <= step ? 'filled' : ''} />
          ))}
        </div>
        <p className="eyebrow">SETTLE IN · {step + 1} OF 4</p>
        <h2>{titles[step]}</h2>
        {step === 0 && (
          <>
            <p className="muted">Let’s make this your corner of the gym.</p>
            <Field
              label="Name"
              placeholder="Your name"
              autoFocus
              value={profile.name}
              maxLength={100}
              onChange={(event) => update('name', event.target.value)}
            />
          </>
        )}
        {step === 1 && (
          <>
            <div className="form-grid">
              <Field
                label="Height (cm)"
                type="number"
                min="50"
                max="260"
                value={profile.heightCm}
                onChange={(event) => update('heightCm', Number(event.target.value))}
              />
              <Field
                label="Weight (kg)"
                type="number"
                min="20"
                max="500"
                value={profile.weightKg}
                onChange={(event) => update('weightKg', Number(event.target.value))}
              />
            </div>
            <p className="help">
              Used for rough starting weights. Machines vary, so adjust these to a weight you can
              control. These are estimates, not goals.
            </p>
          </>
        )}
        {step === 2 && (
          <div className="choice-list">
            {Object.keys(programNames).map((id) => (
              <button
                key={id}
                className={`choice ${profile.program === id ? 'selected' : ''}`}
                aria-pressed={profile.program === id}
                onClick={() => update('program', id)}
              >
                <span className="choice-letter">{id === 'couple' ? 'A' : 'B'}</span>
                <span>
                  <strong>{programNames[id]}</strong>
                  <small>
                    {id === 'couple'
                      ? 'Push, legs, pull. Three sessions, on repeat.'
                      : 'One upper-body session. Two lower-body sessions.'}
                  </small>
                </span>
                <Icon name="check" />
              </button>
            ))}
          </div>
        )}
        {step === 3 && (
          <>
            <p className="muted">
              Choose your usual days. Life happens; your next workout will wait.
            </p>
            <DayPicker value={profile.gymDays} onChange={(value) => update('gymDays', value)} />
          </>
        )}
        <Message error>{error}</Message>
        <div className="setup-actions">
          <Button variant="ghost" disabled={step === 0 || busy} onClick={() => setStep(step - 1)}>
            Back
          </Button>
          <Button disabled={busy} onClick={next}>
            {busy ? 'Saving…' : step < 3 ? 'Next' : 'Let’s do this'}
            <Icon name="arrow" />
          </Button>
        </div>
      </section>
    </main>
  );
}
function DayPicker({ value, onChange }) {
  return (
    <div className="day-picker" aria-label="Gym days">
      {days.map((day, index) => (
        <button
          type="button"
          key={day}
          aria-pressed={value.includes(index)}
          onClick={() =>
            onChange(
              value.includes(index) ? value.filter((d) => d !== index) : [...value, index].sort(),
            )
          }
        >
          {day}
        </button>
      ))}
    </div>
  );
}

function Today({ state, onState, today, onProgress }) {
  const session = nextSession(state),
    todayEntry = state.history.find((entry) => entry.date === today);
  const [draft, setDraft] = useState(() => loadDraft(state)),
    [active, setActive] = useState(0),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [confirm, setConfirm] = useState(null);
  const lock = useRef(false);
  const scheduled = upcoming(state, new Date(`${today}T12:00:00`), 1)[0]?.date === today;
  const canTrain = !todayEntry && (scheduled || state.schedule.trainingDates.includes(today));
  const completed = Object.values(draft).filter(wrapped).length,
    total = session.exerciseIds.length;
  const exercise = exercises.find((ex) => ex.id === session.exerciseIds[active]);
  const allWrapped = completed === total,
    anyCompleted = Object.values(draft).some(
      (log) => !log.skipped && log.sets.every((set) => set.done),
    );
  const schedule = upcoming(state, new Date(`${today}T12:00:00`), 6);
  function onTabKey(event, index) {
    const target =
      event.key === 'ArrowRight'
        ? (index + 1) % total
        : event.key === 'ArrowLeft'
          ? (index + total - 1) % total
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? total - 1
              : null;
    if (target === null) return;
    event.preventDefault();
    setActive(target);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[target].focus();
  }
  function change(id, next) {
    const nextDraft = { ...draft, [id]: next };
    try {
      localStorage.setItem(draftKey(state), JSON.stringify(nextDraft));
      setDraft(nextDraft);
      setError('');
    } catch {
      setError('Could not save the workout draft. Free some device storage and try again.');
    }
  }
  async function submit(action) {
    if (lock.current) return;
    const barkReady = action === 'skip' ? prepareBark() : null;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      let next;
      if (action === 'undo') {
        next = await api.undoSession();
        const restored = createDraft(next);
        for (const result of todayEntry.results ?? [])
          if (restored[result.exerciseId])
            restored[result.exerciseId] = {
              kg: result.workingKg,
              skipped: result.skipped,
              sets: result.reps.map((reps) => ({ reps, done: !result.skipped })),
            };
        try {
          const saved = JSON.parse(localStorage.getItem('gym-undo-draft') ?? 'null');
          const undoDraft =
            saved?.date === today && saved.sessionId === todayEntry.sessionId
              ? saved.draft
              : restored;
          localStorage.setItem(draftKey(next), JSON.stringify(validateDraft(next, undoDraft)));
          localStorage.removeItem('gym-undo-draft');
        } catch {
          window.dispatchEvent(
            new CustomEvent('gym-error', {
              detail: new Error('The log was undone, but its draft could not be recovered.'),
            }),
          );
        }
      } else if (action === 'skip') next = await api.skipSession(session.id, session.name);
      else {
        if (!allWrapped || !anyCompleted)
          throw new Error('Finish each exercise or mark it skipped before saving.');
        next = await api.completeSession({
          sessionId: session.id,
          results: session.exerciseIds.map((id) => ({
            exerciseId: id,
            workingKg: draft[id].kg,
            reps: draft[id].sets.map((set) => set.reps),
            skipped: draft[id].skipped,
          })),
        });
      }
      if (action !== 'undo') {
        try {
          localStorage.setItem(
            'gym-undo-draft',
            JSON.stringify({ date: today, sessionId: session.id, draft }),
          );
          localStorage.removeItem(draftKey(state));
          localStorage.removeItem(`gym-draft:${state.profile.program}:${state.queue.nextIndex}`);
          localStorage.removeItem('gym-rest-v1');
        } catch {
          window.dispatchEvent(
            new CustomEvent('gym-error', {
              detail: new Error(
                'Workout saved, but the temporary draft could not be cleared. Check available device storage.',
              ),
            }),
          );
        }
      }
      if (action === 'skip') void playBark(barkReady);
      onState(next);
      setConfirm(null);
    } catch (error) {
      setError(cleanError(error));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function email() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await api.sendWorkoutEmail({
        sessionName: session.name,
        dateLabel: formatDay(today),
        exercises: session.exerciseIds.map((id) => {
          const ex = exercises.find((ex) => ex.id === id);
          return {
            ...ex,
            sets: draft[id].sets.length,
            kg: draft[id].kg,
            estimated: state.lifts[id].estimated,
            replay: state.queue.pendingMakeups.some(
              (item) => item.exerciseId === id && item.sessionId === session.id,
            ),
          };
        }),
      });
      if (!result.ok) throw new Error(result.error);
      setConfirm('sent');
    } catch (error) {
      setError(cleanError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <ScreenHeading
        eyebrow={`${formatDay(today, { weekday: 'long', month: 'long', day: 'numeric' })} · YOUR PACE, YOUR PLACE`}
        title={
          todayEntry
            ? todayEntry.done
              ? 'That’s a little win.'
              : 'A breather is allowed.'
            : `Hey, ${state.profile.name.split(' ')[0]}. Let’s show up.`
        }
        description={
          greetings[state.history.filter((entry) => entry.done).length % greetings.length]
        }
      >
        <span className="pill">
          <span className="status-dot" /> All changes saved locally
        </span>
      </ScreenHeading>
      <WeekPlanner state={state} onState={onState} today={today} />
      <EasterEgg kind="cat" />
      <Message error>{error}</Message>
      {todayEntry ? (
        <div className="workout-layout">
          <section className="panel celebration">
            <span className="eyebrow">
              {todayEntry.done ? 'WORKOUT IN THE BOOKS' : 'NO GUILT. JUST NEXT TIME.'}
            </span>
            <DayAnimal done={todayEntry.done} name={state.profile.name} />
            <h2>{todayEntry.done ? 'You did the thing.' : 'Your workout can wait.'}</h2>
            <p>
              {todayEntry.done
                ? 'Her Royal Shibaness is delighted. Your workout has been royally approved.'
                : 'Big opinions. Tiny dog. Your workout will be right here when you’re ready.'}
            </p>
            <div className="recap-stats">
              <div>
                <strong>{todayEntry.sessionName}</strong>
                <small>{formatDay(todayEntry.date)}</small>
              </div>
              <div>
                <strong>{workoutStats([todayEntry]).sets}</strong>
                <small>sets logged</small>
              </div>
            </div>
            <div className="actions">
              <Button onClick={onProgress}>
                See your progress <Icon name="arrow" />
              </Button>
              {state.undo?.date === today && (
                <Button variant="ghost" onClick={() => setConfirm('undo')}>
                  Undo today’s log
                </Button>
              )}
            </div>
          </section>
          <Schedule schedule={schedule} />
        </div>
      ) : !canTrain ? (
        <div className="workout-layout">
          <section className="panel rest-day">
            <p className="eyebrow">OFF THE CLOCK</p>
            <Spotter />
            <h2>
              Even the dumbbells
              <br />
              take a day off.
            </h2>
            <p className="muted">
              Your next session is {session.name}
              {schedule[0] ? ` on ${formatDay(schedule[0].date)}` : ''}. The queue is right where
              you left it.
            </p>
            <Button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError('');
                try {
                  onState(await api.trainToday());
                } catch (error) {
                  setError(cleanError(error));
                } finally {
                  setBusy(false);
                }
              }}
            >
              I’m training today <Icon name="arrow" />
            </Button>
            <p className="help">
              {state.schedule.flexible &&
              schedule[0] &&
              schedule[0].date <=
                (() => {
                  const d = new Date(`${today}T12:00:00`);
                  d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
                  return isoDate(d);
                })()
                ? `This replaces ${formatDay(schedule[0].date)}. You can add an optional extra day in This week.`
                : 'Your workout order stays the same. You can adjust this week’s days above.'}
            </p>
          </section>
          <Schedule schedule={schedule} />
        </div>
      ) : (
        <>
          <section className="session-banner">
            <div>
              <p className="eyebrow">
                YOUR NEXT LITTLE WIN · SESSION {(state.queue.nextIndex % 3) + 1} OF 3
              </p>
              <h2>
                {session.name}
                <span className="handwritten">you’ve got this ↗</span>
              </h2>
              <p>
                {total} exercises <span>·</span> {programNames[state.profile.program]}{' '}
                <span>·</span> 8–12 reps per set
              </p>
            </div>
            <div className="session-meter">
              <strong>
                {completed}
                <span>/{total}</span>
              </strong>
              <small>exercises wrapped</small>
              <progress value={completed} max={total} aria-label="Workout progress" />
            </div>
          </section>
          <div className="workout-layout">
            <div className="workout-main">
              <div className="exercise-tabs" role="tablist" aria-label="Workout exercises">
                {session.exerciseIds.map((id, index) => (
                  <button
                    role="tab"
                    tabIndex={active === index ? 0 : -1}
                    onKeyDown={(event) => onTabKey(event, index)}
                    aria-selected={active === index}
                    aria-controls={`exercise-${id}`}
                    key={id}
                    className={active === index ? 'active' : ''}
                    onClick={() => setActive(index)}
                  >
                    <span className={wrapped(draft[id]) ? 'tab-complete' : ''}>
                      {wrapped(draft[id]) ? (
                        <Icon name="check" size={14} />
                      ) : (
                        String(index + 1).padStart(2, '0')
                      )}
                    </span>
                    {exercises.find((ex) => ex.id === id).name}
                  </button>
                ))}
              </div>
              <Exercise
                key={exercise.id}
                exercise={exercise}
                log={draft[exercise.id]}
                estimated={state.lifts[exercise.id].estimated}
                replay={state.queue.pendingMakeups.some(
                  (item) => item.exerciseId === exercise.id && item.sessionId === session.id,
                )}
                onChange={(log) => change(exercise.id, log)}
                previous={state.lifts[exercise.id]}
                index={active}
                total={total}
              />
              <div className="exercise-navigation">
                <Button
                  variant="ghost"
                  disabled={active === 0}
                  onClick={() => setActive(active - 1)}
                >
                  ← Previous exercise
                </Button>
                <Button
                  variant="secondary"
                  disabled={active === total - 1}
                  onClick={() => setActive(active + 1)}
                >
                  Next exercise <Icon name="arrow" />
                </Button>
              </div>
              <div className="workout-footer">
                <div>
                  <strong>
                    {allWrapped
                      ? anyCompleted
                        ? 'Ready to call it a win?'
                        : 'All exercises skipped.'
                      : `${total - completed} exercise${total - completed === 1 ? '' : 's'} to go.`}
                  </strong>
                  <small>
                    {allWrapped
                      ? anyCompleted
                        ? 'Review and save your session when you’re ready.'
                        : 'Skip this day to keep this workout in the queue.'
                      : 'Finish each exercise or mark it skipped.'}
                  </small>
                </div>
                <Button
                  disabled={!allWrapped || !anyCompleted || busy}
                  onClick={() => setConfirm('finish')}
                >
                  Finish workout <Icon name="check" />
                </Button>
              </div>
            </div>
            <aside className="workout-aside">
              <EasterEgg kind="frog" />
              <div className="spotter-note">
                <Spotter happy={allWrapped} />
                <div>
                  <span className="eyebrow">YOUR UNPAID SPOTTER</span>
                  <p>
                    {allWrapped
                      ? 'Exceptional lifting. Very convincing counting.'
                      : 'One set at a time. I’ll handle the moral support.'}
                  </p>
                </div>
              </div>
              <div className="panel next-note">
                <p className="eyebrow">THE SIMPLE RULE</p>
                <strong>
                  Top of the range?
                  <br />A little more next time.
                </strong>
                <p className="muted">
                  Hit 12 on every set and we add 2.5 kg. Otherwise, keep the weight and build your
                  reps.
                </p>
                <div className="mini-equation">
                  <span>12 / 12 / 12</span>
                  <Icon name="arrow" size={15} />
                  <strong>+2.5 kg</strong>
                </div>
              </div>
              <div className="aside-actions">
                <Button variant="ghost" disabled={busy} onClick={email}>
                  Email this workout
                </Button>
                <Button variant="ghost" disabled={busy} onClick={() => setConfirm('skip')}>
                  Skip this day
                </Button>
              </div>
            </aside>
          </div>
        </>
      )}
      {confirm && (
        <Modal
          title={
            confirm === 'finish'
              ? 'Put this one in the books?'
              : confirm === 'skip'
                ? 'Take today off?'
                : confirm === 'undo'
                  ? 'Reopen today’s workout?'
                  : 'Workout sent.'
          }
          onClose={() => !busy && setConfirm(null)}
        >
          {confirm === 'finish' ? (
            <>
              <p className="muted">
                Check the weights and reps below. Saving advances your workout queue.
              </p>
              <ul className="review-list">
                {session.exerciseIds.map((id) => (
                  <li key={id}>
                    <strong>{exercises.find((ex) => ex.id === id).name}</strong>
                    <span>
                      {draft[id].skipped
                        ? 'Skipped · replay next cycle'
                        : `${draft[id].kg} kg · ${draft[id].sets.map((set) => set.reps).join(' / ')}`}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="muted">
              {confirm === 'skip'
                ? 'This workout stays first in your queue. Today will be recorded as skipped.'
                : confirm === 'undo'
                  ? 'Today’s log and its weight increases will be rolled back. Your previous history stays intact.'
                  : 'A copy is on its way to your inbox.'}
            </p>
          )}
          <Message error>{error}</Message>
          <div className="actions">
            <Button variant="secondary" disabled={busy} onClick={() => setConfirm(null)}>
              {confirm === 'sent' ? 'Close' : 'Keep as is'}
            </Button>
            {confirm !== 'sent' && (
              <Button
                disabled={busy}
                onClick={() => submit(confirm === 'finish' ? 'complete' : confirm)}
              >
                {busy
                  ? 'Saving…'
                  : confirm === 'finish'
                    ? 'Save workout'
                    : confirm === 'undo'
                      ? 'Undo log'
                      : 'Skip day'}
              </Button>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

function Exercise({ exercise, log, onChange, estimated, replay, previous, index, total }) {
  const [weight, setWeight] = useState(String(log.kg)),
    [error, setError] = useState('');
  useEffect(() => setWeight(String(log.kg)), [log.kg]);
  const done = log.sets.filter((set) => set.done).length;
  function saveWeight() {
    const value = Number(weight);
    if (weight.trim() === '' || !Number.isFinite(value) || value < 0 || value > 2000) {
      setError('Use a weight between 0 and 2000 kg.');
      setWeight(String(log.kg));
      return;
    }
    setError('');
    onChange({ ...log, kg: value });
  }
  function set(index, patch) {
    onChange({
      ...log,
      skipped: false,
      sets: log.sets.map((set, i) => (i === index ? { ...set, ...patch } : set)),
    });
  }
  return (
    <section
      className={`panel exercise-card ${log.skipped ? 'is-skipped' : ''}`}
      role="tabpanel"
      id={`exercise-${exercise.id}`}
      aria-label={exercise.name}
    >
      <div className="exercise-header">
        <div>
          <p className="eyebrow">
            EXERCISE {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <h2>{exercise.name}</h2>
          <p className="muted">
            {exercise.machine} <span>·</span> {exercise.muscles.join(' + ')}
          </p>
        </div>
        <div className="machine-image">
          <MachineIllustration id={exercise.id} />
        </div>
      </div>
      <div className="exercise-meta">
        <span className="pill">
          {exercise.minReps}–{exercise.maxReps} reps
        </span>
        {replay ? (
          <span className="pill amber">Back for an encore · same weight</span>
        ) : estimated ? (
          <span className="pill amber">Starting estimate · adjust freely</span>
        ) : (
          <span className="pill green">Your working weight</span>
        )}
      </div>
      <div className="weight-strip">
        <div>
          <label htmlFor={`weight-${exercise.id}`}>Working weight</label>
          <small>
            {previous.lastDate
              ? `Last logged ${formatDay(previous.lastDate)} · ${previous.lastSets.join(' / ')} reps`
              : 'First session? Find a comfortable starting weight.'}
          </small>
        </div>
        <div className="weight-control">
          <button
            disabled={log.skipped}
            aria-label="Decrease weight"
            onClick={() => onChange({ ...log, kg: Math.max(0, log.kg - 2.5) })}
          >
            −
          </button>
          <input
            id={`weight-${exercise.id}`}
            type="number"
            min="0"
            max="2000"
            step="0.5"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            onBlur={saveWeight}
            onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
            disabled={log.skipped}
          />
          <span>kg</span>
          <button
            disabled={log.skipped}
            aria-label="Increase weight"
            onClick={() => onChange({ ...log, kg: Math.min(2000, log.kg + 2.5) })}
          >
            +
          </button>
        </div>
      </div>
      <Message error>{error}</Message>
      <div className="set-table">
        <div className="set-table-head">
          <span>SET</span>
          <span>REPS</span>
          <span>STATUS</span>
        </div>
        {log.sets.map((row, i) => (
          <div className={`set-row ${row.done ? 'done' : ''}`} key={i}>
            <span className="set-number">{String(i + 1).padStart(2, '0')}</span>
            <div className="rep-control">
              <button
                aria-label={`Decrease reps for set ${i + 1}`}
                disabled={log.skipped || row.reps === 0}
                onClick={() => set(i, { reps: Math.max(0, row.reps - 1) })}
              >
                −
              </button>
              <output aria-label={`Reps for set ${i + 1}`}>{row.reps}</output>
              <button
                aria-label={`Increase reps for set ${i + 1}`}
                disabled={log.skipped || row.reps === 200}
                onClick={() => set(i, { reps: Math.min(200, row.reps + 1) })}
              >
                +
              </button>
            </div>
            <button
              className="set-done"
              aria-label={`${row.done ? 'Undo' : 'Complete'} set ${i + 1}`}
              aria-pressed={row.done}
              disabled={log.skipped}
              onClick={() => set(i, { done: !row.done })}
            >
              <Icon name="check" size={17} />
              {row.done ? 'Done' : 'Mark done'}
            </button>
          </div>
        ))}
      </div>
      <div className="set-actions">
        <Button
          variant="ghost"
          disabled={log.skipped || log.sets.length >= 30}
          onClick={() =>
            onChange({ ...log, sets: [...log.sets, { reps: exercise.maxReps, done: false }] })
          }
        >
          + Add set
        </Button>
        {log.sets.length > exercise.defaultSets && (
          <Button variant="ghost" onClick={() => onChange({ ...log, sets: log.sets.slice(0, -1) })}>
            Remove last set
          </Button>
        )}
        <span>
          {done} of {log.sets.length} sets done
        </span>
      </div>
      <div className="exercise-actions">
        <Button variant="secondary" onClick={() => onChange({ ...log, skipped: !log.skipped })}>
          {log.skipped ? 'Undo skip' : 'Skip exercise'}
        </Button>
        <Button
          disabled={log.skipped}
          onClick={() =>
            onChange({
              ...log,
              sets: log.sets.map((set) => ({ ...set, done: done !== log.sets.length })),
            })
          }
        >
          {done === log.sets.length ? 'Undo finish' : 'Finish exercise'} <Icon name="check" />
        </Button>
      </div>
    </section>
  );
}

function Schedule({ schedule }) {
  return (
    <aside className="panel schedule">
      <p className="eyebrow">COMING UP</p>
      <h2>A plan that waits for you.</h2>
      <ul>
        {schedule.map((item, index) => (
          <li key={item.date}>
            <span className="schedule-number">{index + 1}</span>
            <div>
              <strong>{item.session.name}</strong>
              <small>{formatDay(item.date)}</small>
            </div>
            {(item.optional || index === 0) && (
              <span className="pill">{item.optional ? 'Extra' : 'Next'}</span>
            )}
          </li>
        ))}
      </ul>
      <p className="help">Miss a day? The next unfinished session stays first.</p>
    </aside>
  );
}

function Progress({ state }) {
  const [selected, setSelected] = useState(exercises[0].id);
  const stats = workoutStats(state.history),
    points = liftHistory(state.history, selected),
    latest = points.at(-1),
    first = points[0];
  const max = Math.max(1, ...points.map((point) => point.kg)),
    shown = points.slice(-12);
  return (
    <>
      <ScreenHeading
        eyebrow="THE RECEIPTS"
        title="Look what you’ve been doing."
        description="No imaginary scores. Just the work you actually logged."
      />
      <div className="stat-grid">
        <div className="panel stat">
          <span>Workouts completed</span>
          <strong>
            {stats.sessions}
            <Icon name="check" />
          </strong>
          <small>Every one counts.</small>
        </div>
        <div className="panel stat">
          <span>Sets logged</span>
          <strong>
            {stats.sets}
            <Icon name="weight" />
          </strong>
          <small>One rep after another.</small>
        </div>
        <div className="panel stat">
          <span>Recorded volume</span>
          <strong>
            {Math.round(stats.volume).toLocaleString()}
            <small>kg</small>
          </strong>
          <small>Weight × reps, across recorded sets.</small>
        </div>
      </div>
      <section className="panel trend-panel">
        <EasterEgg kind="penguin" />
        <div className="section-row">
          <div>
            <p className="eyebrow">A LITTLE STRONGER</p>
            <h2>Your working story.</h2>
          </div>
          <label className="field">
            <span>Exercise</span>
            <select value={selected} onChange={(event) => setSelected(event.target.value)}>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {shown.length ? (
          <>
            <div className="trend-summary">
              <strong>
                {latest.kg} <small>kg last logged</small>
              </strong>
              <span>
                {points.length > 1
                  ? `${latest.kg - first.kg >= 0 ? '+' : ''}${Number((latest.kg - first.kg).toFixed(2))} kg since your first recorded session`
                  : 'Your first data point. A very good place to start.'}
              </span>
            </div>
            <div className="bar-chart" aria-label="Logged weight by session">
              {shown.map((point, index) => (
                <div className="bar-column" key={`${point.date}-${index}`}>
                  <span>{point.kg} kg</span>
                  <div style={{ height: `${Math.max(3, (point.kg / max) * 130)}px` }} />
                  <small>{formatDay(point.date, { month: 'short', day: 'numeric' })}</small>
                </div>
              ))}
            </div>
            <p className="help">
              Last {shown.length} recorded session{shown.length === 1 ? '' : 's'}. Machine weights
              are shown as logged.
            </p>
          </>
        ) : (
          <div className="empty-inline">
            <Icon name="progress" size={38} />
            <h3>Your first dot is waiting.</h3>
            <p>Log this exercise and its working weight will show up here.</p>
          </div>
        )}
      </section>
      <section className="panel history-panel">
        <div className="section-row">
          <div>
            <p className="eyebrow">THE LOGBOOK</p>
            <h2>Proof you showed up.</h2>
          </div>
          <span className="pill">{state.history.length} entries</span>
        </div>
        {!state.history.length ? (
          <div className="empty-inline">
            <Spotter />
            <p>No workouts yet. The bear has sharpened its pencil.</p>
          </div>
        ) : (
          state.history.map((entry, index) => (
            <details className="history-entry" key={`${entry.date}-${index}`}>
              <summary>
                <span className={`entry-icon ${entry.done ? '' : 'skipped'}`}>
                  <Icon name={entry.done ? 'check' : 'clock'} />
                </span>
                <span>
                  <strong>{entry.sessionName}</strong>
                  <small>{formatDay(entry.date)}</small>
                </span>
                <span className="pill">
                  {entry.done ? `${workoutStats([entry]).sets} sets` : 'Skipped'}
                </span>
                <span className="expand-sign">+</span>
              </summary>
              <div className="history-detail">
                {entry.results?.length ? (
                  entry.results.map((result) => (
                    <div key={result.exerciseId}>
                      <strong>
                        {exercises.find((ex) => ex.id === result.exerciseId)?.name ||
                          result.exerciseId}
                      </strong>
                      <span>
                        {result.skipped
                          ? 'Skipped'
                          : `${result.workingKg} kg · ${result.reps.join(' / ')} reps`}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="muted">
                    {entry.done
                      ? 'This older entry has no per-set details.'
                      : 'The unfinished workout stayed in the queue.'}
                  </p>
                )}
              </div>
            </details>
          ))
        )}
      </section>
    </>
  );
}

function Program({ state, onState }) {
  const [choice, setChoice] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  async function save() {
    setBusy(true);
    try {
      onState(await api.setProgram(choice));
      setChoice(null);
    } catch (error) {
      setError(cleanError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <ScreenHeading
        eyebrow="SIMPLE BY DESIGN"
        title="A plan you can keep in your head."
        description="Three sessions in a repeating cycle. Pick the one that fits your week."
      />
      <div className="program-grid">
        {Object.keys(programNames).map((id) => (
          <section
            key={id}
            className={`panel program-card ${state.profile.program === id ? 'chosen' : ''}`}
          >
            <div className="section-row">
              <span className="choice-letter">{id === 'couple' ? 'A' : 'B'}</span>
              {state.profile.program === id && (
                <span className="pill green">Your current plan</span>
              )}
            </div>
            <h2>{programNames[id]}</h2>
            <p className="muted">
              {id === 'couple'
                ? 'A push day, a leg day, and a pull day. Familiar faces on a simple rotation.'
                : 'One upper-body day and two lower-body days, with a different exercise mix.'}
            </p>
            <ol>
              {sessionsFor(id).map((session) => (
                <li key={session.id}>
                  <strong>{session.name}</strong>
                  <small>{session.exerciseIds.length} exercises</small>
                </li>
              ))}
            </ol>
            <Button
              variant={state.profile.program === id ? 'secondary' : 'primary'}
              disabled={state.profile.program === id}
              onClick={() => {
                setChoice(id);
                setError('');
              }}
            >
              {state.profile.program === id ? 'You’re on this plan' : `Choose ${programNames[id]}`}
            </Button>
          </section>
        ))}
      </div>
      <WeekPlanner state={state} onState={onState} expanded />
      <Schedule schedule={upcoming(state)} />
      <EasterEgg kind="raccoon" />
      {choice && (
        <Modal title="Switch your workout cycle?" onClose={() => !busy && setChoice(null)}>
          <p>
            Your next session will be {sessionsFor(choice)[0].name}. The upcoming queue and
            skipped-exercise replays reset. Your weights and completed history stay.
          </p>
          <p className="muted">An unfinished workout draft from this cycle will not carry over.</p>
          <Message error>{error}</Message>
          <div className="actions">
            <Button variant="secondary" disabled={busy} onClick={() => setChoice(null)}>
              Keep current plan
            </Button>
            <Button disabled={busy} onClick={save}>
              {busy ? 'Switching…' : 'Switch program'}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
function Learn() {
  const [muscle, setMuscle] = useState('chest'),
    [view, setView] = useState('front');
  function selectMuscle(id) {
    setMuscle(id);
    if (['back', 'glutes', 'hamstrings', 'triceps'].includes(id)) setView('back');
    else if (['chest', 'biceps', 'core', 'quads'].includes(id)) setView('front');
  }
  const muscles = [
    'chest',
    'back',
    'shoulders',
    'quads',
    'hamstrings',
    'glutes',
    'triceps',
    'biceps',
    'core',
  ];
  const matching = exercises.filter((ex) => ex.muscles.includes(muscle));
  return (
    <>
      <ScreenHeading
        eyebrow="LESS GUESSING"
        title="Meet the muscles. Meet the machines."
        description="Select a muscle to find matching exercises in your library."
      />
      <div className="learn-layout">
        <section className="panel anatomy-panel">
          <div className="section-row">
            <h2>The muscle map</h2>
            <div className="segmented">
              {['front', 'back'].map((side) => (
                <button
                  key={side}
                  aria-pressed={side === view}
                  onClick={() => {
                    setView(side);
                    setMuscle(side === 'front' ? 'chest' : 'back');
                  }}
                >
                  {side}
                </button>
              ))}
            </div>
          </div>
          <div className="anatomy-image">
            <AnatomyDiagram view={view} selected={muscle} onSelect={selectMuscle} />
          </div>
          <p className="help">
            A simplified muscle guide. Select a region to explore its exercises.
          </p>
        </section>
        <section>
          <div className="muscle-picker">
            {muscles.map((id) => (
              <button
                className={id === muscle ? 'selected' : ''}
                key={id}
                aria-pressed={id === muscle}
                onClick={() => selectMuscle(id)}
              >
                {id}
              </button>
            ))}
          </div>
          <h2 className="muscle-title">
            {muscle} <span className="muted">/ your library</span>
          </h2>
          {matching.length ? (
            matching.map((ex) => (
              <article className="panel library-card" key={ex.id}>
                <div className="machine-image">
                  <MachineIllustration id={ex.id} />
                </div>
                <div>
                  <h3>{ex.name}</h3>
                  <p className="muted">{ex.machine}</p>
                  <small>{ex.muscles.join(' · ')}</small>
                </div>
              </article>
            ))
          ) : (
            <p className="panel">No dedicated exercise for this muscle in the current library.</p>
          )}
          <div className="spotter-caption">
            <EasterEgg kind="fox" />
            <Icon name="learn" />
            <p>
              New machine? Its setup instructions are a good first stop. A gym instructor can help
              you find the right position.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

function Settings({ state, onState }) {
  const [profile, setProfile] = useState({ ...state.profile }),
    [smtp, setSmtp] = useState({
      user: state.smtp?.user ?? '',
      appPassword: state.smtp?.appPassword ?? '',
    }),
    [weights, setWeights] = useState(
      Object.fromEntries(exercises.map((ex) => [ex.id, String(state.lifts[ex.id].workingKg)])),
    ),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [backup, setBackup] = useState(null);
  const file = useRef(null);
  async function run(work, success) {
    if (busy) return;
    setBusy(true);
    setMessage('');
    setError('');
    try {
      await work();
      if (success) setMessage(success);
    } catch (error) {
      setError(cleanError(error));
    } finally {
      setBusy(false);
    }
  }
  function updateProfile(key, value) {
    setProfile((previous) => ({ ...previous, [key]: value }));
  }
  async function saveProfile() {
    const { program, ...patch } = validateProfile(profile);
    onState(await api.updateProfile(patch));
  }
  async function saveEmail() {
    const user = smtp.user.trim(),
      password = smtp.appPassword.trim();
    if (!!user !== !!password)
      throw new Error('Enter both Gmail and the app password, or clear both to disable email.');
    onState(await api.setSmtp(user ? { user, appPassword: password } : null));
  }
  async function exportData() {
    const blob = new Blob([JSON.stringify(createBackup(await api.getState()), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob),
      anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `gym-backup-${isoDate()}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  async function importFile(event) {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected) return;
    setError('');
    try {
      if (selected.size > 5_000_000) throw new Error('Choose a backup smaller than 5 MB.');
      const value = JSON.parse(await selected.text());
      parseBackup(value);
      setBackup(value);
    } catch (error) {
      setError(cleanError(error));
    }
  }
  return (
    <>
      <ScreenHeading
        eyebrow="YOUR ROOM, YOUR RULES"
        title="Make yourself at home."
        description="Your data lives on this device. You’re in charge of the details."
      />
      <div className="settings-feedback">
        <Message error>{error}</Message>
        <Message>{message}</Message>
      </div>
      <AnimalSettings />
      <div className="settings-grid">
        <section className="panel settings-card">
          <div className="section-row">
            <h2>The basics</h2>
            <span className="pill">Profile</span>
          </div>
          <Field
            label="Name"
            value={profile.name}
            maxLength={100}
            onChange={(event) => updateProfile('name', event.target.value)}
          />
          <div className="form-grid">
            <Field
              label="Height cm"
              type="number"
              value={profile.heightCm}
              onChange={(event) => updateProfile('heightCm', Number(event.target.value))}
            />
            <Field
              label="Weight kg"
              type="number"
              value={profile.weightKg}
              onChange={(event) => updateProfile('weightKg', Number(event.target.value))}
            />
          </div>
          <Field
            label="Workout email recipient (optional)"
            type="email"
            value={profile.email}
            onChange={(event) => updateProfile('email', event.target.value)}
          />
          <label className="field">
            <span>Your usual gym days</span>
          </label>
          <DayPicker
            value={profile.gymDays}
            onChange={(value) => updateProfile('gymDays', value)}
          />
          <Button
            disabled={busy}
            onClick={() => run(saveProfile, 'Profile saved. A very you-shaped setup.')}
          >
            Save profile
          </Button>
        </section>
        <section className="panel settings-card">
          <p className="eyebrow">YOURS TO KEEP</p>
          <h2>A spare copy. A little peace of mind.</h2>
          <p className="muted">
            Export your profile, workout history, and working weights. Email passwords are never
            included.
          </p>
          <div className="backup-illustration">
            <EasterEgg kind="bunny" />
            <Icon name="save" size={50} />
            <span>
              YOUR WORK
              <br />
              <strong>travels with you.</strong>
            </span>
          </div>
          <Button
            icon="download"
            disabled={busy}
            onClick={() =>
              run(exportData, 'Backup download requested. Keep the file somewhere safe.')
            }
          >
            Export backup
          </Button>
          <Button variant="secondary" disabled={busy} onClick={() => file.current.click()}>
            Restore from backup
          </Button>
          <input
            ref={file}
            type="file"
            accept=".json,application/json"
            hidden
            aria-label="Backup file"
            onChange={importFile}
          />
          <p className="help">
            Restoring replaces workout data after you review the backup. Your current email settings
            stay on this device.
          </p>
        </section>
      </div>
      <details className="panel settings-card weight-settings">
        <summary>
          <strong>Working weights</strong>
          <span>
            Fine-tune the numbers <span className="expand-sign">+</span>
          </span>
        </summary>
        <p className="muted">
          Saved per exercise. A change here updates the next workout; an existing draft keeps its
          entered weight.
        </p>
        <div className="weight-list">
          {exercises.map((ex) => (
            <div className="weight-setting" key={ex.id}>
              <div>
                <strong>{ex.name}</strong>
                <small>{state.lifts[ex.id].estimated ? 'Starting estimate' : 'Your weight'}</small>
              </div>
              <Field
                label={`${ex.name} kg`}
                type="number"
                min="0"
                max="2000"
                step="0.5"
                value={weights[ex.id]}
                onChange={(event) =>
                  setWeights((previous) => ({ ...previous, [ex.id]: event.target.value }))
                }
              />
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    if (!weights[ex.id].trim()) throw new Error('Enter a working weight.');
                    onState(await api.updateLift(ex.id, Number(weights[ex.id])));
                  }, `${ex.name} weight saved.`)
                }
              >
                Save
              </Button>
            </div>
          ))}
        </div>
      </details>
      <details className="panel settings-card email-settings">
        <summary>
          <strong>Optional email</strong>
          <span>
            A workout in your inbox <span className="expand-sign">+</span>
          </span>
        </summary>
        <p className="muted">
          Use a Gmail account and a 16-character app password. Saved credentials are encrypted on
          this device.
        </p>
        <div className="form-grid">
          <Field
            label="Gmail"
            type="email"
            autoComplete="off"
            value={smtp.user}
            onChange={(event) => setSmtp((previous) => ({ ...previous, user: event.target.value }))}
          />
          <Field
            label="App password"
            type="password"
            autoComplete="off"
            value={smtp.appPassword}
            onChange={(event) =>
              setSmtp((previous) => ({ ...previous, appPassword: event.target.value }))
            }
          />
        </div>
        <div className="actions">
          <Button disabled={busy} onClick={() => run(saveEmail, 'Email settings saved.')}>
            Save email settings
          </Button>
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() =>
              run(async () => {
                await saveEmail();
                const result = await api.sendTestEmail();
                if (!result.ok) throw new Error(result.error);
              }, 'Test email sent.')
            }
          >
            Send test
          </Button>
        </div>
      </details>
      {backup && (
        <Modal title="Restore this backup?" onClose={() => !busy && setBackup(null)}>
          <p>
            This replaces your current profile, weights, and {state.history.length} history entries
            with:
          </p>
          <div className="backup-preview">
            <strong>{backup.state.profile.name}</strong>
            <span>{backup.state.history.length} history entries</span>
            <span>Exported {formatDay(backup.exportedAt?.slice(0, 10) || isoDate())}</span>
          </div>
          <Message error>{error}</Message>
          <div className="actions">
            <Button variant="secondary" disabled={busy} onClick={() => setBackup(null)}>
              Cancel
            </Button>
            <Button
              disabled={busy}
              onClick={() =>
                run(async () => {
                  const next = await api.restoreBackup(backup);
                  for (const key of Object.keys(localStorage))
                    if (key.startsWith('gym-draft')) localStorage.removeItem(key);
                  localStorage.removeItem('gym-rest-v1');
                  onState(next);
                  setProfile({ ...next.profile });
                  setWeights(
                    Object.fromEntries(
                      exercises.map((ex) => [ex.id, String(next.lifts[ex.id].workingKg)]),
                    ),
                  );
                  setBackup(null);
                }, 'Backup restored.')
              }
            >
              Replace with backup
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

class RenderBoundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="gym-app">
        <TitleBar />
        <main className="opening">
          <Spotter />
          <h1>That wasn’t part of the workout.</h1>
          <p>Your saved workouts are still on this device.</p>
          <Button onClick={() => location.reload()}>Reopen the app</Button>
        </main>
      </div>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById('root')).render(
  <RenderBoundary>
    <App />
  </RenderBoundary>,
);
