import { _electron as electron, expect } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const data = fs.mkdtempSync(path.join(os.tmpdir(), 'gym-professional-qa-'));
fs.mkdirSync('recovery', { recursive: true });
const env = { ...process.env, GYM_TEST_DATA_DIR: data };
delete env.ELECTRON_RUN_AS_NODE;
let app, page;
const errors = [];
async function launch() {
  app = await electron.launch({
    executablePath: process.env.GYM_TEST_EXECUTABLE || undefined,
    args: process.env.GYM_TEST_EXECUTABLE ? [] : ['.'],
    env,
  });
  page = await app.firstWindow();
  page.setDefaultTimeout(15000);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.waitForLoadState('domcontentloaded');
}
const button = (name) => page.getByRole('button', { name, exact: true });
const state = () => page.evaluate(() => window.gym.getState());
async function screenshot(name) {
  if (!process.env.GYM_TEST_EXECUTABLE)
    await page.screenshot({ path: `recovery/pro-${name}.png`, timeout: 15000 });
}
async function saveWorkout() {
  await button('Finish workout').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await button('Save workout').click();
  await expect(page.getByRole('heading', { name: 'That’s a little win.' })).toBeVisible();
}
try {
  await launch();
  await expect(page.getByRole('heading', { name: 'A small app. A stronger you.' })).toBeVisible();
  await page.getByLabel('Name', { exact: true }).fill('Alex');
  for (let i = 0; i < 3; i++) await button('Next').click();
  const today = new Date().getDay();
  if (![1, 3, 5].includes(today))
    await button(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][today]).click();
  await button('Let’s do this').click();
  await expect(button('Finish workout')).toBeDisabled();
  await screenshot('today');
  await button('Increase weight').click();
  await button('Complete set 1').click();
  await expect(page.getByRole('timer')).toHaveCount(0);
  await button('+ Add set').click();
  await expect(button('Complete set 4')).toBeVisible();
  await button('Remove last set').click();
  await expect(button('Complete set 4')).toHaveCount(0);
  await button('Learn').click();
  await expect(
    page.getByRole('heading', { name: 'Meet the muscles. Meet the machines.' }),
  ).toBeVisible();
  await expect(page.locator('.body-map-svg')).toBeVisible();
  await expect(page.locator('.body-muscle')).toHaveCount(6);
  await button('back').first().click();
  await screenshot('learn');
  await button('Program').click();
  await page.getByLabel('Automatically rebalance my week').click();
  await expect(page.getByLabel('Automatically rebalance my week')).toBeChecked();
  await expect.poll(async () => (await state()).schedule.flexible).toBe(true);
  const extraDay = new Date();
  extraDay.setDate(extraDay.getDate() + 8);
  const gymDays = (await state()).profile.gymDays;
  while (gymDays.includes(extraDay.getDay())) extraDay.setDate(extraDay.getDate() + 1);
  const extraStamp = `${extraDay.getFullYear()}-${String(extraDay.getMonth() + 1).padStart(2, '0')}-${String(extraDay.getDate()).padStart(2, '0')}`;
  await page.getByLabel('Optional extra day', { exact: true }).fill(extraStamp);
  await button('Add extra day').click();
  await expect.poll(async () => (await state()).schedule.extraDates).toContain(extraStamp);
  await button('Today').click();
  await expect(button('Undo set 1')).toBeVisible();
  await app.close();
  await launch();
  await expect(button('Undo set 1')).toBeVisible();
  expect((await state()).schedule.flexible).toBe(true);
  expect((await state()).schedule.extraDates).toContain(extraStamp);
  await expect(page.getByRole('timer')).toHaveCount(0);
  const tabs = page.getByRole('tab');
  for (let i = 0; i < (await tabs.count()); i++) {
    await tabs.nth(i).click();
    await button(i === 1 ? 'Skip exercise' : 'Finish exercise').click();
  }
  await saveWorkout();
  let saved = await state();
  expect(saved.history).toHaveLength(1);
  expect(saved.lifts['chest-press'].workingKg).toBe(22.5);
  expect(saved.queue.pendingMakeups).toHaveLength(1);
  await screenshot('celebration');
  await button('See your progress').click();
  await expect(page.getByRole('heading', { name: 'Look what you’ve been doing.' })).toBeVisible();
  await page.locator('.history-entry summary').click();
  await expect(page.locator('.history-detail')).toContainText('20 kg · 12 / 12 / 12 reps');
  await screenshot('progress');
  await button('Today').click();
  await button('Undo today’s log').click();
  await button('Undo log').click();
  await expect(button('Undo set 1')).toBeVisible();
  await button('Decrease reps for set 1').click();
  await saveWorkout();
  saved = await state();
  expect(saved.history).toHaveLength(1);
  expect(saved.lifts['chest-press'].workingKg).toBe(20);
  expect(saved.history[0].results[0].reps).toEqual([11, 12, 12]);
  await button('Settings').click();
  await page.getByLabel('Weight kg', { exact: true }).fill('-1');
  await button('Save profile').click();
  await expect(page.getByRole('alert')).toContainText('Body weight must be between');
  expect((await state()).profile.weightKg).toBe(60);
  await page.getByLabel('Weight kg', { exact: true }).fill('72');
  await button('Save profile').click();
  await expect.poll(async () => (await state()).profile.weightKg).toBe(72);
  await page.locator('.email-settings summary').click();
  await button('Send test').click();
  await expect(page.getByRole('alert')).toContainText('Add a Gmail address and app password');
  await page.getByLabel('Gmail', { exact: true }).fill('qa@example.com');
  await page.getByLabel('App password', { exact: true }).fill('abcdefghijklmnop');
  await button('Save email settings').click();
  await expect(page.getByRole('status')).toContainText('Email settings saved.');
  const disk = JSON.parse(fs.readFileSync(path.join(data, 'gym-state.json'), 'utf8'));
  expect(disk.smtp.encryptedPassword).toBeTruthy();
  expect(disk.smtp.appPassword).toBeUndefined();
  const backupFile = path.join(data, 'export.json');
  await app.evaluate(
    ({ session }, filename) =>
      session.defaultSession.once('will-download', (_event, item) => item.setSavePath(filename)),
    backupFile,
  );
  await button('Export backup').click();
  await expect
    .poll(() => {
      try {
        return JSON.parse(fs.readFileSync(backupFile, 'utf8')).version;
      } catch {
        return null;
      }
    })
    .toBe(1);
  const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
  expect(backup.state.schedule.flexible).toBe(true);
  expect(backup.state.schedule.extraDates).toContain(extraStamp);
  expect(backup.state.smtp).toBeNull();
  expect(JSON.stringify(backup)).not.toContain('abcdefghijklmnop');
  expect(backup.state.history).toHaveLength(1);
  await page.getByLabel('Backup file').setInputFiles({
    name: 'broken.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":99}'),
  });
  await expect(page.getByRole('alert')).toContainText('not a supported gym backup');
  expect((await state()).history).toHaveLength(1);
  await page.getByLabel('Backup file').setInputFiles(backupFile);
  await expect(page.getByRole('dialog')).toContainText('Alex');
  await button('Replace with backup').click();
  await expect(page.getByRole('status')).toContainText('Backup restored.');
  expect((await state()).smtp.appPassword).toBe('abcdefghijklmnop');
  await button('Program').click();
  await button('Choose Upper / Lower / Legs').click();
  await button('Switch program').click();
  await expect.poll(async () => (await state()).profile.program).toBe('ull');
  expect((await state()).history).toHaveLength(1);
  await button('Progress').click();
  await expect(page.locator('.history-entry')).toContainText('Chest + Triceps');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);
  await screenshot('mobile-progress');
  await app.close();
  await launch();
  saved = await state();
  expect(saved.history).toHaveLength(1);
  expect(saved.profile.program).toBe('ull');
  expect(saved.smtp.appPassword).toBe('abcdefghijklmnop');
  expect(fs.existsSync(path.join(data, 'gym-state.json.backup'))).toBe(true);
  expect(errors).toEqual([]);
  console.log(
    'PASS: onboarding, focus logging, draft restart, skips, progression, review, undo, history, validation, encrypted email, backup export/restore, program switch, responsive layout and restart persistence. No email sent.',
  );
} catch (error) {
  console.error(error);
  if (page) {
    console.error(
      await page
        .locator('body')
        .innerText()
        .catch(() => 'No page'),
    );
    if (!process.env.GYM_TEST_EXECUTABLE)
      await page.screenshot({ path: 'recovery/pro-failure.png', timeout: 5000 }).catch(() => {});
  }
  console.error('Renderer errors:', errors);
  process.exitCode = 1;
} finally {
  await app?.close().catch(() => {});
  console.log(`Isolated test data: ${data}`);
}
