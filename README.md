# Worlds Simplest Gym

A local Windows workout planner with two training cycles, an exercise guide, set logging, skipped-exercise replay, double progression, and optional Gmail workout emails.

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
- Unfinished workout drafts survive navigation and restart. Profile and working-weight fields save when you leave the field or press Enter.

## Data and email

Desktop data lives in the Electron user-data folder, normally `%APPDATA%/Worlds Simplest Gym/gym-state.json`. Each change keeps a previous-state `gym-state.json.backup`. The existing save format is retained. Invalid data is reported rather than silently reset. Close the app before restoring a backup.

Optional email is under **Log → Optional email**. Enter a Gmail account and a 16-character app password, then Save. Send test saves the current email settings before sending. Credentials are encrypted using Windows credential storage; browser preview never saves email credentials. Connection and send attempts have timeouts. Delivery requires valid account credentials and connectivity.

## Validation

```sh
npm run check
npm run test:ui
npm audit
```

The unit tests cover validation, progression, queue behavior, duplicates, skipped-exercise replay, program switching, and mocked email success/failure. The desktop tests use an isolated temporary data directory and cover onboarding, logging, draft recovery, restart persistence, settings validation, credential encryption, anatomy assets, and program switching. They never send a real email or use personal workout data.

## Source

This checkout originally contained compiled application files without source or a build manifest. The interface and styles were recovered from the supplied build. `src/App.js` contains the recovered React interface, `src/catalog.js` the shared exercise/program definitions, `src/core.js` the tested state transitions, and `electron/` the desktop storage, bridge, and email implementation. Anatomy attribution is in `public/anatomy/CREDITS.md`.
