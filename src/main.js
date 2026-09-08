import './style.css';
import { emptyState, normalizeState, reduceState } from './core.js';
import { parseBackup } from './planner.js';

function report(error) {
  let alert = document.getElementById('app-error');
  if (!alert) {
    alert = document.createElement('div');
    alert.id = 'app-error';
    alert.setAttribute('role', 'alert');
    Object.assign(alert.style, {
      position: 'fixed',
      bottom: '20px',
      left: '120px',
      right: '20px',
      zIndex: 1000,
      padding: '16px',
      background: '#fff0f2',
      color: '#65253a',
      border: '1px solid #d4788a',
      borderRadius: '8px',
    });
    document.body.append(alert);
  }
  alert.replaceChildren(document.createTextNode(error?.message ?? String(error)));
  const close = document.createElement('button');
  close.textContent = 'Dismiss';
  close.style.marginLeft = '20px';
  close.onclick = () => alert.remove();
  alert.append(close);
}
window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  report(event.reason);
});
window.addEventListener('error', (event) => report(event.error ?? event.message));
window.addEventListener('gym-error', (event) => report(event.detail));

// Browser preview uses local persistence; Gmail is available in the desktop app.
if (!window.gym) {
  const key = 'worlds-simplest-gym-state-v1';
  const readState = () =>
    normalizeState(JSON.parse(localStorage.getItem(key) ?? JSON.stringify(emptyState())));
  const getState = async () => readState();
  const change = async (action, payload) => {
    if (action === 'smtp' && payload)
      throw new Error('Email credentials can only be saved in the desktop app.');
    const state = reduceState(readState(), action, payload);
    localStorage.setItem(key, JSON.stringify(state));
    return state;
  };
  window.gym = {
    updateSchedule: (payload) => change('schedule', payload),
    trainToday: () => change('train-today'),
    cancelTraining: () => change('cancel-training'),
    addExtraDay: (date) => change('extra-day', { date }),
    removeExtraDay: (date) => change('remove-extra', { date }),
    undoSession: () => change('undo-session'),
    restoreBackup: async (payload) => {
      const state = parseBackup(payload);
      localStorage.setItem(key, JSON.stringify(state));
      return state;
    },
    getState,
    completeOnboarding: (payload) => change('onboard', payload),
    updateProfile: (payload) => change('profile', payload),
    setProgram: (payload) => change('program', payload),
    setSmtp: (payload) => change('smtp', payload),
    updateLift: (exerciseId, workingKg) => change('lift', { exerciseId, workingKg }),
    completeSession: (payload) => change('complete', payload),
    skipSession: (sessionId, sessionName) => change('skip-session', { sessionId, sessionName }),
    sendWorkoutEmail: async () => ({ ok: false, error: 'Email is available in the desktop app.' }),
    sendTestEmail: async () => ({ ok: false, error: 'Email is available in the desktop app.' }),
    minimize() {},
    maximize() {},
    close() {},
  };
  document.documentElement.dataset.browser = 'true';
}
import('./App.jsx').catch(report);
