# Worlds Simplest Gym

A local Windows workout planner with two training cycles, an exercise guide, focused set logging, rest timers, progress history, portable backups, and optional Gmail workout emails. Version 1.1 adds the playful Little Wins Club interface; see [the professional pass](docs/PROFESSIONAL-PASS.md).

## Run

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

For the built desktop app, use `npm run build` then `npm start`. Build a Windows installer with `npm run dist`; the output is in `release/`. `npx vite` also provides a browser preview with local storage. Email is desktop-only.

## Workout behavior

- Finish every set (or use Finish exercise), or explicitly skip an exercise before finishing the day.
- Completing a workout advances the cycle. Skipping a whole day keeps the unfinished workout at the front for the next scheduled day.
- Each date can contain one logged workout. Logged dates are excluded from future planning.
- All completed sets reaching 12 reps adds 2.5 kg to the actual weight used. Otherwise the weight stays the same.
- Skipped exercises return at their saved weight when their session returns. Program changes reset the queue while keeping lift weights and history.
- Unfinished workout drafts and rest timers survive navigation and restart. Workout weights save when you leave the field or press Enter. Settings have explicit Save buttons.
- Review each workout before saving, and undo today's latest log from Today when you need to correct it.
- Export and restore portable backups in Settings. Backups contain workout data, never email passwords; restoring requires a review.

## Data and email

Desktop data lives in the Electron user-data folder, normally `%APPDATA%/Worlds Simplest Gym/gym-state.json`. Each change keeps a previous-state `gym-state.json.backup`. The existing save format is retained. Invalid data is reported rather than silently reset. Close the app before restoring a backup.

Optional email is under **Settings → Optional email**. Enter a Gmail account and a 16-character app password, then Save email settings. Send test saves the current email settings before sending. Credentials are encrypted using Windows credential storage; browser preview never saves email credentials. Connection and send attempts have timeouts. Delivery requires valid account credentials and connectivity.

## Validation

```sh
npm run check
npm run test:ui
npm run test:a11y
npm audit
```

The unit tests cover validation, progression, queue behavior, duplicates, skipped-exercise replay, program switching, and mocked email success/failure. The desktop tests use an isolated temporary data directory and cover onboarding, logging, draft recovery, restart persistence, settings validation, credential encryption, anatomy assets, and program switching. They never send a real email or use personal workout data.

## Source

This checkout originally contained compiled application files without source or a build manifest. Version 1.1 replaces the recovered renderer with `src/App.jsx`. Shared controls and artwork are in `src/ui.jsx` and `src/illustrations.js`, exercise/program data in `src/catalog.js`, tested state transitions in `src/core.js`, planning and backup helpers in `src/planner.js`, and desktop storage and email in `electron/`. Anatomy attribution is in `public/anatomy/CREDITS.md`.
