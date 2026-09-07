import D from 'react';
import * as o from 'react/jsx-runtime';
const kl = [
    {
      id: 'chest',
      name: 'Chest',
      group: 'major',
      pairings: ['Chest + Triceps', 'Upper'],
      blurb:
        'A big pushing muscle. Pair it with triceps so both get work without stacking two huge groups.',
    },
    {
      id: 'back',
      name: 'Back',
      group: 'major',
      pairings: ['Back + Shoulders', 'Upper'],
      blurb:
        'Lats and mid-back are a major pull. They eat recovery — do not pair them with another giant day.',
    },
    {
      id: 'shoulders',
      name: 'Shoulders',
      group: 'major',
      pairings: ['Back + Shoulders', 'Upper'],
      blurb:
        'Delts count as major. Press and raise them after a back pull, not after a heavy chest day.',
    },
    {
      id: 'quads',
      name: 'Quads',
      group: 'major',
      pairings: ['Legs + Biceps', 'Lower', 'Legs'],
      blurb: 'Front of the thigh. A major mover on every squat / press pattern.',
    },
    {
      id: 'hamstrings',
      name: 'Hamstrings',
      group: 'major',
      pairings: ['Legs + Biceps', 'Lower', 'Legs'],
      blurb: 'Back of the thigh. Hinge or curl them so the legs day is not only quads.',
    },
    {
      id: 'glutes',
      name: 'Glutes',
      group: 'major',
      pairings: ['Legs + Biceps', 'Lower', 'Legs'],
      blurb:
        'Your focus muscle. Hip thrust, bridge, or abduction shows up on every lower / legs day.',
    },
    {
      id: 'triceps',
      name: 'Triceps',
      group: 'minor',
      pairings: ['Chest + Triceps', 'Upper'],
      blurb:
        'A small arm muscle that already helps on chest presses. Finish it after the big push.',
    },
    {
      id: 'biceps',
      name: 'Biceps',
      group: 'minor',
      pairings: ['Legs + Biceps', 'Upper'],
      blurb: 'A small pull muscle. On the couple plan it rides with legs so arms still get a turn.',
    },
    {
      id: 'core',
      name: 'Core / abs',
      group: 'minor',
      pairings: ['Every session'],
      blurb:
        'A short finisher, not a fourth “abs day”. Cable crunch or a machine crunch at the end.',
    },
    {
      id: 'calves',
      name: 'Calves',
      group: 'minor',
      pairings: ['Lower', 'Legs'],
      blurb:
        'A small lower-leg muscle. They get indirect work on press days; no extra calf circus.',
    },
  ],
  Mp = [
    {
      id: 'shoulders',
      d: 'M210 118c-18 8-28 28-26 48 18-6 34-16 42-30 4-12-4-20-16-18z M450 118c18 8 28 28 26 48-18-6-34-16-42-30-4-12 4-20 16-18z',
    },
    {
      id: 'chest',
      d: 'M270 150c30-16 90-16 120 0 16 20 14 48-6 62-28 8-70 8-100 0-22-14-26-42-14-62z',
    },
    {
      id: 'biceps',
      d: 'M198 188c-10 22-8 48 2 68 12 4 20-2 20-12-2-20 0-40 6-56-8-4-20-4-28 0z M462 188c10 22 8 48-2 68-12 4-20-2-20-12 2-20 0-40-6-56 8-4 20-4 28 0z',
    },
    {
      id: 'core',
      d: 'M292 228c24-6 52-6 76 0 10 28 8 70-4 102-10 8-28 12-34 12s-24-4-34-12c-12-32-14-74-4-102z',
    },
    {
      id: 'quads',
      d: 'M268 368c16 6 30 10 42 10 4 42 2 90-6 128-14 8-28 8-40 0 2-44 2-90 4-138z M390 368c-16 6-30 10-42 10-4 42-2 90 6 128 14 8 28 8 40 0-2-44-2-90-4-138z',
    },
    {
      id: 'calves',
      d: 'M276 548c10 8 18 12 24 12 2 28 0 52-4 72-12 4-22 2-30-4 2-26 6-52 10-80z M384 548c-10 8-18 12-24 12-2 28 0 52 4 72 12 4 22 2 30-4-2-26-6-52-10-80z',
    },
  ],
  Lp = [
    {
      id: 'shoulders',
      d: 'M118 120c-14 10-20 30-16 48 16-4 28-14 34-26 2-12-6-20-18-22z M310 120c14 10 20 30 16 48-16-4-28-14-34-26-2-12 6-20 18-22z',
    },
    {
      id: 'back',
      d: 'M150 128h128c10 36 12 80 6 120-4 16-20 24-70 24s-66-8-70-24c-6-40-4-84 6-120z',
    },
    {
      id: 'triceps',
      d: 'M108 176c-6 24-4 50 4 70 10 4 18-2 18-10 0-22-2-44 2-60-6-2-16-2-24 0z M320 176c6 24 4 50-4 70-10 4-18-2-18-10 0-22 2-44-2-60 6-2 16-2 24 0z',
    },
    {
      id: 'glutes',
      d: 'M158 292c18 10 32 16 56 16s38-6 56-16c6 20-4 40-20 50-12 8-24 10-36 10s-24-2-36-10c-16-10-26-30-20-50z',
    },
    {
      id: 'hamstrings',
      d: 'M164 348c14 8 26 12 40 12 2 40 0 84-8 122-12 8-24 8-36 2 0-44 2-90 4-136z M264 348c-14 8-26 12-40 12-2 40 0 84 8 122 12 8 24 8 36 2 0-44-2-90-4-136z',
    },
    {
      id: 'calves',
      d: 'M168 530c8 8 16 12 22 12 2 28 0 54-4 74-12 4-22 0-28-8 2-26 6-50 10-78z M260 530c-8 8-16 12-22 12-2 28 0 54 4 74 12 4 22 0 28-8-2-26-6-50-10-78z',
    },
  ],
  Tp = (e) =>
    `cursor-pointer transition duration-200 ${e ? 'fill-rose/40 stroke-rose stroke-2' : 'fill-rose/0 stroke-rose/0 hover:fill-rose/22 hover:stroke-rose/70'}`;
function AnatomyDiagram({ selected, onSelect, view }) {
  const regions = view === 'front' ? Mp : Lp;
  return o.jsxs('div', {
    className: 'anatomy-stage',
    children: [
      o.jsx('img', {
        src:
          view === 'front' ? './anatomy/muscles-anterior.png' : './anatomy/muscles-posterior.png',
        alt: view === 'front' ? 'Anterior muscular system' : 'Posterior muscular system',
      }),
      o.jsx('svg', {
        viewBox: view === 'front' ? '0 0 659 751' : '0 0 427 759',
        preserveAspectRatio: 'xMidYMid meet',
        'aria-label': 'Select a muscle on the diagram',
        children: regions.map((region) =>
          o.jsx(
            'path',
            {
              d: region.d,
              className: selected === region.id ? 'muscle-region selected' : 'muscle-region',
              onClick: () => onSelect(region.id),
              role: 'button',
              tabIndex: 0,
              'aria-label': region.id,
              'aria-pressed': selected === region.id,
              onKeyDown: (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(region.id);
                }
              },
            },
            region.id,
          ),
        ),
      }),
    ],
  });
}
const Xe = '#3d2e36',
  X = '#d4788a',
  ie = '#c4b0dc',
  $c = '#fff8f5',
  me = '#c4a46a';
function ee({ children: e }) {
  return o.jsxs('svg', {
    viewBox: '0 0 96 72',
    className: 'h-full w-full',
    'aria-hidden': !0,
    children: [
      o.jsx('rect', {
        width: '96',
        height: '72',
        rx: '10',
        fill: $c,
      }),
      o.jsx('rect', {
        x: '1.5',
        y: '1.5',
        width: '93',
        height: '69',
        rx: '9',
        fill: 'none',
        stroke: X,
        strokeOpacity: '0.35',
      }),
      e,
    ],
  });
}
function MachineIllustration({ id: e }) {
  switch (e) {
    case 'chest-press':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '18',
            y: '46',
            width: '60',
            height: '8',
            rx: '2',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M28 46V24h40v22',
            fill: 'none',
            stroke: X,
            strokeWidth: '2.4',
          }),
          o.jsx('rect', {
            x: '36',
            y: '28',
            width: '24',
            height: '12',
            rx: '3',
            fill: me,
            opacity: '0.85',
          }),
          o.jsx('circle', {
            cx: '30',
            cy: '34',
            r: '5',
            fill: 'none',
            stroke: Xe,
            strokeWidth: '1.4',
          }),
          o.jsx('circle', {
            cx: '66',
            cy: '34',
            r: '5',
            fill: 'none',
            stroke: Xe,
            strokeWidth: '1.4',
          }),
        ],
      });
    case 'pec-deck':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '40',
            y: '16',
            width: '16',
            height: '36',
            rx: '4',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M24 24c8 8 8 20 0 28',
            fill: 'none',
            stroke: X,
            strokeWidth: '4',
          }),
          o.jsx('path', {
            d: 'M72 24c-8 8-8 20 0 28',
            fill: 'none',
            stroke: X,
            strokeWidth: '4',
          }),
        ],
      });
    case 'tricep-pushdown':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '20',
            y: '12',
            width: '56',
            height: '6',
            rx: '2',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M48 18v28',
            stroke: Xe,
            strokeWidth: '2',
          }),
          o.jsx('rect', {
            x: '40',
            y: '44',
            width: '16',
            height: '5',
            rx: '1.5',
            fill: X,
          }),
          o.jsx('path', {
            d: 'M36 52h24',
            stroke: me,
            strokeWidth: '3',
            strokeLinecap: 'round',
          }),
        ],
      });
    case 'overhead-extension':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '22',
            y: '14',
            width: '52',
            height: '6',
            rx: '2',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M48 20v18',
            stroke: Xe,
            strokeWidth: '2',
          }),
          o.jsx('path', {
            d: 'M36 22c0 10 24 10 24 0',
            fill: 'none',
            stroke: X,
            strokeWidth: '3',
          }),
          o.jsx('circle', {
            cx: '48',
            cy: '44',
            r: '7',
            fill: me,
          }),
        ],
      });
    case 'leg-press':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '14',
            y: '40',
            width: '44',
            height: '10',
            rx: '3',
            fill: ie,
          }),
          o.jsx('rect', {
            x: '50',
            y: '18',
            width: '28',
            height: '22',
            rx: '3',
            fill: X,
          }),
          o.jsx('path', {
            d: 'M56 40 44 50',
            stroke: Xe,
            strokeWidth: '2',
          }),
        ],
      });
    case 'hip-thrust':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '16',
            y: '38',
            width: '64',
            height: '8',
            rx: '3',
            fill: ie,
          }),
          o.jsx('rect', {
            x: '28',
            y: '24',
            width: '40',
            height: '10',
            rx: '5',
            fill: X,
          }),
          o.jsx('circle', {
            cx: '48',
            cy: '20',
            r: '6',
            fill: me,
          }),
        ],
      });
    case 'leg-curl':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '18',
            y: '20',
            width: '36',
            height: '14',
            rx: '4',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M52 28c12 0 20 10 20 20',
            fill: 'none',
            stroke: X,
            strokeWidth: '5',
          }),
          o.jsx('circle', {
            cx: '72',
            cy: '50',
            r: '5',
            fill: me,
          }),
        ],
      });
    case 'cable-curl':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '18',
            y: '12',
            width: '60',
            height: '6',
            rx: '2',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M32 18v22M64 18v22',
            stroke: Xe,
            strokeWidth: '2',
          }),
          o.jsx('path', {
            d: 'M28 42h8M60 42h8',
            stroke: X,
            strokeWidth: '3',
            strokeLinecap: 'round',
          }),
          o.jsx('path', {
            d: 'M36 50c4 8 20 8 24 0',
            fill: 'none',
            stroke: me,
            strokeWidth: '2.2',
          }),
        ],
      });
    case 'cable-crunch':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '20',
            y: '12',
            width: '56',
            height: '6',
            rx: '2',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M48 18v16',
            stroke: Xe,
            strokeWidth: '2',
          }),
          o.jsx('ellipse', {
            cx: '48',
            cy: '48',
            rx: '16',
            ry: '10',
            fill: X,
          }),
          o.jsx('path', {
            d: 'M40 44c4 6 12 6 16 0',
            fill: 'none',
            stroke: $c,
            strokeWidth: '2',
          }),
        ],
      });
    case 'lat-pulldown':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '16',
            y: '12',
            width: '64',
            height: '6',
            rx: '2',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M26 18v10h44V18',
            fill: 'none',
            stroke: X,
            strokeWidth: '3',
          }),
          o.jsx('rect', {
            x: '36',
            y: '40',
            width: '24',
            height: '16',
            rx: '3',
            fill: me,
          }),
        ],
      });
    case 'seated-row':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '14',
            y: '42',
            width: '40',
            height: '10',
            rx: '3',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M54 46h18',
            stroke: Xe,
            strokeWidth: '3',
          }),
          o.jsx('rect', {
            x: '70',
            y: '22',
            width: '10',
            height: '28',
            rx: '2',
            fill: X,
          }),
          o.jsx('circle', {
            cx: '28',
            cy: '28',
            r: '8',
            fill: me,
          }),
        ],
      });
    case 'shoulder-press':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '30',
            y: '36',
            width: '36',
            height: '16',
            rx: '4',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M26 36V18M70 36V18',
            stroke: X,
            strokeWidth: '3',
          }),
          o.jsx('rect', {
            x: '20',
            y: '14',
            width: '12',
            height: '6',
            rx: '1.5',
            fill: me,
          }),
          o.jsx('rect', {
            x: '64',
            y: '14',
            width: '12',
            height: '6',
            rx: '1.5',
            fill: me,
          }),
        ],
      });
    case 'lateral-raise':
      return o.jsxs(ee, {
        children: [
          o.jsx('circle', {
            cx: '48',
            cy: '36',
            r: '10',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M20 40h16M60 40h16',
            stroke: X,
            strokeWidth: '4',
            strokeLinecap: 'round',
          }),
          o.jsx('circle', {
            cx: '18',
            cy: '40',
            r: '4',
            fill: me,
          }),
          o.jsx('circle', {
            cx: '78',
            cy: '40',
            r: '4',
            fill: me,
          }),
        ],
      });
    case 'hip-abduction':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '36',
            y: '16',
            width: '24',
            height: '14',
            rx: '4',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M28 36c-8 10-8 18 0 22M68 36c8 10 8 18 0 22',
            fill: 'none',
            stroke: X,
            strokeWidth: '5',
          }),
        ],
      });
    case 'machine-crunch':
      return o.jsxs(ee, {
        children: [
          o.jsx('path', {
            d: 'M24 48c8-20 40-20 48 0',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M32 28c10 8 22 8 32 0',
            fill: 'none',
            stroke: X,
            strokeWidth: '4',
          }),
          o.jsx('circle', {
            cx: '48',
            cy: '24',
            r: '5',
            fill: me,
          }),
        ],
      });
    case 'glute-kickback':
      return o.jsxs(ee, {
        children: [
          o.jsx('rect', {
            x: '18',
            y: '16',
            width: '12',
            height: '40',
            rx: '3',
            fill: ie,
          }),
          o.jsx('path', {
            d: 'M30 40h22',
            stroke: Xe,
            strokeWidth: '2',
          }),
          o.jsx('path', {
            d: 'M52 40c10-2 18 8 14 16',
            fill: 'none',
            stroke: X,
            strokeWidth: '5',
          }),
          o.jsx('circle', {
            cx: '68',
            cy: '56',
            r: '5',
            fill: me,
          }),
        ],
      });
    default:
      return o.jsx(ee, {
        children: o.jsx('circle', {
          cx: '48',
          cy: '36',
          r: '12',
          fill: X,
        }),
      });
  }
}

export { AnatomyDiagram, MachineIllustration };
