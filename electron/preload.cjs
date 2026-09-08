'use strict';
const electron = require('electron');
const gym = {
  updateSchedule: (payload) => electron.ipcRenderer.invoke('store:schedule', payload),
  trainToday: () => electron.ipcRenderer.invoke('store:train-today'),
  cancelTraining: () => electron.ipcRenderer.invoke('store:cancel-training'),
  addExtraDay: (date) => electron.ipcRenderer.invoke('store:extra-day', { date }),
  removeExtraDay: (date) => electron.ipcRenderer.invoke('store:remove-extra', { date }),
  undoSession: () => electron.ipcRenderer.invoke('store:undo-session'),
  restoreBackup: (payload) => electron.ipcRenderer.invoke('store:restore', payload),
  getState: () => electron.ipcRenderer.invoke('store:get'),
  completeOnboarding: (payload) => electron.ipcRenderer.invoke('store:onboard', payload),
  updateProfile: (patch) => electron.ipcRenderer.invoke('store:profile', patch),
  setSmtp: (smtp) => electron.ipcRenderer.invoke('store:smtp', smtp),
  setProgram: (program) => electron.ipcRenderer.invoke('store:program', program),
  updateLift: (exerciseId, workingKg) =>
    electron.ipcRenderer.invoke('store:lift', { exerciseId, workingKg }),
  completeSession: (payload) => electron.ipcRenderer.invoke('store:complete', payload),
  skipSession: (sessionId, sessionName) =>
    electron.ipcRenderer.invoke('store:skip-session', { sessionId, sessionName }),
  sendWorkoutEmail: (payload) => electron.ipcRenderer.invoke('mail:workout', payload),
  sendTestEmail: () => electron.ipcRenderer.invoke('mail:test'),
  minimize: () => electron.ipcRenderer.send('win:min'),
  maximize: () => electron.ipcRenderer.send('win:max'),
  close: () => electron.ipcRenderer.send('win:close'),
};
electron.contextBridge.exposeInMainWorld('gym', gym);
