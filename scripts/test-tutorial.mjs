import { _electron as electron, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const env = {
  ...process.env,
  GYM_TEST_DATA_DIR: fs.mkdtempSync(path.join(os.tmpdir(), 'gym-tutorial-')),
};
delete env.ELECTRON_RUN_AS_NODE;
fs.mkdirSync('recovery', { recursive: true });
const app = await electron.launch({
  executablePath: process.env.GYM_TEST_EXECUTABLE || undefined,
  args: process.env.GYM_TEST_EXECUTABLE ? [] : ['.'],
  env,
});
try {
  const page = await app.firstWindow(),
    errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const button = (name) => page.getByRole('button', { name, exact: true });
  await button('Tutorial').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Narmin');
  await page.evaluate(() =>
    window.gym.completeOnboarding({
      profile: {
        name: 'Narmin',
        heightCm: 165,
        weightKg: 60,
        email: '',
        gymDays: [1, 3, 5],
        program: 'couple',
      },
    }),
  );
  await page.reload();
  const saved = await page.evaluate(() => window.gym.getState());
  const storage = await page.evaluate(() =>
    Object.fromEntries(
      Object.keys(localStorage)
        .filter((key) => key !== 'gym-tutorial-offer-v1')
        .map((key) => [key, localStorage.getItem(key)]),
    ),
  );
  await button('Tutorial').click();
  const dialog = page.getByRole('dialog');
  for (let step = 0; step < 9; step++) {
    await expect(dialog.locator('.tutorial-meta')).toContainText(`${step + 1} / 9`);
    if (step === 1) {
      await button('Increase practice weight').click();
    }
    if (step === 2) {
      await button('Decrease practice reps').click();
      await button('Mark practice set done').click();
    }

    if (step === 3) {
      await button('Save practice workout').click();
      await button('Undo practice log').click();
    }
    if (step === 4) {
      await page.getByLabel('Flexible scheduling', { exact: true }).check();
      await button('Skip practice Monday').click();
      await expect(dialog.locator('.tutorial-week')).toHaveText('Tue · Wed · Fri');
    }
    if (step === 5) {
      await button('Train practice Thursday').click();
      await button('Add optional Saturday').click();
      await expect(dialog.locator('.tutorial-week')).toContainText('Thu · Sat (optional)');
    }
    if (step === 6) {
      await dialog.getByRole('button', { name: 'Back', exact: true }).first().click();
      await dialog.locator('.body-muscle[aria-label="glutes"]').focus();
      await page.keyboard.press('Enter');
    }
    if (step === 7) {
      await dialog.locator('.tutorial-stage summary').click();
    }
    if (step === 8) {
      await button('Pretend to export a backup').click();
    }
    await dialog.locator('.tutorial-reference summary').click();
    await expect(dialog.locator('dl')).toBeVisible();
    const result = await new AxeBuilder({ page })
      .setLegacyMode()
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
    await dialog.locator('.tutorial-reference summary').click();
    if (step === 4 && !process.env.GYM_TEST_EXECUTABLE)
      await page.screenshot({ path: 'recovery/tutorial.png', timeout: 15000 });
    await button(step === 8 ? 'Finish tutorial' : 'Next').click();
  }
  await expect(dialog).toHaveCount(0);
  expect(await page.evaluate(() => window.gym.getState())).toEqual(saved);
  expect(
    await page.evaluate(() =>
      Object.fromEntries(
        Object.keys(localStorage)
          .filter((key) => key !== 'gym-tutorial-offer-v1')
          .map((key) => [key, localStorage.getItem(key)]),
      ),
    ),
  ).toEqual(storage);
  await page.reload();
  await expect(page.locator('.tutorial-invite')).toHaveCount(0);
  await button('Tutorial').click();
  await expect(page.getByRole('dialog').locator('.tutorial-meta')).toContainText('1 / 9');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await button('Skip this step').click();
  await expect(button('Next')).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(errors).toEqual([]);
  console.log(
    'PASS: nine interactive lessons, control references, keyboard, replay, skip, mobile, accessibility, and unchanged workout/storage data.',
  );
} finally {
  await app.close();
}
