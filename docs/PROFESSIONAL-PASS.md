# Little Wins Club · 1.1.0

The professional pass is on `idea/professional-and-playful`.

## Product changes

- A consistent visual system: cream surfaces, plum controls, clear hierarchy, a custom app icon, and a supportive bear mascot.
- One exercise at a time, with persistent drafts, editable working weights, set controls, removable extra sets, and a review before saving.
- A rest timer that survives navigation and restart. The timer measures an end time rather than relying on background ticks.
- An undo path for today's latest log, including its weight changes. Changing programs or manually changing a working weight invalidates undo to protect newer changes.
- Progress charts and an expandable logbook based on recorded weights and reps. Older entries without per-set details remain visible.
- Backup export without email credentials, validated import, and a review before replacing data. Restoring retains this device's email settings.
- Responsive layouts, visible keyboard focus, keyboard-operated exercise tabs and anatomy regions, modal focus handling, and reduced-motion support.
- Jokes in encouragement and empty states; explicit labels on actions that change data. No guilt-based streaks or body commentary.

## Engineering changes

The recovered renderer has been replaced with editable React JSX. Exercise data, state transitions, planning, reusable controls, and illustrations have separate modules. The existing Electron save location and history are retained.

Validation covers malformed imported history, invalid dates and reps, skipped-exercise weights, stale drafts after program switches, and duplicate saves. Tests use isolated temporary data directories and never send a real email.

Run `npm run check`, `npm run test:ui`, and `npm run test:a11y`. Build the Windows installer with `npm run dist`. The accessibility suite uses axe's single-page mode because Electron does not support the browser target-creation API used by its default mode.

## Before broad public distribution

- Arrange a signing identity and sign the Windows installer.
- Add and test an update delivery channel, including rollback and interrupted updates.
- Test email delivery with an authorized Gmail account and different receiving clients.
- Run real-user usability sessions and a wider Windows, display-scaling, keyboard, and screen-reader test matrix. Automated accessibility checks do not establish full accessibility conformance.
- Decide whether adjustable progression increments, custom exercises, and multiple workouts per date belong in the product. They are deliberately outside this pass's current workout model.

The app is local-first. Accounts, subscriptions, analytics, and cloud synchronization are not required for its current purpose.
