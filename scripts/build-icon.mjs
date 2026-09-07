import { _electron as electron } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const env = {
  ...process.env,
  GYM_TEST_DATA_DIR: fs.mkdtempSync(path.join(os.tmpdir(), 'gym-icon-')),
};
delete env.ELECTRON_RUN_AS_NODE;
const app = await electron.launch({ args: ['.'], env });
try {
  const page = await app.firstWindow();
  await page.setViewportSize({ width: 256, height: 256 });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${fs.readFileSync('public/app-icon.svg', 'utf8')}</body></html>`,
  );
  const png = await page.screenshot({ omitBackground: true, scale: 'css' });
  fs.writeFileSync('public/app-icon.png', png);
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  fs.mkdirSync('resources', { recursive: true });
  fs.writeFileSync('resources/icon.ico', Buffer.concat([header, png]));
} finally {
  await app.close();
}
