import { _electron as electron, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const env = {
  ...process.env,
  GYM_TEST_DATA_DIR: fs.mkdtempSync(path.join(os.tmpdir(), 'gym-animals-')),
};
delete env.ELECTRON_RUN_AS_NODE;
const app = await electron.launch({
  executablePath: process.env.GYM_TEST_EXECUTABLE || undefined,
  args: process.env.GYM_TEST_EXECUTABLE ? [] : ['.'],
  env,
});
const errors = [];
try {
  const page = await app.firstWindow();
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  const button = (name) => page.getByRole('button', { name, exact: true });
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Narmin');
  await page.evaluate(() =>
    window.gym.completeOnboarding({
      profile: {
        name: 'Narmin',
        heightCm: 170,
        weightKg: 60,
        email: '',
        gymDays: [0, 1, 2, 3, 4, 5, 6],
        program: 'couple',
      },
    }),
  );
  await page.reload();
  // Exercise scheduling and mute without making sound on the test machine.
  await page.evaluate(() => {
    window.yaps = 0;
    window.AudioContext = class {
      state = 'running';
      currentTime = 0;
      sampleRate = 8000;
      destination = {};
      resume() {
        this.state = 'running';
        return Promise.resolve();
      }
      suspend() {
        this.state = 'suspended';
        return Promise.resolve();
      }
      createBuffer(_channels, size) {
        return { getChannelData: () => new Float32Array(size) };
      }
      createBufferSource() {
        return {
          connect() {},
          disconnect() {},
          start() {
            window.yaps++;
          },
          stop() {
            this.onended?.();
          },
        };
      }
      createBiquadFilter() {
        return { frequency: {}, Q: {}, connect() {}, disconnect() {} };
      }
      createGain() {
        return { gain: {}, connect() {}, disconnect() {} };
      }
    };
  });
  const audit = async () => {
    const result = await new AxeBuilder({ page })
      .setLegacyMode()
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  };
  for (const [screen, kind] of [
    ['Today', 'cat'],
    ['Today', 'frog'],
    ['Progress', 'penguin'],
    ['Learn', 'fox'],
    ['Program', 'raccoon'],
    ['Settings', 'bunny'],
  ]) {
    await button(screen).click();
    await page.locator(`[data-friend="${kind}"] button`).click();
    await expect(page.locator(`[data-friend="${kind}"] .animal-reveal`)).toBeVisible();
    await audit();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.setViewportSize({ width: 1280, height: 900 });
    if (kind === 'bunny' && !process.env.GYM_TEST_EXECUTABLE)
      await page.screenshot({ path: 'recovery/narmin-hidden-friend.png' });
  }
  await expect(page.locator('.animal-settings')).toContainText('6 of 6 friends found');
  await button('Today').click();
  await button('Skip this day').click();
  await button('Keep as is').click();
  expect(await page.evaluate(() => window.yaps)).toBe(0);
  await button('Skip this day').click();
  await button('Skip day').click();
  await expect(
    page.getByRole('img', { name: 'Tiny Chihuahua barking with enormous ears' }),
  ).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.yaps)).toBe(2);
  await audit();
  if (!process.env.GYM_TEST_EXECUTABLE)
    await page.screenshot({ path: 'recovery/narmin-chihuahua.png' });
  await button('Mute animal sounds').click();
  await button('Hear the Chihuahua').click();
  expect(await page.evaluate(() => window.yaps)).toBe(2);
  await button('Unmute animal sounds').click();
  await button('Hear the Chihuahua').click();
  await expect.poll(() => page.evaluate(() => window.yaps)).toBe(4);
  await button('Progress').click();
  await button('Today').click();
  expect(await page.evaluate(() => window.yaps)).toBe(4);
  await button('Mute animal sounds').click();
  await page.reload();
  await expect(button('Unmute animal sounds')).toBeVisible();
  await button('Undo today’s log').click();
  await button('Undo log').click();
  await expect(button('Finish exercise')).toBeVisible();
  const tabs = page.getByRole('tab');
  for (let i = 0; i < (await tabs.count()); i++) {
    await tabs.nth(i).click();
    await button('Finish exercise').click();
  }
  await button('Finish workout').click();
  await button('Save workout').click();
  await expect(
    page.getByRole('img', { name: 'Shiba princess wearing a golden crown and pink royal cape' }),
  ).toBeVisible();
  await expect(page.locator('.royal-caption')).toContainText('Narmin');
  await audit();
  if (!process.env.GYM_TEST_EXECUTABLE)
    await page.screenshot({ path: 'recovery/narmin-shiba.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await button('Settings').click();
  await expect(page.locator('.animal-settings')).toContainText('6 of 6 friends found');
  await expect(button('Animal sounds: off')).toBeVisible();
  expect(errors).toEqual([]);
  console.log(
    'PASS: Narmin default, six persistent discoveries, cancel/skip/undo/finish, two yaps, mute/replay, no navigation autoplay, mobile layout and animal accessibility.',
  );
} finally {
  await app.close();
}
