import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Spotter } from './ui.jsx';
import { AnatomyDiagram } from './anatomy.jsx';
import './tutorial.css';

const lessons = [
  {
    title: 'A tiny rehearsal',
    task: 'Meet your practice workout. Nothing here changes your real workouts, settings, or animal discoveries.',
    guide: [
      [
        'Today / Progress / Learn / Program / Settings',
        'Move between your workout, history, muscle guide, training cycle, and personal settings.',
      ],
      [
        'Tutorial',
        'Replay this practice whenever you like. Back and Next move through lessons; Skip this step moves past an exercise.',
      ],
      [
        'Window controls',
        'In the Windows app, − minimizes, □ maximizes, and × closes. Saved data loads again next time.',
      ],
    ],
  },
  {
    title: 'Choose your working weight',
    task: 'Imagine the chest press feels comfortable at 20 kg. Use + to try 22.5 kg.',
    guide: [
      [
        '− / + beside Working weight',
        'Adjust the weight in 2.5 kg steps. You can also type a weight; leave the field or press Enter to save it.',
      ],
      ['Starting estimate', 'Only a starting suggestion. Adjust it to a weight you can control.'],
    ],
  },
  {
    title: 'Log a set',
    task: 'You managed 11 reps. Tap − once, then mark the set done.',
    guide: [
      ['− / + beside reps', 'Record how many reps you actually completed.'],
      [
        'Set check / Undo set',
        'Mark a set complete or reopen it. Completing a set starts the rest timer.',
      ],
      [
        '+ Add set / Remove last set',
        'Add an extra set or remove an extra set you no longer need.',
      ],
      [
        'Exercise tabs / Previous / Next exercise',
        'Choose an exercise. These navigation buttons do not mark it completed.',
      ],
    ],
  },
  {
    title: 'Take a little breather',
    task: 'Try the 60-second preset, then start and pause this short demonstration.',
    guide: [
      [
        '60s / 90s / 120s',
        'Choose a rest duration. The real countdown continues across navigation and restart.',
      ],
      ['Start / Pause timer', 'Start or pause the countdown.'],
      ['Reset', 'Return to the selected duration.'],
    ],
  },
  {
    title: 'Put a workout in the books',
    task: 'The other practice exercises are finished. Save this workout, then undo it to learn how corrections work.',
    guide: [
      [
        'Finish exercise / Skip exercise',
        'Finish all its sets, or explicitly skip that exercise. Skipped exercises return at their saved weight in the next cycle.',
      ],
      [
        'Finish workout / Save workout',
        'Review your weights and reps, then save. Only saving advances the workout queue.',
      ],
      ['Keep as is / Close dialog', 'Cancel a review without saving.'],
      [
        'Undo today’s log / Undo log',
        'Reopen today’s latest log and roll back its weight increases.',
      ],
      [
        'See your progress',
        'Open workout history after saving. All completed sets reaching 12 reps increases the working weight by 2.5 kg.',
      ],
    ],
  },
  {
    title: 'Monday did not happen',
    task: 'Your usual days are Mon/Wed/Fri. Switch on flexible scheduling, then skip Monday.',
    guide: [
      ['This week', 'Expand the weekly calendar on Today. It is also available in Program.'],
      [
        'Automatically rebalance my week',
        'Missed days move to the next free day in the same week. Usual weekdays return next week.',
      ],
      [
        'Skip this day / Skip day',
        'Confirm a whole-day skip. The unfinished workout stays first in line. The Chihuahua has a small announcement.',
      ],
      ['Keep as is', 'Cancel the skip. Nothing is logged and the Chihuahua stays silent.'],
    ],
  },
  {
    title: 'Feeling good on Thursday?',
    task: 'In this scenario, Tuesday and Wednesday are already done. Train Thursday instead of Friday, then add an optional Saturday.',
    guide: [
      [
        'I’m training today',
        'Start on a rest day. In flexible mode, it replaces the next later slot this week.',
      ],
      ['Put today’s moved workout back', 'Reverse that choice before logging.'],
      [
        'Optional extra day / Add extra day',
        'Choose an additional date. It is your choice, not an automatic obligation.',
      ],
      ['Remove [date]', 'Remove an upcoming extra day. An uncompleted optional day expires.'],
    ],
  },
  {
    title: 'Find the right muscle',
    task: 'Switch to the back view and tap the glutes on the practice body.',
    guide: [
      ['Front / Back', 'Turn the muscle map around.'],
      [
        'Muscle shapes / Muscle names',
        'Select a muscle to see matching exercises and machines. Both select the same thing.',
      ],
      ['Tiny paw prints', 'Investigate them in the real app to discover hidden animal friends.'],
    ],
  },
  {
    title: 'Your history and your plan',
    task: 'Open the practice history entry to inspect its sets.',
    guide: [
      ['Progress exercise selector', 'Choose a lift to see its weight history.'],
      [
        'Workout history rows',
        'Expand a workout to see the actual weights, reps, and skipped exercises.',
      ],
      [
        'Choose a program / Switch program',
        'Review and confirm a new cycle. Lift weights and history remain; the workout queue restarts.',
      ],
      ['Keep current plan', 'Cancel a program switch.'],
    ],
  },
  {
    title: 'Your corner, your settings',
    task: 'Try exporting a pretend backup. This rehearsal creates no file and sends no email.',
    guide: [
      [
        'Save profile / Gym day buttons',
        'Save your name, measurements, recipient address, and usual weekdays.',
      ],
      [
        'Export backup / Restore from backup / Replace with backup',
        'Export workout and calendar data, or review and import a backup. Email passwords and temporary drafts are not exported.',
      ],
      [
        'Save email settings / Send test / Email this workout',
        'Desktop-only email needs your Gmail address and app password. Sending is always an explicit action; this tutorial never sends anything.',
      ],
      [
        'Working weights / Save',
        'Expand Working weights in Settings to edit a lift, then use its Save button. Cancel closes a backup review without replacing your data.',
      ],
      [
        'Animal sounds / Mute / Unmute / Hear the Chihuahua',
        'Control or replay the cartoon bark. Your sound preference stays on this device.',
      ],
    ],
  },
];
export function Tutorial({ onClose }) {
  const [step, setStep] = useState(0),
    [kg, setKg] = useState(20),
    [reps, setReps] = useState(12),
    [setDone, setSetDone] = useState(false);
  const [seconds, setSeconds] = useState(90),
    [running, setRunning] = useState(false),
    [started, setStarted] = useState(false);
  const [saved, setSaved] = useState(false),
    [undone, setUndone] = useState(false),
    [flex, setFlex] = useState(false),
    [skipped, setSkipped] = useState(false);
  const [early, setEarly] = useState(false),
    [extra, setExtra] = useState(false),
    [view, setView] = useState('front'),
    [muscle, setMuscle] = useState('chest');
  const [history, setHistory] = useState(false),
    [backup, setBackup] = useState(false);
  const heading = useRef(null),
    lesson = lessons[step];
  useEffect(() => {
    heading.current?.focus();
    setRunning(false);
  }, [step]);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [running]);
  const ready = [
    true,
    kg === 22.5,
    setDone && reps === 11,
    started && !running,
    undone,
    skipped,
    early && extra,
    view === 'back' && muscle === 'glutes',
    history,
    backup,
  ][step];
  const next = () => (step === lessons.length - 1 ? onClose() : setStep(step + 1));
  return (
    <Modal title="A little practice, a lot less guessing" onClose={onClose}>
      <div className="tutorial">
        <div className="tutorial-meta">
          <span>PRACTICE ONLY · YOUR DATA STAYS UNCHANGED</span>
          <span>
            {step + 1} / {lessons.length}
          </span>
        </div>
        <progress value={step + 1} max={lessons.length} aria-label="Tutorial progress" />
        <h3 ref={heading} tabIndex={-1}>
          {lesson.title}
        </h3>
        <p>{lesson.task}</p>
        <div className="tutorial-stage">
          {step === 0 && (
            <>
              <Spotter />
              <strong>Chest press · 3 sets · 20 kg</strong>
              <p>The bear has volunteered as your imaginary gym buddy.</p>
            </>
          )}
          {step === 1 && (
            <div className="tutorial-actions">
              <Button
                variant="secondary"
                onClick={() => setKg(Math.max(0, kg - 2.5))}
                aria-label="Decrease practice weight"
              >
                −
              </Button>
              <output aria-label="Practice weight">{kg} kg</output>
              <Button
                variant="secondary"
                onClick={() => setKg(Math.min(100, kg + 2.5))}
                aria-label="Increase practice weight"
              >
                +
              </Button>
            </div>
          )}
          {step === 2 && (
            <div className="tutorial-actions">
              <span>Set 1</span>
              <Button
                variant="secondary"
                disabled={setDone}
                onClick={() => setReps(Math.max(0, reps - 1))}
                aria-label="Decrease practice reps"
              >
                −
              </Button>
              <output aria-label="Practice reps">{reps}</output>
              <Button
                variant="secondary"
                disabled={setDone}
                onClick={() => setReps(reps + 1)}
                aria-label="Increase practice reps"
              >
                +
              </Button>
              <Button onClick={() => setSetDone(!setDone)}>
                {setDone ? 'Undo practice set' : 'Mark practice set done'}
              </Button>
            </div>
          )}
          {step === 3 && (
            <>
              <div className="tutorial-actions">
                {[60, 90, 120].map((value) => (
                  <Button
                    key={value}
                    variant="secondary"
                    onClick={() => {
                      setSeconds(value);
                      setRunning(false);
                      setStarted(false);
                    }}
                  >
                    {value}s
                  </Button>
                ))}
              </div>
              <output className="tutorial-clock" aria-label="Practice countdown">
                {String(Math.floor(seconds / 60)).padStart(2, '0')}:
                {String(seconds % 60).padStart(2, '0')}
              </output>
              <div className="tutorial-actions">
                <Button
                  onClick={() => {
                    setRunning(!running);
                    setStarted(true);
                  }}
                >
                  {running ? 'Pause practice timer' : 'Start practice timer'}
                </Button>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <p>
                {saved
                  ? 'Workout saved in this rehearsal. Royal paws of approval!'
                  : undone
                    ? 'Reopened. In the real app your log and weight increases would be rolled back.'
                    : 'Review: Chest press · 20 kg · 11 / 12 / 12 reps'}
              </p>
              <Button
                onClick={() => {
                  if (saved) {
                    setSaved(false);
                    setUndone(true);
                  } else setSaved(true);
                }}
              >
                {saved ? 'Undo practice log' : 'Save practice workout'}
              </Button>
            </>
          )}
          {step === 5 && (
            <>
              <label className="tutorial-toggle">
                <input
                  type="checkbox"
                  checked={flex}
                  onChange={(event) => {
                    setFlex(event.target.checked);
                    setSkipped(false);
                  }}
                />{' '}
                Flexible scheduling
              </label>
              <p className="tutorial-week">{skipped ? 'Tue · Wed · Fri' : 'Mon · Wed · Fri'}</p>
              <Button disabled={!flex || skipped} onClick={() => setSkipped(true)}>
                Skip practice Monday
              </Button>
            </>
          )}
          {step === 6 && (
            <>
              <p className="tutorial-week">
                Tue ✓ · Wed ✓ · {early ? 'Thu' : 'Fri'}
                {extra ? ' · Sat (optional)' : ''}
              </p>
              <div className="tutorial-actions">
                <Button disabled={early} onClick={() => setEarly(true)}>
                  Train practice Thursday
                </Button>
                <Button
                  variant="secondary"
                  disabled={!early || extra}
                  onClick={() => setExtra(true)}
                >
                  Add optional Saturday
                </Button>
              </div>
            </>
          )}
          {step === 7 && (
            <>
              <div className="tutorial-actions">
                {['front', 'back'].map((side) => (
                  <Button
                    variant="secondary"
                    key={side}
                    aria-pressed={view === side}
                    onClick={() => {
                      setView(side);
                      setMuscle(side === 'front' ? 'chest' : 'back');
                    }}
                  >
                    {side === 'front' ? 'Front' : 'Back'}
                  </Button>
                ))}
              </div>
              <AnatomyDiagram view={view} selected={muscle} onSelect={setMuscle} />
            </>
          )}
          {step === 8 && (
            <details
              onToggle={(event) => {
                if (event.currentTarget.open) setHistory(true);
              }}
            >
              <summary>Practice workout · Chest + Triceps</summary>
              <p>Chest press: 20 kg · 11 / 12 / 12 reps. No weight increase this time.</p>
            </details>
          )}
          {step === 9 && (
            <>
              <Button onClick={() => setBackup(true)}>Pretend to export a backup</Button>
              {backup && (
                <p>
                  Your real backup would include workouts, weights, and your calendar. You’re ready
                  for your first real session.
                </p>
              )}
            </>
          )}
        </div>
        <p className="tutorial-result" role="status">
          {step > 0 && ready
            ? 'Got it. Nice work!'
            : step > 0
              ? 'Try the action above, or skip this step.'
              : ''}
        </p>
        <details className="tutorial-reference">
          <summary>What every button here does</summary>
          <dl>
            {lesson.guide.map(([name, description]) => (
              <React.Fragment key={name}>
                <dt>{name}</dt>
                <dd>{description}</dd>
              </React.Fragment>
            ))}
          </dl>
        </details>
        <div className="tutorial-footer">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>
            Back
          </Button>
          <button type="button" className="text-button" onClick={next}>
            {step === lessons.length - 1 ? 'Finish without practice' : 'Skip this step'}
          </button>
          <Button disabled={!ready} onClick={next}>
            {step === lessons.length - 1 ? 'Finish tutorial' : 'Next'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
