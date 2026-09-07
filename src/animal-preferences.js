export const friends = {
  cat: { name: 'Mochi the pocket cat', line: 'I counted your reps. Then I took a nap.' },
  frog: { name: 'Sir Ribbits', line: 'Resting? Excellent. I have a lily pad for that.' },
  penguin: { name: 'Pebble the penguin', line: 'A tiny waddle of progress is still progress.' },
  fox: { name: 'Clementine the fox', line: 'Clever girl. You found the secret study buddy.' },
  raccoon: { name: 'Bean the raccoon', line: 'I made a plan. It mostly involves snacks.' },
  bunny: { name: 'Clover the backup bunny', line: 'Your hard work is safe in my very small paws.' },
};
let fallback = { sound: true, found: [] };
export function animalPreferences() {
  try {
    const value = JSON.parse(localStorage.getItem('gym-animal-friends-v1') ?? 'null');
    if (value)
      return {
        sound: value.sound !== false,
        found: [
          ...new Set(
            Array.isArray(value.found)
              ? value.found.filter((id) => Object.hasOwn(friends, id))
              : [],
          ),
        ],
      };
  } catch {
    /* Cosmetic preferences remain usable if storage is unavailable. */
  }
  return fallback;
}
export function saveAnimalPreferences(patch) {
  fallback = { ...animalPreferences(), ...patch };
  try {
    localStorage.setItem('gym-animal-friends-v1', JSON.stringify(fallback));
  } catch {}
  window.dispatchEvent(new Event('gym-animals-changed'));
}
