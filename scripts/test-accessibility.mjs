import { _electron as electron } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const env = {
  ...process.env,
  GYM_TEST_DATA_DIR: fs.mkdtempSync(path.join(os.tmpdir(), 'gym-accessibility-')),
};
delete env.ELECTRON_RUN_AS_NODE;
const app = await electron.launch({ args: ['.'], env });
try {
  const page = await app.firstWindow();
  await page.waitForFunction(() => !!window.gym);
  await page.evaluate(async () => {
    await window.gym.completeOnboarding({
      profile: {
        name: 'Alex',
        heightCm: 170,
        weightKg: 70,
        email: '',
        gymDays: [0, 1, 2, 3, 4, 5, 6],
        program: 'couple',
      },
    });
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Today', exact: true }).waitFor();
  const failures = [];
  for (const screen of ['Today', 'Progress', 'Learn', 'Program', 'Settings']) {
    await page.getByRole('button', { name: screen, exact: true }).click();
    const results = await new AxeBuilder({ page })
      .setLegacyMode()
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    for (const violation of results.violations)
      failures.push({
        screen,
        id: violation.id,
        description: violation.help,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      });
  }
  fs.writeFileSync('recovery/accessibility.json', JSON.stringify(failures, null, 2));
  console.log(JSON.stringify(failures, null, 2));
  if (failures.length) process.exitCode = 1;
  else console.log('PASS: no automated WCAG A/AA violations on all five screens.');
} finally {
  await app.close();
}
