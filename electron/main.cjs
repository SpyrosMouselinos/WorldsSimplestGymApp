const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { app, BrowserWindow, ipcMain, safeStorage } = require('electron');
const Store = require('electron-store');
const { sendWorkoutEmail, sendTestEmail } = require('./mail.cjs');

// Test runs always use a separate directory, never the user's workout data.
if (process.env.GYM_TEST_DATA_DIR) app.setPath('userData', process.env.GYM_TEST_DATA_DIR);
app.setName('Worlds Simplest Gym');
let store;
let core;
function readState() {
  const state = core.normalizeState(store.store);
  if (state.smtp?.encryptedPassword) {
    if (!safeStorage.isEncryptionAvailable()) throw new Error('Windows credential storage is unavailable. Try reopening the app.');
    state.smtp = { user: state.smtp.user, appPassword: safeStorage.decryptString(Buffer.from(state.smtp.encryptedPassword, 'base64')) };
  }
  return state;
}
function writeState(state) {
  const saved = structuredClone(state);
  if (saved.smtp?.appPassword) {
    if (!safeStorage.isEncryptionAvailable()) throw new Error('Windows credential storage is unavailable. Email settings were not saved.');
    saved.smtp = { user: saved.smtp.user, encryptedPassword: safeStorage.encryptString(saved.smtp.appPassword).toString('base64') };
  }
  // Retain a recovery copy before every atomic electron-store write.
  if (fs.existsSync(store.path)) {
    const previous = structuredClone(store.store);
    if (previous.smtp?.appPassword && safeStorage.isEncryptionAvailable()) {
      previous.smtp = { user: previous.smtp.user, encryptedPassword: safeStorage.encryptString(previous.smtp.appPassword).toString('base64') };
      fs.writeFileSync(`${store.path}.backup`, JSON.stringify(previous, null, 2));
    } else fs.copyFileSync(store.path, `${store.path}.backup`);
  }
  store.store = saved;
  return state;
}
function trusted(event) {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || event.senderFrame !== event.sender.mainFrame) throw new Error('Untrusted request.');
}
function handle(channel, fn) {
  ipcMain.handle(channel, (event, payload) => { trusted(event); return fn(payload); });
}
function createWindow() {
  const win = new BrowserWindow({ width: 1200, height: 850, minWidth: 1040, minHeight: 720, frame: false, backgroundColor: '#fbf6f3', show: !process.env.GYM_TEST_DATA_DIR, webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', event => event.preventDefault());
  if (process.env.VITE_DEV_SERVER_URL && !app.isPackaged) win.loadURL(process.env.VITE_DEV_SERVER_URL);
  else win.loadFile(path.join(__dirname, '../dist/index.html'));
}
if (!app.requestSingleInstanceLock()) app.quit();
else app.whenReady().then(async () => {
  core = await import(pathToFileURL(path.join(__dirname, '../src/core.js')).href);
  store = new Store({ name: 'gym-state', defaults: core.emptyState() });
  if (store.get('smtp')?.appPassword && safeStorage.isEncryptionAvailable()) writeState(readState());
  handle('store:get', () => readState());
  for (const action of ['onboard', 'profile', 'smtp', 'program', 'lift', 'complete', 'skip-session']) {
    handle(`store:${action}`, payload => writeState(core.reduceState(readState(), action, payload)));
  }
  let sending = false;
  async function send(payload, test) {
    if (sending) return { ok: false, error: 'An email is already being sent.' };
    const state = readState();
    if (!state.smtp?.user || !state.smtp.appPassword) return { ok: false, error: 'Add a Gmail address and app password in Log → Optional email first.' };
    if (!test && (!payload || typeof payload.sessionName !== 'string' || typeof payload.dateLabel !== 'string' || !Array.isArray(payload.exercises) || !payload.exercises.length || payload.exercises.length > 30)) return { ok: false, error: 'Invalid workout email.' };
    sending = true;
    try {
      const recipient = state.profile.email || state.smtp.user;
      return await (test ? sendTestEmail(state.smtp, recipient) : sendWorkoutEmail(state.smtp, recipient, payload));
    } finally { sending = false; }
  }
  handle('mail:workout', payload => send(payload, false));
  handle('mail:test', () => send(null, true));
  for (const action of ['min', 'max', 'close']) ipcMain.on(`win:${action}`, event => {
    trusted(event);
    const win = BrowserWindow.fromWebContents(event.sender);
    if (action === 'min') win.minimize();
    if (action === 'max') win.isMaximized() ? win.unmaximize() : win.maximize();
    if (action === 'close') win.close();
  });
  createWindow();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
  app.on('second-instance', () => { const win = BrowserWindow.getAllWindows()[0]; if (win) { win.restore(); win.focus(); } });
}).catch(error => {
  const { dialog } = require('electron');
  dialog.showErrorBox('Could not open gym data', `${error.message}\nYour saved data has not been reset. Check the gym-state.json file and its .backup in ${app.getPath('userData')}.`);
  app.quit();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
