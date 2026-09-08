import React, { useId } from 'react';
import './anatomy.css';

// The visible muscle IS its hit target. Every part shares this one coordinate system.
const front = [
  { id: 'shoulders', pair: true, d: 'M96 110Q77 115 73 140L69 158Q82 161 94 143L104 122Z' },
  { id: 'chest', pair: true, d: 'M106 126Q124 119 147 128L147 164Q126 177 105 157L99 143Z' },
  {
    id: 'biceps',
    pair: true,
    d: 'M72 162Q82 165 90 155L86 183Q82 201 72 214L63 209Q65 187 72 162Z',
  },
  {
    id: 'core',
    pair: true,
    d: 'M131 178Q139 173 147 177L147 204L130 204ZM130 210H147V237H129ZM129 243H147V279Q136 275 129 262Z M109 172L122 184 121 262 112 281 102 255Z',
  },
  {
    id: 'quads',
    pair: true,
    d: 'M105 324Q120 323 141 338L140 389Q138 426 128 443L113 438Q98 393 105 324Z',
  },
  {
    id: 'calves',
    pair: true,
    d: 'M111 463Q120 472 131 461L128 487 120 526 111 525Q105 491 111 463Z',
  },
];
const back = [
  { id: 'shoulders', pair: true, d: 'M97 111Q78 115 73 140L69 159Q82 157 94 145L105 125Z' },
  {
    id: 'back',
    pair: true,
    d: 'M143 101L147 105V183L128 170 105 134 112 120Z M103 151L122 180 147 193V273L124 255 109 218Z',
  },
  { id: 'triceps', pair: true, d: 'M71 163Q80 165 90 155L85 190 73 218 63 210Q65 183 71 163Z' },
  { id: 'glutes', pair: true, d: 'M115 277Q128 284 147 284V321Q133 338 107 322L103 307Z' },
  {
    id: 'hamstrings',
    pair: true,
    d: 'M106 333Q124 344 142 335L137 407 128 444 113 438Q101 394 106 333Z',
  },
  {
    id: 'calves',
    pair: true,
    d: 'M112 460Q121 469 132 459L132 482Q129 505 118 516L109 501Q106 480 112 460Z',
  },
];
const silhouette =
  'M137 86L136 104Q119 110 103 108Q79 109 69 132L57 181 45 229 37 271 28 285 29 305Q34 315 39 304L46 284 54 275 61 244 72 219 91 180 102 168 106 205 101 255 96 297Q91 326 98 367L102 411 104 446 101 479 106 529 104 551 96 566Q93 575 112 575L129 571 131 555 129 531 139 492 138 452 146 394 150 352 154 394 162 452 161 492 171 531 169 555 171 571 188 575Q207 575 204 566L196 551 194 529 199 479 196 446 198 411 202 367Q209 326 204 297L199 255 194 205 198 168 209 180 228 219 239 244 246 275 254 284 261 304Q266 315 271 305L272 285 263 271 255 229 243 181 231 132Q221 109 197 108Q181 110 164 104L163 86Z';
export function AnatomyDiagram({ selected, onSelect, view }) {
  const title = useId();
  const regions = view === 'front' ? front : back;
  return (
    <div className="body-map">
      <svg viewBox="0 0 300 595" role="group" aria-labelledby={title} className="body-map-svg">
        <title id={title}>{view === 'front' ? 'Front' : 'Back'} muscle map — select a muscle</title>
        <ellipse cx="150" cy="580" rx="64" ry="6" fill="#e7deeb" />
        <path d={silhouette} fill="#e8dfe9" />
        <path d="M128 47Q128 25 150 25T172 47L170 71Q165 92 150 95 135 92 130 71Z" fill="#e8dfe9" />
        <path d="M54 231L65 224 53 269 45 278ZM110 535H125L123 557 113 562Z" fill="#d3c7d7" />
        <path d="M246 231L235 224 247 269 255 278ZM190 535H175L177 557 187 562Z" fill="#d3c7d7" />
        {regions.map((region) => (
          <g
            key={region.id}
            className={`body-muscle ${selected === region.id ? 'selected' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={region.id}
            aria-pressed={selected === region.id}
            onClick={() => onSelect(region.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(region.id);
              }
            }}
          >
            <path d={region.d} />
            {region.pair && <path d={region.d} transform="translate(300 0) scale(-1 1)" />}
          </g>
        ))}
      </svg>
      <p className="body-map-caption">
        <span className="muscle-key" /> {selected.charAt(0).toUpperCase() + selected.slice(1)}{' '}
        selected · tap a muscle
      </p>
    </div>
  );
}
