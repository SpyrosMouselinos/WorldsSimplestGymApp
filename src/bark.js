import { animalPreferences } from './animal-preferences.js';
let context;
const sources = new Set();
// Prime audio in the confirmation click, then play only after the skip is saved.
export function prepareBark() {
  if (!animalPreferences().sound) return Promise.resolve(null);
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return Promise.resolve(null);
    context ??= new Audio();
    return context
      .resume()
      .then(() => context)
      .catch(() => null);
  } catch {
    return Promise.resolve(null);
  }
}
export function silenceBark() {
  for (const source of sources) {
    try {
      source.stop();
    } catch {}
  }
  sources.clear();
  if (context?.state === 'running') void context.suspend().catch(() => {});
}
export async function playBark(ready = prepareBark()) {
  const audio = await ready;
  if (!audio || !animalPreferences().sound || audio.state !== 'running') return false;
  // Two short, soft cartoon yaps, synthesized locally. No network or audio file.
  try {
    const start = audio.currentTime + 0.015;
    for (let yap = 0; yap < 2; yap++) {
      const duration = 0.17,
        buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * duration), audio.sampleRate);
      const samples = buffer.getChannelData(0);
      let phase = 0;
      for (let i = 0; i < samples.length; i++) {
        const position = i / samples.length;
        phase += (2 * Math.PI * (420 - position * 220 + yap * 25)) / audio.sampleRate;
        const growl = Math.tanh(3 * Math.sin(phase));
        samples[i] =
          (growl * 0.65 + (Math.random() * 2 - 1) * 0.35) * Math.sin(Math.PI * position) ** 0.65;
      }
      const source = audio.createBufferSource(),
        filter = audio.createBiquadFilter(),
        gain = audio.createGain();
      source.buffer = buffer;
      filter.type = 'bandpass';
      filter.frequency.value = 950;
      filter.Q.value = 0.65;
      gain.gain.value = 0.18;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(audio.destination);
      sources.add(source);
      source.onended = () => {
        sources.delete(source);
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
      source.start(start + yap * 0.25);
    }
    return true;
  } catch {
    return false;
  }
}
