import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let sent;
let options;
let failure;
const nodemailer = require('nodemailer');
nodemailer.createTransport = config => {
  options = config;
  return { sendMail: async message => { if (failure) throw failure; sent = message; } };
};
require.cache[require.resolve('electron')] = { exports: { app: { isPackaged: false } } };
const { sendWorkoutEmail, sendTestEmail } = require('../electron/mail.cjs');
test('workout email includes escaped content, weights, images and a bounded TLS connection', async () => {
  const result = await sendWorkoutEmail({ user: 'test@example.com', appPassword: 'fake' }, 'recipient@example.com', {
    sessionName: '<Workout>', dateLabel: 'Monday', exercises: [{ id: 'chest-press', name: 'Chest press', image: 'chest-press.svg', sets: 3, minReps: 8, maxReps: 12, kg: 20 }]
  });
  assert.equal(result.ok, true);
  assert.match(sent.html, /&lt;Workout&gt;/);
  assert.match(sent.html, /20 kg/);
  assert.equal(sent.to, 'recipient@example.com');
  assert.equal(sent.attachments.length, 1);
  assert.equal(options.requireTLS, true);
  assert.equal(options.socketTimeout, 30000);
});
test('mail failure returns an actionable error and can be retried', async () => {
  failure = new Error('EAUTH invalid login');
  const rejected = await sendTestEmail({ user: 'test@example.com', appPassword: 'fake' }, 'test@example.com');
  assert.equal(rejected.ok, false);
  assert.match(rejected.error, /Gmail rejected/);
  failure = null;
  assert.equal((await sendTestEmail({ user: 'test@example.com', appPassword: 'fake' }, 'test@example.com')).ok, true);
});
