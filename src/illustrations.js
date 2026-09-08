import * as o from 'react/jsx-runtime';
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

export { MachineIllustration };
