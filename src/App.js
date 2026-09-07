import { exercises as Ic, sessionsFor as gr } from "./catalog.js";
import D from "react";
import * as o from "react/jsx-runtime";
import * as ms from "react-dom/client";
const rd = D;
function useToday() {
  const [today, setToday] = D.useState(() => Ft(new Date()));
  D.useEffect(() => {
    const refresh = () => setToday(previous => dateStamp(previous) === dateStamp(new Date()) ? previous : Ft(new Date()));
    const timer = setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);
  return today;
}
function draftKey(state) { return `gym-draft:${state.profile?.program}:${state.queue.nextIndex}`; }
function readDraft(state) {
  try { return JSON.parse(localStorage.getItem(draftKey(state)) ?? '{}'); }
  catch { return {}; }
}
function EditableInput({ value, onCommit, type = 'text', ...props }) {
  const [draft, setDraft] = D.useState(String(value ?? ''));
  D.useEffect(() => setDraft(String(value ?? '')), [value]);
  return o.jsx('input', { ...props, type, value: draft,
    onChange: event => setDraft(event.target.value),
    onKeyDown: event => { if (event.key === 'Enter') event.currentTarget.blur(); },
    onBlur: async () => {
      if (draft === String(value ?? '')) return;
      try {
        if (type === 'number' && draft.trim() === '') throw new Error('Enter a number.');
        await onCommit(type === 'number' ? Number(draft) : draft);
      } catch (error) {
        setDraft(String(value ?? ''));
        window.dispatchEvent(new CustomEvent('gym-error', { detail: error }));
      }
    }
  });
}
function gp({
  className: e = "h-5 w-5",
  title: t = "Gym day"
}) {
  return o.jsxs("svg", {
    viewBox: "0 0 24 24",
    className: e,
    "aria-hidden": !t,
    role: "img",
    children: [t ? o.jsx("title", {
      children: t
    }) : null, o.jsx("path", {
      fill: "currentColor",
      d: "M4 9h2v6H4V9zm14 0h2v6h-2V9zM7 10h2v4H7v-4zm8 0h2v4h-2v-4zM9 11h6v2H9v-2z"
    })]
  });
}
function yp({
  className: e = "h-5 w-5",
  title: t = "Rest day"
}) {
  return o.jsxs("svg", {
    viewBox: "0 0 24 24",
    className: e,
    "aria-hidden": !t,
    role: "img",
    children: [t ? o.jsx("title", {
      children: t
    }) : null, o.jsx("path", {
      fill: "currentColor",
      d: "M15.4 3.2a8.8 8.8 0 1 0 5.4 14.2 7.2 7.2 0 0 1-5.4-14.2z"
    })]
  });
}
function vp({
  className: e = "h-5 w-5",
  title: t = "Done"
}) {
  return o.jsxs("svg", {
    viewBox: "0 0 24 24",
    className: e,
    "aria-hidden": !t,
    role: "img",
    children: [t ? o.jsx("title", {
      children: t
    }) : null, o.jsx("path", {
      fill: "currentColor",
      d: "M12 4c1.4 2.2 1.4 4.4 0 6-1.4-1.6-1.4-3.8 0-6zm0 16c-1.4-2.2-1.4-4.4 0-6 1.4 1.6 1.4 3.8 0 6zM4 12c2.2-1.4 4.4-1.4 6 0-1.6 1.4-3.8 1.4-6 0zm16 0c-2.2 1.4-4.4 1.4-6 0 1.6-1.4 3.8-1.4 6 0z"
    }), o.jsx("circle", {
      cx: "12",
      cy: "12",
      r: "2.2",
      fill: "currentColor"
    })]
  });
}
function mu({
  className: e = "h-5 w-5",
  title: t = "Missed"
}) {
  return o.jsxs("svg", {
    viewBox: "0 0 24 24",
    className: e,
    "aria-hidden": !t,
    role: "img",
    children: [t ? o.jsx("title", {
      children: t
    }) : null, o.jsx("path", {
      fill: "currentColor",
      d: "M12 3.5 3.8 20h16.4L12 3.5zm0 5.2 4.4 8.8H7.6L12 8.7z"
    })]
  });
}
function no({
  className: e = "h-7 w-7",
  title: t = "Bunny"
}) {
  return o.jsxs("svg", {
    viewBox: "0 0 32 32",
    className: e,
    "aria-hidden": !t,
    role: "img",
    children: [t ? o.jsx("title", {
      children: t
    }) : null, o.jsx("path", {
      fill: "#f3d0d6",
      d: "M10 14c0-6 2-11 4-11s3 4 3 8c2-4 3-8 5-8s4 5 4 11c0 3-1 5-2 6-1 4-4 7-8 7s-7-3-8-7c-1-1-2-3-2-6z"
    }), o.jsx("circle", {
      cx: "13.2",
      cy: "17",
      r: "1",
      fill: "#3d2e36"
    }), o.jsx("circle", {
      cx: "18.8",
      cy: "17",
      r: "1",
      fill: "#3d2e36"
    }), o.jsx("path", {
      fill: "#d4788a",
      d: "M15 19.4c.6.7 1.4.7 2 0"
    }), o.jsx("ellipse", {
      cx: "16",
      cy: "21.4",
      rx: "1.2",
      ry: "0.8",
      fill: "#f4c4c8"
    })]
  });
}
function Lc({
  className: e = "h-7 w-7",
  title: t = "Kitten"
}) {
  return o.jsxs("svg", {
    viewBox: "0 0 32 32",
    className: e,
    "aria-hidden": !t,
    role: "img",
    children: [t ? o.jsx("title", {
      children: t
    }) : null, o.jsx("path", {
      fill: "#c4b0dc",
      d: "M8 13 12 8l3 5 3-5 4 5c1 2 1 6-1 9-2 4-6 6-9 6s-7-2-9-6c-2-3-2-7-1-9z"
    }), o.jsx("circle", {
      cx: "13",
      cy: "17",
      r: "1.1",
      fill: "#3d2e36"
    }), o.jsx("circle", {
      cx: "19",
      cy: "17",
      r: "1.1",
      fill: "#3d2e36"
    }), o.jsx("path", {
      fill: "#d4788a",
      d: "M16 19.2 14.6 21h2.8z"
    }), o.jsx("path", {
      fill: "none",
      stroke: "#8a7380",
      strokeWidth: "0.8",
      d: "M10 18c2 .8 3 .8 4 0M18 18c2 .8 3 .8 4 0"
    })]
  });
}
function Tc({
  className: e = "h-7 w-7",
  title: t = "Puppy"
}) {
  return o.jsxs("svg", {
    viewBox: "0 0 32 32",
    className: e,
    "aria-hidden": !t,
    role: "img",
    children: [t ? o.jsx("title", {
      children: t
    }) : null, o.jsx("ellipse", {
      cx: "16",
      cy: "18",
      rx: "8",
      ry: "7.2",
      fill: "#e8c4a8"
    }), o.jsx("ellipse", {
      cx: "8.5",
      cy: "14",
      rx: "3.2",
      ry: "2.6",
      fill: "#d4a07c"
    }), o.jsx("ellipse", {
      cx: "23.5",
      cy: "14",
      rx: "3.2",
      ry: "2.6",
      fill: "#d4a07c"
    }), o.jsx("circle", {
      cx: "13.2",
      cy: "17.2",
      r: "1",
      fill: "#3d2e36"
    }), o.jsx("circle", {
      cx: "18.8",
      cy: "17.2",
      r: "1",
      fill: "#3d2e36"
    }), o.jsx("ellipse", {
      cx: "16",
      cy: "20.4",
      rx: "1.4",
      ry: "1",
      fill: "#3d2e36"
    }), o.jsx("path", {
      fill: "#d4788a",
      d: "M16 21.2c1.2 1.4 3 .8 3.4 0",
      opacity: "0.7"
    })]
  });
}
function ro({
  className: e = "h-7 w-7",
  title: t = "Capybara"
}) {
  return o.jsxs("svg", {
    viewBox: "0 0 32 32",
    className: e,
    "aria-hidden": !t,
    role: "img",
    children: [t ? o.jsx("title", {
      children: t
    }) : null, o.jsx("ellipse", {
      cx: "16",
      cy: "18.5",
      rx: "9",
      ry: "6.5",
      fill: "#c9a86c"
    }), o.jsx("ellipse", {
      cx: "9",
      cy: "14.5",
      rx: "2.2",
      ry: "2",
      fill: "#b89258"
    }), o.jsx("ellipse", {
      cx: "23",
      cy: "14.5",
      rx: "2.2",
      ry: "2",
      fill: "#b89258"
    }), o.jsx("circle", {
      cx: "12.8",
      cy: "17.6",
      r: "0.9",
      fill: "#3d2e36"
    }), o.jsx("circle", {
      cx: "19.2",
      cy: "17.6",
      r: "0.9",
      fill: "#3d2e36"
    }), o.jsx("ellipse", {
      cx: "16",
      cy: "20.6",
      rx: "1.6",
      ry: "0.9",
      fill: "#3d2e36"
    })]
  });
}
function Rc({
  kind: e,
  className: t = "h-4 w-4"
}) {
  return e === "done" ? o.jsx(vp, {
    className: t,
    title: "Done"
  }) : e === "missed" ? o.jsx(mu, {
    className: t,
    title: "Missed"
  }) : e === "skipped" ? o.jsx(mu, {
    className: t,
    title: "Skipped"
  }) : e === "rest" ? o.jsx(yp, {
    className: t,
    title: "Rest"
  }) : o.jsx(gp, {
    className: t,
    title: "Gym"
  });
}
const xp = [{
  id: "today",
  label: "Home",
  mark: "01",
  Icon: no
}, {
  id: "learn",
  label: "Learn",
  mark: "02",
  Icon: Lc
}, {
  id: "program",
  label: "Program",
  mark: "03",
  Icon: Tc
}, {
  id: "log",
  label: "Log",
  mark: "04",
  Icon: ro
}];
function Navigation({
  active: e,
  onChange: t
}) {
  return o.jsx("nav", {
    className: "flex w-[100px] shrink-0 flex-col border-r border-rose-edge bg-graphite/70 py-4 backdrop-blur-md",
    children: xp.map(n => {
      const r = n.id === e,
        l = n.Icon;
      return o.jsxs("button", {
        type: "button",
        onClick: () => t(n.id),
        "aria-label": n.label,
        className: `mx-2 mb-2 min-h-[4.5rem] px-2 py-3 text-left transition ${r ? "border border-rose bg-rose-dim text-rose" : "border border-transparent text-mute hover:border-rose-edge hover:text-mist"}`,
        children: [o.jsx(l, {
          className: "h-7 w-7"
        }), o.jsx("div", {
          className: "mt-1 text-[11px] uppercase tracking-[0.16em]",
          children: n.label
        })]
      }, n.id);
    })
  });
}
const kp = [1, 3, 5],
  Sp = () => ({
    nextIndex: 0,
    pendingMakeups: []
  }),
  initialState = () => ({
    onboardingComplete: !1,
    profile: null,
    smtp: null,
    queue: Sp(),
    lifts: {},
    history: []
  });
function desktopBridge() {
  return typeof window < "u" && window.gym ? window.gym : null;
}
async function loadState() {
  const e = desktopBridge();
  return e ? e.getState() : initialState();
}
function TitleBar() {
  const e = desktopBridge();
  return o.jsxs("header", {
    className: "drag-bar flex h-10 shrink-0 items-center justify-between border-b border-rose-edge bg-graphite/80 px-3 backdrop-blur-md",
    children: [o.jsxs("div", {
      className: "flex items-center gap-3",
      children: [o.jsx("span", {
        className: "h-2 w-2 rounded-full bg-rose shadow-[0_0_10px_#d4788a]"
      }), o.jsx("span", {
        className: "font-mono text-[11px] uppercase tracking-[0.28em] text-mist",
        children: "Worlds Simplest Gym"
      })]
    }), o.jsxs("div", {
      className: "no-drag flex items-center",
      children: [o.jsx("button", {
        type: "button",
        className: "grid h-10 w-11 place-items-center text-mute hover:bg-blush/70 hover:text-mist",
        onClick: () => e == null ? void 0 : e.minimize(),
        "aria-label": "Minimize",
        children: o.jsx("span", {
          className: "block h-px w-3 bg-current"
        })
      }), o.jsx("button", {
        type: "button",
        className: "grid h-10 w-11 place-items-center text-mute hover:bg-blush/70 hover:text-mist",
        onClick: () => e == null ? void 0 : e.maximize(),
        "aria-label": "Maximize",
        children: o.jsx("span", {
          className: "block h-2.5 w-2.5 border border-current"
        })
      }), o.jsx("button", {
        type: "button",
        className: "grid h-10 w-11 place-items-center text-mute hover:bg-berry/20 hover:text-berry",
        onClick: () => e == null ? void 0 : e.close(),
        "aria-label": "Close",
        children: o.jsx("span", {
          className: "text-sm leading-none",
          children: "×"
        })
      })]
    })]
  });
}
function Panel({
  children: e,
  className: t = ""
}) {
  return o.jsx("div", {
    className: `corner-frame border border-rose-edge bg-graphite/75 shadow-glass backdrop-blur-md ${t}`,
    children: e
  });
}
function ge({
  children: e
}) {
  return o.jsx("div", {
    className: "font-mono text-[10px] uppercase tracking-[0.32em] text-rose",
    children: e
  });
}
const wl = {
    couple: {
      id: "couple",
      name: "Major + minor couples",
      short: "Three days: chest+tris, legs+bis, back+shoulders.",
      benefits: ["Each hour trains one big group and one small group — you are not frying two majors.", "Legs already have their own day, with hip thrust and a core finisher baked in.", "Simple cycle you can keep in your head: push, legs, pull."]
    },
    ull: {
      id: "ull",
      name: "Upper / Lower / Legs",
      short: "Three days: upper, lower, then a second legs day.",
      benefits: ["More weekly leg and glute work — two lower-body days per cycle.", "Upper body gets extra recovery between presses.", "Matches a legs / glutes / belly focus without inventing a fourth “abs day”."]
    }
  };
function Ep(e, t) {
  return gr(e).find(n => n.id === t);
}
const _p = [{
  id: 1,
  label: "Mon"
}, {
  id: 2,
  label: "Tue"
}, {
  id: 3,
  label: "Wed"
}, {
  id: 4,
  label: "Thu"
}, {
  id: 5,
  label: "Fri"
}, {
  id: 6,
  label: "Sat"
}, {
  id: 0,
  label: "Sun"
}];
function OnboardingScreen({
  onDone: e
}) {
  const [t, n] = D.useState(0),
    [r, l] = D.useState(""),
    [s, i] = D.useState(165),
    [u, a] = D.useState(60),
    [f, y] = D.useState("couple"),
    [g, h] = D.useState(kp),
    [w, S] = D.useState("");
  function j(d) {
    h(c => c.includes(d) ? c.filter(p => p !== d) : [...c, d].sort((p, m) => p - m));
  }
  async function O() {
    if (S(""), !r.trim()) {
      S("A name is required."), n(0);
      return;
    }
    if (!g.length) {
      S("Pick at least one gym day."), n(3);
      return;
    }
    const d = desktopBridge();
    if (!d) {
      S("Could not connect to local storage. Reopen the app.");
      return;
    }
    try {
    const c = await d.completeOnboarding({
      profile: {
        name: r.trim(),
        email: "",
        heightCm: s,
        weightKg: u,
        program: f,
        gymDays: g
      },
      smtp: null
    });
    e(c);
    } catch (error) { S(error.message); }
  }
  return o.jsx("div", {
    className: "grid-veil flex h-full items-center justify-center p-8",
    children: o.jsxs(Panel, {
      className: "w-full max-w-2xl p-8",
      children: [o.jsxs("div", {
        className: "flex items-center gap-3",
        children: [o.jsx(no, {
          className: "h-10 w-10"
        }), o.jsxs(ge, {
          children: ["First launch · 0", t + 1, " / 04"]
        })]
      }), o.jsx("h1", {
        className: "mt-3 text-3xl tracking-[0.06em] text-mist",
        children: "Make it yours"
      }), o.jsx("p", {
        className: "mt-2 max-w-lg text-sm text-mute",
        children: "Local only. Everything stays on this PC. Email is optional later in Settings."
      }), t === 0 && o.jsx("div", {
        className: "mt-8 grid gap-4",
        children: o.jsx(zp, {
          label: "Name",
          value: r,
          onChange: l,
          placeholder: "Your name"
        })
      }), t === 1 && o.jsxs("div", {
        className: "mt-8 grid grid-cols-2 gap-4",
        children: [o.jsx(gu, {
          label: "Height (cm)",
          value: s,
          onChange: i
        }), o.jsx(gu, {
          label: "Weight (kg)",
          value: u,
          onChange: a
        }), o.jsx("p", {
          className: "col-span-2 text-sm text-mute",
          children: "First-time machine weights are conservative guesses from bodyweight. You overwrite them the first session."
        })]
      }), t === 2 && o.jsx("div", {
        className: "mt-8 grid gap-3",
        children: Object.keys(wl).map(d => {
          const c = wl[d],
            p = f === d;
          return o.jsxs("button", {
            type: "button",
            onClick: () => y(d),
            className: `border p-4 text-left ${p ? "border-rose bg-rose-dim" : "border-rose-edge hover:border-rose"}`,
            children: [o.jsxs("div", {
              className: "font-mono text-[10px] uppercase tracking-[0.22em] text-rose",
              children: ["Program ", d === "couple" ? "A" : "B"]
            }), o.jsx("div", {
              className: "mt-1 text-lg text-mist",
              children: c.name
            }), o.jsx("div", {
              className: "mt-1 text-sm text-mute",
              children: c.short
            })]
          }, d);
        })
      }), t === 3 && o.jsxs("div", {
        className: "mt-8",
        children: [o.jsx("p", {
          className: "text-sm text-mute",
          children: "Default is Mon / Wed / Fri. Change anytime."
        }), o.jsx("div", {
          className: "mt-4 flex flex-wrap gap-2",
          children: _p.map(d => {
            const c = g.includes(d.id);
            return o.jsx("button", {
              type: "button",
              onClick: () => j(d.id),
              className: `w-14 py-2 font-mono text-xs uppercase ${c ? "border border-rose bg-rose-dim text-rose" : "border border-rose-edge text-mute"}`,
              children: d.label
            }, d.id);
          })
        })]
      }), w ? o.jsx("p", {
        className: "mt-4 text-sm text-berry",
        children: w
      }) : null, o.jsxs("div", {
        className: "mt-8 flex justify-between",
        children: [o.jsx("button", {
          type: "button",
          disabled: t === 0,
          onClick: () => n(d => d - 1),
          className: "font-mono text-xs uppercase tracking-[0.2em] text-mute disabled:opacity-30",
          children: "Back"
        }), t < 3 ? o.jsx("button", {
          type: "button",
          onClick: () => n(d => d + 1),
          className: "min-h-12 border border-rose px-5 text-sm text-rose hover:bg-rose-dim",
          children: "Next"
        }) : o.jsx("button", {
          type: "button",
          onClick: () => void O(),
          className: "min-h-12 border border-rose bg-rose-dim px-5 text-sm text-rose",
          children: "Open the calendar"
        })]
      })]
    })
  });
}
function zp({
  label: e,
  value: t,
  onChange: n,
  placeholder: r
}) {
  return o.jsxs("label", {
    className: "grid gap-1",
    children: [o.jsx("span", {
      className: "font-mono text-[10px] uppercase tracking-[0.22em] text-mute",
      children: e
    }), o.jsx("input", {
      type: "text",
      value: t,
      placeholder: r,
      onChange: l => n(l.target.value),
      className: "border border-rose-edge bg-void px-3 py-2 text-mist outline-none focus:border-rose"
    })]
  });
}
function gu({
  label: e,
  value: t,
  onChange: n
}) {
  return o.jsxs("label", {
    className: "grid gap-1",
    children: [o.jsx("span", {
      className: "font-mono text-[10px] uppercase tracking-[0.22em] text-mute",
      children: e
    }), o.jsx("input", {
      type: "number",
      value: t,
      onChange: r => n(Number(r.target.value)),
      className: "border border-rose-edge bg-void px-3 py-2 text-mist outline-none focus:border-rose"
    })]
  });
}
const kl = [{
    id: "chest",
    name: "Chest",
    group: "major",
    pairings: ["Chest + Triceps", "Upper"],
    blurb: "A big pushing muscle. Pair it with triceps so both get work without stacking two huge groups."
  }, {
    id: "back",
    name: "Back",
    group: "major",
    pairings: ["Back + Shoulders", "Upper"],
    blurb: "Lats and mid-back are a major pull. They eat recovery — do not pair them with another giant day."
  }, {
    id: "shoulders",
    name: "Shoulders",
    group: "major",
    pairings: ["Back + Shoulders", "Upper"],
    blurb: "Delts count as major. Press and raise them after a back pull, not after a heavy chest day."
  }, {
    id: "quads",
    name: "Quads",
    group: "major",
    pairings: ["Legs + Biceps", "Lower", "Legs"],
    blurb: "Front of the thigh. A major mover on every squat / press pattern."
  }, {
    id: "hamstrings",
    name: "Hamstrings",
    group: "major",
    pairings: ["Legs + Biceps", "Lower", "Legs"],
    blurb: "Back of the thigh. Hinge or curl them so the legs day is not only quads."
  }, {
    id: "glutes",
    name: "Glutes",
    group: "major",
    pairings: ["Legs + Biceps", "Lower", "Legs"],
    blurb: "Your focus muscle. Hip thrust, bridge, or abduction shows up on every lower / legs day."
  }, {
    id: "triceps",
    name: "Triceps",
    group: "minor",
    pairings: ["Chest + Triceps", "Upper"],
    blurb: "A small arm muscle that already helps on chest presses. Finish it after the big push."
  }, {
    id: "biceps",
    name: "Biceps",
    group: "minor",
    pairings: ["Legs + Biceps", "Upper"],
    blurb: "A small pull muscle. On the couple plan it rides with legs so arms still get a turn."
  }, {
    id: "core",
    name: "Core / abs",
    group: "minor",
    pairings: ["Every session"],
    blurb: "A short finisher, not a fourth “abs day”. Cable crunch or a machine crunch at the end."
  }, {
    id: "calves",
    name: "Calves",
    group: "minor",
    pairings: ["Lower", "Legs"],
    blurb: "A small lower-leg muscle. They get indirect work on press days; no extra calf circus."
  }],
  Mp = [{
    id: "shoulders",
    d: "M210 118c-18 8-28 28-26 48 18-6 34-16 42-30 4-12-4-20-16-18z M450 118c18 8 28 28 26 48-18-6-34-16-42-30-4-12 4-20 16-18z"
  }, {
    id: "chest",
    d: "M270 150c30-16 90-16 120 0 16 20 14 48-6 62-28 8-70 8-100 0-22-14-26-42-14-62z"
  }, {
    id: "biceps",
    d: "M198 188c-10 22-8 48 2 68 12 4 20-2 20-12-2-20 0-40 6-56-8-4-20-4-28 0z M462 188c10 22 8 48-2 68-12 4-20-2-20-12 2-20 0-40-6-56 8-4 20-4 28 0z"
  }, {
    id: "core",
    d: "M292 228c24-6 52-6 76 0 10 28 8 70-4 102-10 8-28 12-34 12s-24-4-34-12c-12-32-14-74-4-102z"
  }, {
    id: "quads",
    d: "M268 368c16 6 30 10 42 10 4 42 2 90-6 128-14 8-28 8-40 0 2-44 2-90 4-138z M390 368c-16 6-30 10-42 10-4 42-2 90 6 128 14 8 28 8 40 0-2-44-2-90-4-138z"
  }, {
    id: "calves",
    d: "M276 548c10 8 18 12 24 12 2 28 0 52-4 72-12 4-22 2-30-4 2-26 6-52 10-80z M384 548c-10 8-18 12-24 12-2 28 0 52 4 72 12 4 22 2 30-4-2-26-6-52-10-80z"
  }],
  Lp = [{
    id: "shoulders",
    d: "M118 120c-14 10-20 30-16 48 16-4 28-14 34-26 2-12-6-20-18-22z M310 120c14 10 20 30 16 48-16-4-28-14-34-26-2-12 6-20 18-22z"
  }, {
    id: "back",
    d: "M150 128h128c10 36 12 80 6 120-4 16-20 24-70 24s-66-8-70-24c-6-40-4-84 6-120z"
  }, {
    id: "triceps",
    d: "M108 176c-6 24-4 50 4 70 10 4 18-2 18-10 0-22-2-44 2-60-6-2-16-2-24 0z M320 176c6 24 4 50-4 70-10 4-18-2-18-10 0-22 2-44-2-60 6-2 16-2 24 0z"
  }, {
    id: "glutes",
    d: "M158 292c18 10 32 16 56 16s38-6 56-16c6 20-4 40-20 50-12 8-24 10-36 10s-24-2-36-10c-16-10-26-30-20-50z"
  }, {
    id: "hamstrings",
    d: "M164 348c14 8 26 12 40 12 2 40 0 84-8 122-12 8-24 8-36 2 0-44 2-90 4-136z M264 348c-14 8-26 12-40 12-2 40 0 84 8 122 12 8 24 8 36 2 0-44-2-90-4-136z"
  }, {
    id: "calves",
    d: "M168 530c8 8 16 12 22 12 2 28 0 54-4 74-12 4-22 0-28-8 2-26 6-50 10-78z M260 530c-8 8-16 12-22 12-2 28 0 54 4 74 12 4 22 0 28-8-2-26-6-50-10-78z"
  }],
  Tp = e => `cursor-pointer transition duration-200 ${e ? "fill-rose/40 stroke-rose stroke-2" : "fill-rose/0 stroke-rose/0 hover:fill-rose/22 hover:stroke-rose/70"}`;
function AnatomyDiagram({
  selected: e,
  onSelect: t,
  view: n
}) {
  const r = n === "front" ? Mp : Lp,
    l = n === "front" ? "./anatomy/muscles-anterior.png" : "./anatomy/muscles-posterior.png",
    s = n === "front" ? "0 0 659 751" : "0 0 427 759",
    i = n === "front" ? ["chest", "shoulders", "biceps", "core", "quads", "calves"] : ["back", "shoulders", "triceps", "glutes", "hamstrings", "calves"];
  return o.jsxs("div", {
    className: "flex h-full min-h-0 flex-col",
    children: [o.jsxs("div", {
      className: "relative mx-auto h-full w-fit max-w-full",
      children: [o.jsx("img", {
        src: l,
        alt: n === "front" ? "Anterior muscular system" : "Posterior muscular system",
        className: "h-full w-auto max-w-full object-contain"
      }), o.jsx("svg", {
        viewBox: s,
        className: "absolute inset-0 h-full w-full",
        preserveAspectRatio: "xMidYMid meet",
        children: r.map(u => {
          var a;
          return o.jsx("path", {
            d: u.d,
            className: Tp(e === u.id),
            onClick: () => t(u.id),
            children: o.jsx("title", {
              children: ((a = kl.find(f => f.id === u.id)) == null ? void 0 : a.name) ?? u.id
            })
          }, u.id);
        })
      })]
    }), o.jsx("div", {
      className: "mt-3 flex flex-wrap justify-center gap-2",
      children: i.map(u => {
        const a = kl.find(y => y.id === u),
          f = e === u;
        return o.jsx("button", {
          type: "button",
          onClick: () => t(u),
          className: `min-h-10 rounded-full px-3 py-2 text-sm ${f ? "bg-rose text-white" : "border border-rose-edge bg-graphite/80 text-mist hover:border-rose"}`,
          children: (a == null ? void 0 : a.name) ?? u
        }, u);
      })
    })]
  });
}
function LearnScreen() {
  const [e, t] = D.useState("front"),
    [n, r] = D.useState("glutes"),
    l = kl.find(s => s.id === n) ?? kl[0];
  return o.jsxs("div", {
    className: "grid h-full grid-cols-[1fr_320px] gap-5 overflow-hidden p-5",
    children: [o.jsxs(Panel, {
      className: "grid min-h-0 grid-rows-[auto_1fr_auto] overflow-hidden p-5",
      children: [o.jsxs("div", {
        className: "flex items-center justify-between gap-3",
        children: [o.jsxs("div", {
          children: [o.jsx(ge, {
            children: "Anatomy · pairing"
          }), o.jsx("h1", {
            className: "mt-2 text-2xl tracking-[0.04em] text-mist",
            children: "Learn the map"
          })]
        }), o.jsx("div", {
          className: "flex gap-2",
          children: ["front", "back"].map(s => o.jsx("button", {
            type: "button",
            onClick: () => t(s),
            className: `min-h-11 min-w-[5.5rem] px-3 text-sm capitalize ${e === s ? "bg-rose text-white" : "border border-rose-edge text-mute"}`,
            children: s
          }, s))
        })]
      }), o.jsx("div", {
        className: "mt-3 min-h-0",
        children: o.jsx(AnatomyDiagram, {
          selected: n,
          onSelect: r,
          view: e
        })
      }), o.jsxs("p", {
        className: "mt-2 text-xs leading-relaxed text-mute",
        children: ["Muscle plates: OpenStax ", o.jsx("em", {
          children: "Anatomy and Physiology"
        }), ", CC BY 4.0. See public/anatomy/CREDITS.md."]
      })]
    }), o.jsxs("div", {
      className: "flex flex-col gap-4 overflow-auto scrollbar-thin",
      children: [o.jsxs(Panel, {
        className: "p-5",
        children: [o.jsxs("div", {
          className: "flex items-start justify-between gap-2",
          children: [o.jsx(ge, {
            children: l.group === "major" ? "Major" : "Minor"
          }), o.jsx(Lc, {
            className: "h-8 w-8"
          })]
        }), o.jsx("h2", {
          className: "mt-2 text-2xl tracking-[0.04em] text-mist",
          children: l.name
        }), o.jsx("p", {
          className: "mt-3 text-base leading-relaxed text-mute",
          children: l.blurb
        }), o.jsx("div", {
          className: "mt-4 text-sm uppercase tracking-[0.16em] text-rose",
          children: "Lives in"
        }), o.jsx("ul", {
          className: "mt-2 space-y-1 text-base text-mist",
          children: l.pairings.map(s => o.jsxs("li", {
            children: ["› ", s]
          }, s))
        })]
      }), o.jsxs(Panel, {
        className: "p-5 text-base leading-relaxed text-mute",
        children: [o.jsx(ge, {
          children: "Rule"
        }), o.jsxs("p", {
          className: "mt-3",
          children: ["Each couple workout trains ", o.jsx("span", {
            className: "text-mist",
            children: "one major + one minor"
          }), ". That way you are not frying two big groups or skipping arms. Core is a short finisher on every session — never a fourth abs day."]
        })]
      })]
    })]
  });
}
function Ip(e) {
  return Ic.find(t => t.id === e);
}
function Ft(e) {
  return new Date(e.getFullYear(), e.getMonth(), e.getDate());
}
function yu(e, t) {
  return t.includes(e.getDay());
}
function Op(e, t, n) {
  const r = e.length ? e : [1, 3, 5],
    l = [],
    s = Ft(t);
  let i = 0;
  for (; l.length < n && i < 400;) r.includes(s.getDay()) && l.push(new Date(s)), s.setDate(s.getDate() + 1), i += 1;
  return l;
}
function sessionAtIndex(e, t) {
  const n = gr(e);
  return n[(t % n.length + n.length) % n.length];
}
function planSessions(e, t, n, r, l, history = []) {
  return Op(n, r, l + history.length).filter(date => !history.some(entry => entry.date === dateStamp(date))).slice(0, l).map((i, u) => ({
    date: i,
    index: t + u,
    session: sessionAtIndex(e, t + u)
  }));
}
function workoutItems(e, t, n) {
  const r = n.filter(s => s.sessionId === e.id),
    l = [];
  for (const s of r) l.includes(s.exerciseId) || l.push(s.exerciseId);
  for (const s of e.exerciseIds) l.includes(s) || l.push(s);
  return l.flatMap(s => {
    const i = Ip(s);
    if (!i) return [];
    const u = t[s],
      a = r.find(f => f.exerciseId === s);
    return [{
      exerciseId: s,
      name: i.name,
      machine: i.machine,
      image: i.image,
      muscles: i.muscles,
      sets: i.defaultSets,
      minReps: i.minReps,
      maxReps: i.maxReps,
      workingKg: (a == null ? void 0 : a.workingKg) ?? (u == null ? void 0 : u.workingKg) ?? 0,
      estimated: a ? !1 : !!(u != null && u.estimated),
      replay: !!a
    }];
  });
}
function formatDate(e) {
  return e.toLocaleDateString(void 0, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}
function dateStamp(e) {
  const t = e.getFullYear(),
    n = String(e.getMonth() + 1).padStart(2, "0"),
    r = String(e.getDate()).padStart(2, "0");
  return `${t}-${n}-${r}`;
}
const $p = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function ds(e, t) {
  return dateStamp(e) === dateStamp(t);
}
function fs(e, t) {
  return Ft(e).getTime() < Ft(t).getTime();
}
function cyclePosition(e, t) {
  const r = gr(e).length || 1,
    l = Math.max(t, 0),
    s = l % r + 1,
    i = Math.floor(l / r) + 1,
    u = sessionAtIndex(e, l).name;
  return {
    week: i,
    day: s,
    of: r,
    name: u,
    label: `Week ${i} · Day ${s} of ${r} — ${u}`
  };
}
function monthCells(e, t) {
  const n = new Date(e, t, 1),
    r = Ft(n);
  r.setDate(1 - n.getDay());
  const l = [];
  for (let s = 0; s < 42; s += 1) {
    const i = new Date(r);
    i.setDate(r.getDate() + s), l.push({
      date: i,
      inMonth: i.getMonth() === t
    });
  }
  return l;
}
function ProgramScreen({
  state: e,
  onState: t
}) {
  const n = e.profile;
  if (!n) return null;
  const r = planSessions(n.program, e.queue.nextIndex, n.gymDays, new Date(), 6, e.history);
  async function l(s) {
    if (s === (n == null ? void 0 : n.program)) return;
    const i = desktopBridge();
    i && t(await i.setProgram(s));
  }
  return o.jsxs("div", {
    className: "scrollbar-thin h-full overflow-auto p-6",
    children: [o.jsxs("div", {
      className: "flex items-center gap-3",
      children: [o.jsx(Tc, {
        className: "h-9 w-9"
      }), o.jsx(ge, {
        children: "Cycle"
      })]
    }), o.jsx("h1", {
      className: "mt-2 text-3xl tracking-[0.06em] text-mist",
      children: "Program"
    }), o.jsx("p", {
      className: "mt-2 max-w-2xl text-sm text-mute",
      children: "Switching A ↔ B resets the upcoming queue only. Lift history and working weights stay."
    }), o.jsx("div", {
      className: "mt-6 grid grid-cols-2 gap-4",
      children: Object.keys(wl).map(s => {
        const i = wl[s],
          u = n.program === s;
        return o.jsxs("button", {
          type: "button",
          onClick: () => void l(s),
          className: `border p-5 text-left ${u ? "border-rose bg-rose-dim" : "border-rose-edge hover:border-rose"}`,
          children: [o.jsx("div", {
            className: "font-mono text-[10px] uppercase tracking-[0.22em] text-rose",
            children: s === "couple" ? "A · Couples" : "B · U / L / L"
          }), o.jsx("div", {
            className: "mt-2 text-xl text-mist",
            children: i.name
          }), o.jsx("p", {
            className: "mt-2 text-sm text-mute",
            children: i.short
          }), o.jsx("ul", {
            className: "mt-4 space-y-2 text-sm text-mute",
            children: i.benefits.map(a => o.jsxs("li", {
              children: ["› ", a]
            }, a))
          })]
        }, s);
      })
    }), o.jsxs("div", {
      className: "mt-8 grid grid-cols-[1fr_1fr] gap-4",
      children: [o.jsxs(Panel, {
        className: "p-5",
        children: [o.jsx(ge, {
          children: "This cycle"
        }), o.jsx("ul", {
          className: "mt-4 space-y-3",
          children: gr(n.program).map(s => o.jsxs("li", {
            children: [o.jsx("div", {
              className: "text-mist",
              children: s.name
            }), o.jsx("div", {
              className: "text-sm text-mute",
              children: s.tagline
            })]
          }, s.id))
        })]
      }), o.jsxs(Panel, {
        className: "p-5",
        children: [o.jsx(ge, {
          children: "Upcoming two weeks"
        }), o.jsx("ul", {
          className: "mt-4 space-y-3",
          children: r.map(s => o.jsxs("li", {
            className: "flex justify-between gap-3",
            children: [o.jsx("span", {
              className: "text-mute",
              children: formatDate(s.date)
            }), o.jsx("span", {
              className: "text-mist",
              children: s.session.name
            })]
          }, `${s.index}-${s.date.toISOString()}`))
        })]
      })]
    })]
  });
}
function SettingsScreen({
  state: e,
  onState: t
}) {
  var c, p;
  const [n, r] = D.useState(((c = e.smtp) == null ? void 0 : c.user) ?? ""),
    [l, s] = D.useState(((p = e.smtp) == null ? void 0 : p.appPassword) ?? ""),
    [i, u] = D.useState(""),
    [a, f] = D.useState(!1),
    [y, g] = D.useState(!1);
  if (!e.profile) return null;
  const h = e.profile;
  async function w(m, x) {
    const N = desktopBridge();
    N && t(await N.updateProfile({
      [m]: x
    }));
  }
  async function S() {
    if (!!n.trim() !== !!l.trim()) throw new Error("Enter both Gmail and the app password, or clear both to disable email.");
    const m = desktopBridge();
    m && (t(await m.setSmtp(n.trim() && l.trim() ? {
      user: n.trim(),
      appPassword: l.trim()
    } : null)), u("Saved on this PC only."));
  }
  async function j() {
    const m = desktopBridge();
    if (!m) return;
    g(!0);
    try {
      await S();
      const x = await m.sendTestEmail();
      u(x.ok ? "Test email sent." : x.error ?? "Send failed.");
    } catch (error) { u(error.message); } finally { g(false); }
  }
  async function O(m, x) {
    const N = desktopBridge();
    N && t(await N.updateLift(m, x));
  }
  function d(m) {
    const x = h.gymDays.includes(m) ? h.gymDays.filter(N => N !== m) : [...h.gymDays, m].sort((N, _) => N - _);
    x.length && w("gymDays", x);
  }
  return o.jsxs("div", {
    className: "scrollbar-thin h-full overflow-auto p-6",
    children: [o.jsx(ge, {
      children: "Log · Settings"
    }), o.jsx("h1", {
      className: "mt-2 text-3xl tracking-[0.08em] text-mist",
      children: "Weights & room"
    }), o.jsxs("div", {
      className: "mt-6 grid grid-cols-2 gap-4",
      children: [o.jsxs(Panel, {
        className: "p-5",
        children: [o.jsx(ge, {
          children: "Profile"
        }), o.jsxs("div", {
          className: "mt-4 grid gap-3",
          children: [o.jsx(TextField, {
            label: "Name",
            value: h.name,
            onChange: m => w("name", m)
          }), o.jsxs("div", {
            className: "grid grid-cols-2 gap-3",
            children: [o.jsx(NumberField, {
              label: "Height cm",
              value: h.heightCm,
              onChange: m => w("heightCm", m)
            }), o.jsx(NumberField, {
              label: "Weight kg",
              value: h.weightKg,
              onChange: m => w("weightKg", m)
            })]
          }), o.jsxs("div", {
            children: [o.jsx("div", {
              className: "font-mono text-[10px] uppercase tracking-[0.22em] text-mute",
              children: "Gym days"
            }), o.jsx("div", {
              className: "mt-2 flex flex-wrap gap-1",
              children: $p.map((m, x) => {
                const N = h.gymDays.includes(x);
                return o.jsx("button", {
                  type: "button",
                  onClick: () => d(x),
                  className: `w-10 py-1 font-mono text-[10px] ${N ? "border border-rose text-rose" : "border border-rose-edge text-mute"}`,
                  children: m
                }, m);
              })
            })]
          })]
        })]
      }), o.jsxs(Panel, {
        className: "p-5",
        children: [o.jsx(ge, {
          children: "Working notes"
        }), o.jsx("p", {
          className: "mt-3 text-sm leading-relaxed text-mute",
          children: "Guesses stay marked until you edit a weight. Hit 12 on every set to add 2.5 kg. Missed gym days do not reset the queue — the next unfinished session waits for the next gym day."
        })]
      })]
    }), o.jsxs(Panel, {
      className: "mt-4 p-5",
      children: [o.jsx(ge, {
        children: "Working weights"
      }), o.jsx("p", {
        className: "mt-2 text-sm text-mute",
        children: "Double progression adds 2.5 kg after 12/12/12."
      }), o.jsx("div", {
        className: "mt-4 grid gap-2",
        children: Ic.map(m => {
          const x = e.lifts[m.id];
          return o.jsxs("div", {
            className: "grid grid-cols-[1fr_88px_auto] items-center gap-3 border border-rose-edge/60 px-3 py-2",
            children: [o.jsxs("div", {
              children: [o.jsx("div", {
                className: "text-sm text-mist",
                children: m.name
              }), o.jsxs("div", {
                className: "font-mono text-[10px] text-mute",
                children: [x != null && x.estimated ? "guess" : "set", " · last ", (x == null ? void 0 : x.lastDate) ?? "—"]
              })]
            }), o.jsx(EditableInput, {
              type: "number",
              step: 2.5,
              min: 0,
              value: (x == null ? void 0 : x.workingKg) ?? 0,
              onCommit: value => O(m.id, value),
              className: "border border-rose-edge bg-void px-2 py-1 font-mono text-sm text-mist outline-none focus:border-rose"
            }), o.jsx("span", {
              className: "font-mono text-[10px] text-mute",
              children: "kg"
            })]
          }, m.id);
        })
      })]
    }), o.jsxs(Panel, {
      className: "mt-4 p-5",
      children: [o.jsx(ge, {
        children: "History"
      }), o.jsx("ul", {
        className: "mt-4 space-y-2",
        children: e.history.length === 0 ? o.jsxs("li", {
          className: "flex items-center gap-3 text-sm text-mute",
          children: [o.jsx(ro, {}), "No sessions yet. Your calendar is waiting."]
        }) : e.history.slice(0, 16).map((m, x) => o.jsxs("li", {
          className: "flex justify-between text-sm",
          children: [o.jsx("span", {
            className: "text-mute",
            children: m.date
          }), o.jsxs("span", {
            className: "text-mist",
            children: [m.sessionName, " · ", m.done ? "done" : "skipped", m.skippedExerciseIds.length ? ` · ${m.skippedExerciseIds.length} lifts skipped` : ""]
          })]
        }, `${m.date}-${m.sessionId}-${x}`))
      })]
    }), o.jsxs("details", {
      className: "mt-4 border border-rose-edge/50 bg-graphite/40 px-5 py-4",
      open: a,
      onToggle: m => f(m.target.open),
      children: [o.jsx("summary", {
        className: "cursor-pointer font-mono text-[10px] uppercase tracking-[0.22em] text-mute",
        children: "Optional email"
      }), o.jsx("p", {
        className: "mt-3 text-sm text-mute",
        children: "Only if you want a workout sent to yourself. Not required to use the calendar."
      }), o.jsxs("div", {
        className: "mt-4 grid gap-3",
        children: [o.jsx(TextField, {
          label: "Inbox",
          value: h.email,
          onChange: m => w("email", m)
        }), o.jsx(TextField, {
          label: "Gmail",
          value: n,
          onChange: r
        }), o.jsx(TextField, {
          label: "App password",
          value: l,
          onChange: s,
          password: !0
        }), o.jsxs("div", {
          className: "flex gap-2",
          children: [o.jsx("button", {
            type: "button",
            onClick: () => void S(),
            className: "border border-rose-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mute hover:text-rose",
            children: "Save"
          }), o.jsx("button", {
            type: "button",
            disabled: y,
            onClick: () => void j(),
            className: "border border-rose-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mute hover:text-rose disabled:opacity-40",
            children: "Send test"
          })]
        }), i ? o.jsx("p", {
          className: "font-mono text-xs text-rose",
          children: i
        }) : null]
      })]
    })]
  });
}
function TextField({
  label: e,
  value: t,
  onChange: n,
  password: r
}) {
  return o.jsxs("label", {
    className: "grid gap-1",
    children: [o.jsx("span", {
      className: "font-mono text-[10px] uppercase tracking-[0.22em] text-mute",
      children: e
    }), o.jsx(EditableInput, {
      type: r ? "password" : "text",
      value: t,
      onCommit: n,
      className: "border border-rose-edge bg-void px-3 py-2 text-mist outline-none focus:border-rose"
    })]
  });
}
function NumberField({
  label: e,
  value: t,
  onChange: n
}) {
  return o.jsxs("label", {
    className: "grid gap-1",
    children: [o.jsx("span", {
      className: "font-mono text-[10px] uppercase tracking-[0.22em] text-mute",
      children: e
    }), o.jsx(EditableInput, {
      type: "number",
      value: t,
      onCommit: n,
      className: "border border-rose-edge bg-void px-3 py-2 text-mist outline-none focus:border-rose"
    })]
  });
}
const Xe = "#3d2e36",
  X = "#d4788a",
  ie = "#c4b0dc",
  $c = "#fff8f5",
  me = "#c4a46a";
function ee({
  children: e
}) {
  return o.jsxs("svg", {
    viewBox: "0 0 96 72",
    className: "h-full w-full",
    "aria-hidden": !0,
    children: [o.jsx("rect", {
      width: "96",
      height: "72",
      rx: "10",
      fill: $c
    }), o.jsx("rect", {
      x: "1.5",
      y: "1.5",
      width: "93",
      height: "69",
      rx: "9",
      fill: "none",
      stroke: X,
      strokeOpacity: "0.35"
    }), e]
  });
}
function MachineIllustration({
  id: e
}) {
  switch (e) {
    case "chest-press":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "18",
          y: "46",
          width: "60",
          height: "8",
          rx: "2",
          fill: ie
        }), o.jsx("path", {
          d: "M28 46V24h40v22",
          fill: "none",
          stroke: X,
          strokeWidth: "2.4"
        }), o.jsx("rect", {
          x: "36",
          y: "28",
          width: "24",
          height: "12",
          rx: "3",
          fill: me,
          opacity: "0.85"
        }), o.jsx("circle", {
          cx: "30",
          cy: "34",
          r: "5",
          fill: "none",
          stroke: Xe,
          strokeWidth: "1.4"
        }), o.jsx("circle", {
          cx: "66",
          cy: "34",
          r: "5",
          fill: "none",
          stroke: Xe,
          strokeWidth: "1.4"
        })]
      });
    case "pec-deck":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "40",
          y: "16",
          width: "16",
          height: "36",
          rx: "4",
          fill: ie
        }), o.jsx("path", {
          d: "M24 24c8 8 8 20 0 28",
          fill: "none",
          stroke: X,
          strokeWidth: "4"
        }), o.jsx("path", {
          d: "M72 24c-8 8-8 20 0 28",
          fill: "none",
          stroke: X,
          strokeWidth: "4"
        })]
      });
    case "tricep-pushdown":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "20",
          y: "12",
          width: "56",
          height: "6",
          rx: "2",
          fill: ie
        }), o.jsx("path", {
          d: "M48 18v28",
          stroke: Xe,
          strokeWidth: "2"
        }), o.jsx("rect", {
          x: "40",
          y: "44",
          width: "16",
          height: "5",
          rx: "1.5",
          fill: X
        }), o.jsx("path", {
          d: "M36 52h24",
          stroke: me,
          strokeWidth: "3",
          strokeLinecap: "round"
        })]
      });
    case "overhead-extension":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "22",
          y: "14",
          width: "52",
          height: "6",
          rx: "2",
          fill: ie
        }), o.jsx("path", {
          d: "M48 20v18",
          stroke: Xe,
          strokeWidth: "2"
        }), o.jsx("path", {
          d: "M36 22c0 10 24 10 24 0",
          fill: "none",
          stroke: X,
          strokeWidth: "3"
        }), o.jsx("circle", {
          cx: "48",
          cy: "44",
          r: "7",
          fill: me
        })]
      });
    case "leg-press":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "14",
          y: "40",
          width: "44",
          height: "10",
          rx: "3",
          fill: ie
        }), o.jsx("rect", {
          x: "50",
          y: "18",
          width: "28",
          height: "22",
          rx: "3",
          fill: X
        }), o.jsx("path", {
          d: "M56 40 44 50",
          stroke: Xe,
          strokeWidth: "2"
        })]
      });
    case "hip-thrust":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "16",
          y: "38",
          width: "64",
          height: "8",
          rx: "3",
          fill: ie
        }), o.jsx("rect", {
          x: "28",
          y: "24",
          width: "40",
          height: "10",
          rx: "5",
          fill: X
        }), o.jsx("circle", {
          cx: "48",
          cy: "20",
          r: "6",
          fill: me
        })]
      });
    case "leg-curl":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "18",
          y: "20",
          width: "36",
          height: "14",
          rx: "4",
          fill: ie
        }), o.jsx("path", {
          d: "M52 28c12 0 20 10 20 20",
          fill: "none",
          stroke: X,
          strokeWidth: "5"
        }), o.jsx("circle", {
          cx: "72",
          cy: "50",
          r: "5",
          fill: me
        })]
      });
    case "cable-curl":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "18",
          y: "12",
          width: "60",
          height: "6",
          rx: "2",
          fill: ie
        }), o.jsx("path", {
          d: "M32 18v22M64 18v22",
          stroke: Xe,
          strokeWidth: "2"
        }), o.jsx("path", {
          d: "M28 42h8M60 42h8",
          stroke: X,
          strokeWidth: "3",
          strokeLinecap: "round"
        }), o.jsx("path", {
          d: "M36 50c4 8 20 8 24 0",
          fill: "none",
          stroke: me,
          strokeWidth: "2.2"
        })]
      });
    case "cable-crunch":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "20",
          y: "12",
          width: "56",
          height: "6",
          rx: "2",
          fill: ie
        }), o.jsx("path", {
          d: "M48 18v16",
          stroke: Xe,
          strokeWidth: "2"
        }), o.jsx("ellipse", {
          cx: "48",
          cy: "48",
          rx: "16",
          ry: "10",
          fill: X
        }), o.jsx("path", {
          d: "M40 44c4 6 12 6 16 0",
          fill: "none",
          stroke: $c,
          strokeWidth: "2"
        })]
      });
    case "lat-pulldown":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "16",
          y: "12",
          width: "64",
          height: "6",
          rx: "2",
          fill: ie
        }), o.jsx("path", {
          d: "M26 18v10h44V18",
          fill: "none",
          stroke: X,
          strokeWidth: "3"
        }), o.jsx("rect", {
          x: "36",
          y: "40",
          width: "24",
          height: "16",
          rx: "3",
          fill: me
        })]
      });
    case "seated-row":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "14",
          y: "42",
          width: "40",
          height: "10",
          rx: "3",
          fill: ie
        }), o.jsx("path", {
          d: "M54 46h18",
          stroke: Xe,
          strokeWidth: "3"
        }), o.jsx("rect", {
          x: "70",
          y: "22",
          width: "10",
          height: "28",
          rx: "2",
          fill: X
        }), o.jsx("circle", {
          cx: "28",
          cy: "28",
          r: "8",
          fill: me
        })]
      });
    case "shoulder-press":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "30",
          y: "36",
          width: "36",
          height: "16",
          rx: "4",
          fill: ie
        }), o.jsx("path", {
          d: "M26 36V18M70 36V18",
          stroke: X,
          strokeWidth: "3"
        }), o.jsx("rect", {
          x: "20",
          y: "14",
          width: "12",
          height: "6",
          rx: "1.5",
          fill: me
        }), o.jsx("rect", {
          x: "64",
          y: "14",
          width: "12",
          height: "6",
          rx: "1.5",
          fill: me
        })]
      });
    case "lateral-raise":
      return o.jsxs(ee, {
        children: [o.jsx("circle", {
          cx: "48",
          cy: "36",
          r: "10",
          fill: ie
        }), o.jsx("path", {
          d: "M20 40h16M60 40h16",
          stroke: X,
          strokeWidth: "4",
          strokeLinecap: "round"
        }), o.jsx("circle", {
          cx: "18",
          cy: "40",
          r: "4",
          fill: me
        }), o.jsx("circle", {
          cx: "78",
          cy: "40",
          r: "4",
          fill: me
        })]
      });
    case "hip-abduction":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "36",
          y: "16",
          width: "24",
          height: "14",
          rx: "4",
          fill: ie
        }), o.jsx("path", {
          d: "M28 36c-8 10-8 18 0 22M68 36c8 10 8 18 0 22",
          fill: "none",
          stroke: X,
          strokeWidth: "5"
        })]
      });
    case "machine-crunch":
      return o.jsxs(ee, {
        children: [o.jsx("path", {
          d: "M24 48c8-20 40-20 48 0",
          fill: ie
        }), o.jsx("path", {
          d: "M32 28c10 8 22 8 32 0",
          fill: "none",
          stroke: X,
          strokeWidth: "4"
        }), o.jsx("circle", {
          cx: "48",
          cy: "24",
          r: "5",
          fill: me
        })]
      });
    case "glute-kickback":
      return o.jsxs(ee, {
        children: [o.jsx("rect", {
          x: "18",
          y: "16",
          width: "12",
          height: "40",
          rx: "3",
          fill: ie
        }), o.jsx("path", {
          d: "M30 40h22",
          stroke: Xe,
          strokeWidth: "2"
        }), o.jsx("path", {
          d: "M52 40c10-2 18 8 14 16",
          fill: "none",
          stroke: X,
          strokeWidth: "5"
        }), o.jsx("circle", {
          cx: "68",
          cy: "56",
          r: "5",
          fill: me
        })]
      });
    default:
      return o.jsx(ee, {
        children: o.jsx("circle", {
          cx: "48",
          cy: "36",
          r: "12",
          fill: X
        })
      });
  }
}
function emptyExerciseLog(e) {
  return {
    kg: e.workingKg,
    sets: Array.from({
      length: e.sets
    }, () => ({
      reps: e.maxReps,
      done: !1
    })),
    skipped: !1,
    finished: !1
  };
}
function ExerciseCard({
  item: e,
  log: t,
  onChange: n,
  compact: r
}) {
  const l = t ?? emptyExerciseLog(e),
    s = !!n && !r;
  function i(a) {
    n == null || n({
      ...l,
      ...a
    });
  }
  function u(a, f) {
    const y = l.sets.map((h, w) => w === a ? {
        ...h,
        ...f
      } : h),
      g = y.length > 0 && y.every(h => h.done);
    i({
      sets: y,
      finished: g,
      skipped: !1
    });
  }
  return o.jsxs("article", {
    className: `border border-rose-edge bg-graphite/85 p-4 ${l.skipped ? "opacity-50" : ""} ${l.finished ? "ring-2 ring-lavender" : ""}`,
    children: [o.jsxs("div", {
      className: "flex gap-3",
      children: [o.jsx("div", {
        className: "h-[72px] w-[96px] shrink-0 overflow-hidden rounded-lg border border-rose-edge",
        children: o.jsx(MachineIllustration, {
          id: e.exerciseId
        })
      }), o.jsxs("div", {
        className: "min-w-0 flex-1",
        children: [o.jsxs("div", {
          className: "flex items-start justify-between gap-3",
          children: [o.jsxs("div", {
            children: [o.jsx("h3", {
              className: "text-lg tracking-[0.04em] text-mist",
              children: e.name
            }), o.jsx("p", {
              className: "mt-0.5 text-sm text-mute",
              children: e.machine
            })]
          }), l.finished ? o.jsx("span", {
            className: "rounded-full bg-lavender/40 px-3 py-1 text-sm text-mist",
            children: "Done"
          }) : null]
        }), o.jsxs("p", {
          className: "mt-2 text-sm text-rose",
          children: [e.sets, " × ", e.minReps, "–", e.maxReps, o.jsxs("span", {
            className: "ml-2 text-mist",
            children: [l.kg, " kg"]
          }), e.estimated ? o.jsx("span", {
            className: "ml-2 text-mute",
            children: "starting guess"
          }) : null, e.replay ? o.jsx("span", {
            className: "ml-2",
            children: "replay"
          }) : null]
        })]
      })]
    }), r && e.loggedReps ? o.jsx('p', {
      className: 'mt-2 text-sm text-mute',
      children: e.wasSkipped ? 'Skipped' : `Logged reps: ${e.loggedReps.join(' / ')}`
    }) : null, s ? o.jsxs("div", {
      className: "mt-4 grid gap-3",
      children: [o.jsxs("div", {
        children: [o.jsx("div", {
          className: "mb-2 text-sm text-mute",
          children: "Weight"
        }), o.jsxs("div", {
          className: "flex items-center gap-2",
          children: [o.jsx(Tn, {
            onClick: () => i({
              kg: Math.max(0, l.kg - 2.5)
            }),
            children: "− 2.5"
          }), o.jsx("div", {
            className: "min-w-[4.5rem] text-center text-xl text-mist",
            children: l.kg
          }), o.jsx(Tn, {
            onClick: () => i({
              kg: Math.min(2000, l.kg + 2.5)
            }),
            children: "+ 2.5"
          }), o.jsx("span", {
            className: "text-sm text-mute",
            children: "kg"
          })]
        })]
      }), o.jsx("div", {
        className: "grid gap-2",
        children: l.sets.map((a, f) => o.jsxs("div", {
          className: `flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 ${a.done ? "border-lavender bg-lavender/25" : "border-rose-edge bg-void/60"}`,
          children: [o.jsxs("span", {
            className: "w-14 text-sm font-medium text-mist",
            children: ["Set ", f + 1]
          }), o.jsx("div", {
            className: "flex gap-1",
            children: [e.minReps, 10, e.maxReps].map(y => o.jsx("button", {
              type: "button",
              onClick: () => u(f, {
                reps: y
              }),
              className: `min-h-11 min-w-11 rounded-lg text-base ${a.reps === y ? "bg-rose text-white" : "border border-rose-edge text-mist"}`,
              children: y
            }, y))
          }), o.jsx(Tn, {
            onClick: () => u(f, {
              reps: Math.max(0, a.reps - 1)
            }),
            children: "−"
          }), o.jsx("span", {
            className: "min-w-[2rem] text-center text-lg",
            children: a.reps
          }), o.jsx(Tn, {
            onClick: () => u(f, {
              reps: Math.min(200, a.reps + 1)
            }),
            children: "+"
          }), o.jsx("button", {
            type: "button",
            onClick: () => u(f, {
              done: !a.done
            }),
            className: `min-h-11 flex-1 rounded-lg px-3 text-sm font-medium ${a.done ? "bg-lavender text-mist" : "bg-rose text-white"}`,
            children: a.done ? "Set done" : "Mark set done"
          })]
        }, f))
      }), o.jsxs("div", {
        className: "flex flex-wrap gap-2",
        children: [o.jsx(Tn, {
          onClick: () => i({
            sets: [...l.sets, {
              reps: e.maxReps,
              done: !1
            }],
            finished: !1
          }),
          children: "Add set"
        }), o.jsx("button", {
          type: "button",
          onClick: () => i({
            finished: !l.finished,
            skipped: !1,
            sets: l.sets.map(a => ({ ...a, done: !l.finished }))
          }),
          className: "min-h-12 flex-1 rounded-lg bg-rose px-4 text-base text-white",
          children: l.finished ? "Undo finish" : "Finish exercise"
        }), o.jsx("button", {
          type: "button",
          onClick: () => i({
            skipped: !l.skipped,
            finished: l.skipped ? l.finished : !1
          }),
          className: "min-h-12 rounded-lg border border-rose-edge px-4 text-sm text-mute hover:text-rose",
          children: l.skipped ? "Undo skip" : "Skip exercise"
        })]
      })]
    }) : null]
  });
}
function Tn({
  children: e,
  onClick: t
}) {
  return o.jsx("button", {
    type: "button",
    onClick: t,
    className: "min-h-11 min-w-11 rounded-lg border border-rose-edge px-3 text-base text-mist hover:border-rose hover:text-rose",
    children: e
  });
}
function TodayScreen({
  state: e,
  onState: t
}) {
  const n = e.profile,
    r = useToday(),
    [l, s] = D.useState(() => {
      const v = new URLSearchParams(window.location.search).get("day");
      if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
        const [C, E, L] = v.split("-").map(Number);
        return Ft(new Date(C, E - 1, L));
      }
      return Ft(new Date());
    }),
    [i, u] = D.useState(() => ({
      y: r.getFullYear(),
      m: r.getMonth()
    })),
    [a, f] = D.useState({}),
    [y, g] = D.useState(!1),
    [h, w] = D.useState(""),
    S = D.useMemo(() => n ? planSessions(n.program, e.queue.nextIndex, n.gymDays, r, 120, e.history) : [], [n, e.queue.nextIndex, e.history, r]),
    j = D.useMemo(() => {
      const v = new Map();
      for (const C of S) v.set(dateStamp(C.date), C);
      return v;
    }, [S]),
    O = D.useMemo(() => {
      const v = new Map();
      for (const C of e.history) v.has(C.date) || v.set(C.date, C);
      return v;
    }, [e.history]),
    d = D.useMemo(() => monthCells(i.y, i.m), [i]),
    c = S[0],
    p = dateStamp(l),
    m = O.get(p),
    x = j.get(p),
    N = n ? yu(l, n.gymDays) : !1,
    _ = !!n && N && fs(l, r) && p >= e.startedOn && !m,
    z = !!c && !m && ds(l, r) && ds(l, c.date),
    R = m ? [...gr("couple"), ...gr("ull")].find(session => session.id === m.sessionId) : _ ? c == null ? void 0 : c.session : x == null ? void 0 : x.session,
    M = D.useMemo(() => R ? workoutItems(R, e.lifts, z ? e.queue.pendingMakeups : []).map(item => {
      const result = m?.results?.find(row => row.exerciseId === item.exerciseId);
      return result ? { ...item, workingKg: result.workingKg, estimated: false, sets: result.reps.length || item.sets, loggedReps: result.reps, wasSkipped: result.skipped } : item;
    }) : [], [R, e.lifts, e.queue.pendingMakeups, z, m]);
  D.useEffect(() => {
    const v = {};
    const saved = z ? readDraft(e) : {};
    for (const C of M) v[C.exerciseId] = saved[C.exerciseId] ?? emptyExerciseLog(C);
    f(v);
  }, [M, z]);
  const pe = n && !m ? cyclePosition(n.program, (x == null ? void 0 : x.index) ?? e.queue.nextIndex) : null;
  async function Pt() {
    if (!c || !z || y) return;
    if (M.some(item => { const log = a[item.exerciseId]; return !log || (!log.skipped && (!log.finished || !log.sets.every(set => set.done))); })) {
      w("Finish every set or skip the exercise before finishing the day."); return;
    }
    g(true); w("");
    try {
      const next = await desktopBridge().completeSession({
        sessionId: c.session.id,
        results: M.map(item => { const log = a[item.exerciseId]; return { exerciseId: item.exerciseId, workingKg: log.kg, reps: log.sets.map(set => set.reps), skipped: log.skipped }; })
      });
      localStorage.removeItem(draftKey(e));
      t(next); w("Workout saved. Your next session is on the next gym day.");
    } catch (error) { w(error.message); } finally { g(false); }
  }
  async function yr() {
    if (!c || !z || y) return;
    g(true); w("");
    try {
      const next = await desktopBridge().skipSession(c.session.id, c.session.name);
      localStorage.removeItem(draftKey(e));
      t(next); w("Day skipped. This workout waits for your next gym day.");
    } catch (error) { w(error.message); } finally { g(false); }
  }
  async function $l() {
    if (!R || !M.length) return;
    const v = desktopBridge();
    if (!v) return;
    g(!0), w("");
    try {
    const C = await v.sendWorkoutEmail({
      sessionName: R.name,
      dateLabel: formatDate(l),
      exercises: M.map(E => {
        var L;
        return {
          id: E.exerciseId,
          name: E.name,
          image: E.image,
          sets: E.sets,
          minReps: E.minReps,
          maxReps: E.maxReps,
          kg: ((L = a[E.exerciseId]) == null ? void 0 : L.kg) ?? E.workingKg,
          estimated: E.estimated,
          replay: E.replay
        };
      })
    });
    w(C.ok ? `Sent to ${(n == null ? void 0 : n.email) || "your inbox"}.` : C.error ?? "Send failed.");
    } catch (error) { w(error.message); } finally { g(false); }
  }
  if (!n) return o.jsx("p", {
    className: "p-8 text-mute",
    children: "Finish setup to unlock your calendar."
  });
  const Sn = new Date(i.y, i.m, 1).toLocaleDateString(void 0, {
      month: "long",
      year: "numeric"
    }),
    jn = M.filter(v => {
      var C, E;
      return ((C = a[v.exerciseId]) == null ? void 0 : C.finished) || ((E = a[v.exerciseId]) == null ? void 0 : E.skipped);
    }).length;
  return o.jsxs("div", {
    className: "grid h-full grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] gap-5 overflow-hidden p-5",
    children: [o.jsxs(Panel, {
      className: "grid min-h-0 grid-rows-[auto_auto_1fr_auto] overflow-hidden p-5",
      children: [o.jsxs("div", {
        className: "flex items-end justify-between gap-3",
        children: [o.jsxs("div", {
          children: [o.jsx(ge, {
            children: "Home · calendar"
          }), o.jsx("h1", {
            className: "mt-2 text-3xl tracking-[0.04em] text-mist",
            children: Sn
          }), o.jsxs("p", {
            className: "mt-2 flex items-center gap-2 text-sm text-mute",
            children: [o.jsx(no, {
              className: "h-6 w-6"
            }), cyclePosition(n.program, e.queue.nextIndex).label]
          })]
        }), o.jsxs("div", {
          className: "flex gap-2",
          children: [o.jsx(ps, {
            onClick: () => u(v => v.m === 0 ? {
              y: v.y - 1,
              m: 11
            } : {
              y: v.y,
              m: v.m - 1
            }),
            children: "Prev"
          }), o.jsx(ps, {
            onClick: () => {
              u({
                y: r.getFullYear(),
                m: r.getMonth()
              }), s(r);
            },
            children: "Today"
          }), o.jsx(ps, {
            onClick: () => u(v => v.m === 11 ? {
              y: v.y + 1,
              m: 0
            } : {
              y: v.y,
              m: v.m + 1
            }),
            children: "Next"
          })]
        })]
      }), o.jsx("div", {
        className: "mt-4 grid grid-cols-7 gap-1 text-center text-sm text-mute",
        children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(v => o.jsx("div", {
          className: "px-1 py-1",
          children: v
        }, v))
      }), o.jsx("div", {
        className: "mt-1 grid min-h-0 grid-cols-7 grid-rows-6 gap-1.5",
        children: d.map(({
          date: v,
          inMonth: C
        }) => {
          const E = dateStamp(v),
            L = O.get(E),
            U = j.get(E),
            it = yu(v, n.gymDays),
            We = it && fs(v, r) && E >= e.startedOn && !L,
            Qt = ds(v, r),
            Ge = ds(v, l),
            zt = Qp({
              inMonth: C,
              gym: it,
              missed: We,
              history: L,
              plan: !!U
            }),
            Uc = Kp({
              inMonth: C,
              kind: zt,
              isToday: Qt,
              selected: Ge
            }),
            Bc = C ? L != null && L.done ? L.sessionName : L ? "Skipped" : We ? "Missed" : U ? `Day ${cyclePosition(n.program, U.index).day}/${cyclePosition(n.program, U.index).of}` : it ? "Gym" : "Rest" : "";
          return o.jsxs("button", {
            type: "button",
            onClick: () => {
              s(v), w("");
            },
            className: `flex min-h-[4.5rem] flex-col items-start rounded-xl px-2 py-1.5 text-left transition ${Uc}`,
            children: [o.jsxs("span", {
              className: "flex w-full items-center justify-between text-sm",
              children: [o.jsx("span", {
                className: Qt ? "font-semibold text-gold" : "",
                children: v.getDate()
              }), C ? o.jsx(Rc, {
                kind: zt,
                className: "h-4 w-4"
              }) : null]
            }), o.jsx("span", {
              className: "mt-auto line-clamp-2 text-[11px] leading-tight opacity-90",
              children: Bc
            })]
          }, E);
        })
      }), o.jsxs("div", {
        className: "mt-3 flex flex-wrap gap-3 text-sm text-mute",
        children: [o.jsx(Fr, {
          kind: "gym",
          label: "Gym"
        }), o.jsx(Fr, {
          kind: "rest",
          label: "Rest"
        }), o.jsx(Fr, {
          kind: "done",
          label: "Done"
        }), o.jsx(Fr, {
          kind: "missed",
          label: "Missed"
        })]
      })]
    }), o.jsxs("div", {
      className: "flex min-h-0 flex-col gap-3 overflow-auto scrollbar-thin pr-1",
      children: [o.jsxs(Panel, {
        className: "p-5",
        children: [o.jsx(ge, {
          children: formatDate(l)
        }), o.jsx("h2", {
          className: "mt-2 text-2xl tracking-[0.04em] text-mist",
          children: m ? m.sessionName : _ ? "Missed gym day" : R ? R.name : N ? "Gym day" : "Rest day"
        }), pe && (R || _) ? o.jsx("p", {
          className: "mt-2 text-base text-rose",
          children: pe.label
        }) : null, o.jsx("p", {
          className: "mt-2 text-base leading-relaxed text-mute",
          children: m ? m.done ? "Logged. The queue already moved on." : "You skipped this session. The next unfinished workout stayed in front." : _ ? `Nothing was logged. ${c ? `${c.session.name} is waiting on ${formatDate(c.date)}.` : "The unfinished session slid forward."}` : z ? (c == null ? void 0 : c.session.tagline) ?? "This is the next unfinished session." : R ? "Planned from the queue. Log it when this gym day arrives." : N ? "A gym day with no session assigned yet." : c ? `Rest today. Next up is ${c.session.name} on ${formatDate(c.date)}.` : "No upcoming gym days on the calendar."
        }), h ? o.jsx("p", {
          className: "mt-3 text-sm text-rose",
          children: h
        }) : null, _ && c ? o.jsxs("div", {
          className: "mt-4 grid gap-2",
          children: [o.jsx("button", {
            type: "button",
            onClick: () => {
              s(c.date), u({
                y: c.date.getFullYear(),
                m: c.date.getMonth()
              });
            },
            className: "min-h-12 rounded-xl bg-rose px-4 text-base text-white",
            children: "Open next gym day"
          }), z ? o.jsx("p", {
            className: "text-sm text-mute",
            children: "TextField log the waiting workout below if you did it later."
          }) : null]
        }) : null, !R && !_ ? o.jsxs("div", {
          className: "mt-4 flex items-center gap-3 rounded-xl bg-blush/50 px-4 py-3 text-sm text-mist",
          children: [o.jsx(ro, {}), "Soft day. Drink water, then come back when the dumbbell shows up."]
        }) : null, z ? o.jsxs("div", {
          className: "mt-4 flex flex-wrap gap-2",
          children: [o.jsx("button", {
            type: "button",
            disabled: y,
            onClick: () => void Pt(),
            className: "min-h-12 flex-1 rounded-xl bg-rose px-4 text-base text-white disabled:opacity-40",
            children: "Finish day"
          }), o.jsx("button", {
            type: "button",
            disabled: y,
            onClick: () => void yr(),
            className: "min-h-12 rounded-xl border border-rose-edge px-4 text-base text-mute hover:text-rose disabled:opacity-40",
            children: "Skip this day"
          })]
        }) : null, z && M.length ? o.jsxs("p", {
          className: "mt-2 text-sm text-mute",
          children: [jn, " of ", M.length, " exercises wrapped."]
        }) : null, R && M.length ? o.jsx("button", {
          type: "button",
          disabled: y,
          onClick: () => void $l(),
          className: "mt-3 text-left text-sm text-mute underline-offset-4 hover:text-rose hover:underline disabled:opacity-40",
          children: "Email this workout"
        }) : null]
      }), M.map(v => o.jsx(ExerciseCard, {
        item: v,
        compact: !z,
        log: a[v.exerciseId],
        onChange: z ? C => f(E => {
          const next = { ...E, [v.exerciseId]: C };
          localStorage.setItem(draftKey(e), JSON.stringify(next));
          return next;
        }) : void 0
      }, v.exerciseId))]
    })]
  });
}
function Qp({
  inMonth: e,
  gym: t,
  missed: n,
  history: r,
  plan: l
}) {
  return e ? r != null && r.done ? "done" : r && !r.done ? "skipped" : n ? "missed" : l || t ? "gym" : "rest" : "rest";
}
function Kp({
  inMonth: e,
  kind: t,
  isToday: n,
  selected: r
}) {
  if (!e) return "bg-transparent text-mute/35";
  const l = r ? "ring-2 ring-rose" : n ? "ring-2 ring-gold/80" : "ring-1 ring-transparent";
  return t === "missed" ? `${l} bg-berry/15 text-berry` : t === "done" ? `${l} bg-lavender/30 text-mist` : t === "skipped" ? `${l} bg-slate/80 text-mute` : t === "gym" ? `${l} bg-rose-dim text-rose` : `${l} bg-graphite/50 text-mute hover:bg-blush/60`;
}
function Fr({
  kind: e,
  label: t
}) {
  return o.jsxs("span", {
    className: "inline-flex items-center gap-1.5",
    children: [o.jsx(Rc, {
      kind: e
    }), t]
  });
}
function ps({
  children: e,
  onClick: t
}) {
  return o.jsx("button", {
    type: "button",
    onClick: t,
    className: "min-h-10 border border-rose-edge px-3 text-sm text-mute hover:border-rose hover:text-rose",
    children: e
  });
}
function App() {
  const [e, t] = D.useState(initialState()),
    [n, r] = D.useState(!1),
    [l, s] = D.useState(() => {
      const i = new URLSearchParams(window.location.search).get("screen");
      return i === "learn" || i === "program" || i === "log" || i === "today" ? i : "today";
    });
  return D.useEffect(() => {
    loadState().then(i => {
      t(i), r(!0);
    }).catch(error => {
      const root = document.getElementById('root');
      root.textContent = `Could not load saved workouts: ${error.message}. Your data has not been reset. Close and reopen the app after checking the saved data file.`;
    });
  }, []), n ? o.jsxs("div", {
    className: "flex h-full flex-col bg-void text-mist",
    children: [o.jsx(TitleBar, {}), e.onboardingComplete ? o.jsxs("div", {
      className: "grid-veil flex min-h-0 flex-1",
      children: [o.jsx(Navigation, {
        active: l,
        onChange: s
      }), o.jsxs("main", {
        className: "min-w-0 flex-1",
        children: [l === "today" ? o.jsx(TodayScreen, {
          state: e,
          onState: t
        }) : null, l === "learn" ? o.jsx(LearnScreen, {}) : null, l === "program" ? o.jsx(ProgramScreen, {
          state: e,
          onState: t
        }) : null, l === "log" ? o.jsx(SettingsScreen, {
          state: e,
          onState: t
        }) : null]
      })]
    }) : o.jsx(OnboardingScreen, {
      onDone: t
    })]
  }) : o.jsxs("div", {
    className: "flex h-full flex-col bg-void",
    children: [o.jsx(TitleBar, {}), o.jsx("div", {
      className: "grid flex-1 place-items-center text-sm tracking-[0.2em] text-rose",
      children: "Opening the room"
    })]
  });
}
ms.createRoot(document.getElementById("root")).render(o.jsx(rd.StrictMode, {
  children: o.jsx(App, {})
}));
