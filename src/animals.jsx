import React, { useEffect, useId, useState } from 'react';
import { animalPreferences, friends, saveAnimalPreferences } from './animal-preferences.js';
import { playBark, silenceBark } from './bark.js';
import './animals.css';

function usePreferences() {
  const [preferences, setPreferences] = useState(animalPreferences);
  useEffect(() => {
    const update = () => setPreferences(animalPreferences());
    window.addEventListener('gym-animals-changed', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('gym-animals-changed', update);
      window.removeEventListener('storage', update);
    };
  }, []);
  return preferences;
}
function Paw() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true">
      <ellipse cx="15" cy="20" rx="8" ry="6" fill="currentColor" />
      <ellipse cx="5" cy="12" rx="3" ry="4" fill="currentColor" transform="rotate(-25 5 12)" />
      <ellipse cx="12" cy="7" rx="3" ry="4" fill="currentColor" />
      <ellipse cx="20" cy="8" rx="3" ry="4" fill="currentColor" />
      <ellipse cx="26" cy="14" rx="3" ry="4" fill="currentColor" transform="rotate(25 26 14)" />
    </svg>
  );
}
export function TinyAnimal({ kind }) {
  const color = {
    cat: '#afa1c9',
    frog: '#b4cb8e',
    penguin: '#77788e',
    fox: '#dfad7f',
    raccoon: '#b4b4bb',
    bunny: '#e6c2c9',
  }[kind];
  return (
    <svg
      className="tiny-animal-art"
      viewBox="0 0 110 106"
      aria-hidden="true"
      fill="none"
      stroke="#493c53"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="55" cy="96" rx="33" ry="5" fill="#493c5310" stroke="none" />
      {kind === 'bunny' && (
        <>
          <ellipse cx="40" cy="26" rx="11" ry="25" fill={color} transform="rotate(-12 40 26)" />
          <ellipse cx="70" cy="26" rx="11" ry="25" fill={color} transform="rotate(12 70 26)" />
          <path d="m39 14 3 18m28-18-3 18" stroke="#fff4ef" strokeWidth="6" />
        </>
      )}
      {['cat', 'fox'].includes(kind) && (
        <path d="M23 51 22 17l27 19M61 36 89 17l-2 35" fill={color} />
      )}
      {kind === 'raccoon' && (
        <>
          <circle cx="30" cy="34" r="13" fill={color} />
          <circle cx="80" cy="34" r="13" fill={color} />
        </>
      )}
      <ellipse cx="55" cy="73" rx="29" ry="23" fill={color} />
      <ellipse cx="55" cy="57" rx="36" ry="30" fill={color} />
      {kind === 'frog' && (
        <>
          <circle cx="32" cy="32" r="13" fill={color} />
          <circle cx="78" cy="32" r="13" fill={color} />
          <circle cx="33" cy="32" r="4" fill="#493c53" />
          <circle cx="77" cy="32" r="4" fill="#493c53" />
        </>
      )}
      {['fox', 'penguin', 'raccoon'].includes(kind) && (
        <path
          d="M24 53q17-20 31 2 14-22 31-2v15q-30 25-62 0Z"
          fill={kind === 'raccoon' ? '#686777' : '#fff5df'}
          stroke="none"
        />
      )}
      {kind !== 'frog' && (
        <>
          <circle
            cx="39"
            cy="54"
            r="3"
            fill={kind === 'raccoon' ? '#fff7e8' : '#493c53'}
            stroke="none"
          />
          <circle
            cx="71"
            cy="54"
            r="3"
            fill={kind === 'raccoon' ? '#fff7e8' : '#493c53'}
            stroke="none"
          />
        </>
      )}
      <ellipse cx="31" cy="66" rx="6" ry="3" fill="#df9b9e" stroke="none" />
      <ellipse cx="79" cy="66" rx="6" ry="3" fill="#df9b9e" stroke="none" />
      {kind === 'penguin' ? (
        <path d="m49 63 6-4 6 4-6 7Z" fill="#e7b970" />
      ) : (
        <path d="M49 67q6 7 12 0" />
      )}
      <ellipse cx="36" cy="92" rx="10" ry="5" fill={kind === 'penguin' ? '#e7b970' : color} />
      <ellipse cx="74" cy="92" rx="10" ry="5" fill={kind === 'penguin' ? '#e7b970' : color} />
      {kind === 'cat' && <path d="m20 62 12 2m-12 6 12-2m46-4 12-2m-12 6 12 2" strokeWidth="1.5" />}
    </svg>
  );
}
export function EasterEgg({ kind }) {
  const [open, setOpen] = useState(false),
    preferences = usePreferences(),
    id = useId();
  const found = preferences.found.includes(kind),
    friend = friends[kind];
  function reveal() {
    if (!found) saveAnimalPreferences({ found: [...preferences.found, kind] });
    setOpen(!open);
  }
  return (
    <div className={`animal-secret ${open ? 'revealed' : ''}`} data-friend={kind}>
      <button
        type="button"
        className="secret-paw"
        aria-label={found ? `Visit ${friend.name}` : 'Investigate a tiny paw print'}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        title={found ? friend.name : 'Was that a tiny paw?'}
        onClick={reveal}
      >
        <Paw />
      </button>
      {open && (
        <div className="animal-reveal" id={id} role="status">
          <TinyAnimal kind={kind} />
          <div>
            <strong>{friend.name}</strong>
            <p>{friend.line}</p>
            <small>
              {preferences.found.length} / {Object.keys(friends).length} tiny friends found
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
function DogArt({ princess }) {
  return (
    <svg
      className={`day-dog-art ${princess ? 'princess' : 'chihuahua'}`}
      viewBox="0 0 240 215"
      role="img"
      aria-label={
        princess
          ? 'Shiba princess wearing a golden crown and pink royal cape'
          : 'Tiny Chihuahua barking with enormous ears'
      }
      fill="none"
      stroke="#4e3b4e"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="122" cy="199" rx="72" ry="8" fill="#4e3b4e12" stroke="none" />
      {princess && <path d="M82 130 51 186q68 21 138 0l-33-56Z" fill="#d6a6c7" />}
      <path
        d="M86 135q-17 19-14 56h28l21-22 19 22h29q3-40-14-56"
        fill={princess ? '#dba168' : '#d6b891'}
      />
      <path d="M159 163q54-9 30-35-18-15-24 9" fill={princess ? '#dba168' : '#d6b891'} />
      <g className="dog-head">
        <path
          d={
            princess
              ? 'M66 94 65 35q24 4 39 30m35 0q20-29 39-30l-2 61'
              : 'M67 104Q11 68 33 24q40 13 66 62m44 0q29-65 65-62 20 44-34 80'
          }
          fill={princess ? '#dba168' : '#d6b891'}
        />
        <path
          d={
            princess
              ? 'm75 49 19 23-17 10m72-10 18-23-2 33'
              : 'M40 40q-5 34 32 48L54 48m112 39q34-13 35-48l-16 9'
          }
          fill="#dfaaa8"
          stroke="none"
        />
        <path
          d="M60 110q0-50 60-50t60 50q0 49-60 49t-60-49Z"
          fill={princess ? '#dba168' : '#d6b891'}
        />
        <path
          d="M64 113q26-15 56 8 30-23 56-8-5 39-56 41-49-2-56-41"
          fill="#fff1d9"
          stroke="none"
        />
        {princess ? (
          <path d="m86 100 7-5 7 5m40 0 7-5 7 5" />
        ) : (
          <>
            <ellipse cx="91" cy="98" rx="8" ry="10" fill="#4e3b4e" />
            <ellipse cx="149" cy="98" rx="8" ry="10" fill="#4e3b4e" />
            <circle cx="89" cy="95" r="2" fill="white" stroke="none" />
            <circle cx="147" cy="95" r="2" fill="white" stroke="none" />
          </>
        )}
        <path d="m110 116 10-3 10 3-10 8Z" fill="#4e3b4e" />
        {princess ? (
          <path d="M109 132q11 12 22 0" />
        ) : (
          <>
            <ellipse className="bark-mouth" cx="120" cy="136" rx="12" ry="10" fill="#4e3b4e" />
            <path d="M114 141q6-6 12 0v5h-12Z" fill="#df9eaa" stroke="none" />
          </>
        )}
        <ellipse cx="78" cy="118" rx="9" ry="5" fill="#e59797" stroke="none" />
        <ellipse cx="163" cy="118" rx="9" ry="5" fill="#e59797" stroke="none" />
        {princess && (
          <g className="royal-crown">
            <path d="m94 62-7-29 21 11 12-28 12 28 22-11-8 29Z" fill="#f1d17b" />
            <path d="M97 54h46" stroke="#ae8445" />
            <circle cx="120" cy="47" r="4" fill="#b197d3" stroke="none" />
            <circle cx="87" cy="31" r="4" fill="#f1d17b" />
            <circle cx="120" cy="15" r="4" fill="#f1d17b" />
            <circle cx="154" cy="31" r="4" fill="#f1d17b" />
          </g>
        )}
      </g>
      <path d="m102 157 17 7-17 8Zm37 0-17 7 17 8Z" fill={princess ? '#b997d1' : '#a8bb99'} />
      <circle cx="120" cy="164" r="4" fill="#f1d17b" />
      {princess && (
        <g fill="#d0a452" stroke="none">
          <path d="m34 83 4-11 4 11 11 4-11 4-4 11-4-11-11-4Zm164 21 4-11 4 11 11 4-11 4-4 11-4-11-11-4Z" />
        </g>
      )}
    </svg>
  );
}
export function DayAnimal({ done, name }) {
  const [barks, setBarks] = useState(0),
    preferences = usePreferences();
  function yap() {
    setBarks((value) => value + 1);
    void playBark();
  }
  return (
    <div className={`day-animal ${done ? 'royal-scene' : 'yap-scene'}`}>
      {!done && (
        <span key={`speech-${barks}`} className="bark-bubble" aria-hidden="true">
          YAP! YAP!
        </span>
      )}
      <div key={`dog-${barks}`}>
        <DogArt princess={done} />
      </div>
      <span className="royal-caption">
        {done
          ? `${name}, you have royal paws of approval.`
          : 'Official rest-day announcement. Very loud. Very small.'}
      </span>
      {!done && (
        <div className="dog-controls">
          <button type="button" className="text-button" onClick={yap}>
            Hear the Chihuahua
          </button>
          <button
            type="button"
            className="text-button"
            aria-pressed={!preferences.sound}
            onClick={() => {
              saveAnimalPreferences({ sound: !preferences.sound });
              if (preferences.sound) silenceBark();
            }}
          >
            {preferences.sound ? 'Mute animal sounds' : 'Unmute animal sounds'}
          </button>
        </div>
      )}
    </div>
  );
}
export function AnimalSettings() {
  const preferences = usePreferences();
  return (
    <section className="panel animal-settings">
      <div>
        <p className="eyebrow">NARMIN’S SECRET CHEER SQUAD</p>
        <h2>A few very small roommates.</h2>
        <p className="muted">
          Look for tiny paw prints around the app. {preferences.found.length} of{' '}
          {Object.keys(friends).length} friends found.
        </p>
      </div>
      <button
        type="button"
        className="button secondary"
        aria-pressed={preferences.sound}
        onClick={() => {
          saveAnimalPreferences({ sound: !preferences.sound });
          if (preferences.sound) silenceBark();
        }}
      >
        Animal sounds: {preferences.sound ? 'on' : 'off'}
      </button>
    </section>
  );
}
