# Worlds Simplest Gym

A local Windows workout planner with two training cycles, an exercise guide, focused set logging, rest timers, progress history, portable backups, and optional Gmail workout emails. Version 1.1 adds the playful Little Wins Club interface; see [the professional pass](docs/PROFESSIONAL-PASS.md).

## Run

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

For the built desktop app, use `npm run build` then `npm start`. Build a Windows installer with `npm run dist`; the output is in `release/`. `npx vite` also provides a browser preview with local storage. Email is desktop-only.

Packaging reuses the installed Electron runtime from `node_modules/electron/dist`, avoiding a second archive extraction. To keep a release separate from a running older build, use `npm run dist -- --config.directories.output=release/1.2.0`.

## Workout behavior

- Finish every set (or use Finish exercise), or explicitly skip an exercise before finishing the day.
- Completing a workout advances the cycle. Skipping a whole day keeps the unfinished workout at the front for the next scheduled day.
- Each date can contain one logged workout. Logged dates are excluded from future planning.
- All completed sets reaching 12 reps adds 2.5 kg to the actual weight used. Otherwise the weight stays the same.
- Skipped exercises return at their saved weight when their session returns. Program changes reset the queue while keeping lift weights and history.
- Unfinished workout drafts and rest timers survive navigation and restart. Workout weights save when you leave the field or press Enter. Settings have explicit Save buttons.
- Review each workout before saving, and undo today's latest log from Today when you need to correct it.
- Export and restore portable backups in Settings. Backups contain workout data, never email passwords; restoring requires a review.

## Flexible weeks

Open **This week** on Today (or Program), then enable **Automatically rebalance my week**. Existing saves keep their usual-day mode until this is switched on. Missed days, including days when the app was closed, move to the next free day within the Monday–Sunday week. For example, missing Monday on a Mon/Wed/Fri plan produces Tue/Wed/Fri. Completing Tue/Wed and choosing **I'm training today** on Thursday replaces Friday. Add Saturday with **Optional extra day** if wanted; it is never added automatically. An uncompleted optional day expires rather than becoming another obligation.

Choosing to train early is saved immediately and survives restart. **Put today's moved workout back** reverses that choice before logging. Calendar changes do not advance the exercise cycle or alter weights; only a completed workout advances it. Undoing a log reopens the workout and recalculates the week. Usual weekdays resume next week, and missed weeks never accumulate extra sessions. Scheduling preferences and extra dates are included in portable backups.

## Local saves

Narmin's edition includes six hidden animal friends: tap the little paw prints to find them. Discoveries and the animal sound setting stay on this device (separate from workout backups). Confirming a skipped day plays two soft, locally synthesized Chihuahua yaps; canceling or revisiting a log stays silent. The skip screen has replay and mute controls, also available in Settings. Finishing a workout brings out the Shiba princess. Animal animations respect reduced-motion preferences.

Desktop data lives in the Electron user-data folder, normally `%APPDATA%/Worlds Simplest Gym/gym-state.json`. This human-readable JSON holds profile, workout history, lift weights, queue, calendar settings, and encrypted email credentials. Each update to an existing file keeps its previous state in `gym-state.json.backup`; the main file is written atomically through electron-store. It loads automatically on launch. Invalid data is reported rather than silently reset. Close the app before manually replacing save files; use Settings to import an exported backup while the app is open.

Draft sets, the rest timer, animal discoveries, and sound preferences use Electron's localStorage in its user-data folder. They are separate from portable workout backups. Browser preview uses localStorage for all data under that browser's exact origin; it does not share desktop data. No remote database or cloud sync is used.

Optional email is under **Settings → Optional email**. Enter a Gmail account and a 16-character app password, then Save email settings. Send test saves the current email settings before sending. Credentials are encrypted using Windows credential storage; browser preview never saves email credentials. Connection and send attempts have timeouts. Delivery requires valid account credentials and connectivity.

## Validation

```sh
npm run check
npm run test:ui
npm run test:a11y
npm run test:animals
npm audit
```

The unit tests cover validation, progression, queue behavior, duplicates, skipped-exercise replay, program switching, and mocked email success/failure. The desktop tests use an isolated temporary data directory and cover onboarding, logging, draft recovery, restart persistence, settings validation, credential encryption, anatomy assets, and program switching. They never send a real email or use personal workout data.

## Source

This checkout originally contained compiled application files without source or a build manifest. Version 1.1 replaces the recovered renderer with `src/App.jsx`. Shared controls and machine artwork are in `src/ui.jsx` and `src/illustrations.js`, exercise/program data in `src/catalog.js`, tested state transitions in `src/core.js`, calendar logic in `src/schedule.js`, planning and backup helpers in `src/planner.js`, and desktop storage and email in `electron/`. Version 1.2's original vector muscle guide is in `src/anatomy.jsx`; visible muscles and hit targets are the same paths. Legacy anatomy assets and their credits remain in `public/anatomy/` but are no longer displayed.
