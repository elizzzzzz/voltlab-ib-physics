import { setupCanvas, makeSlider, makeSegment } from './util.js';

// ---- Chapter 5: Series & Parallel Circuits ----
export function mountCircuit(stage, controls, t) {
  const { ctx, W, H } = setupCanvas(stage, 680, 460);
  const TOP = 110, BOT = 350, LX = 130, RX = 560;
  const state = { topo: 'series', E: 12, r1: 10, r2: 20, r3: 30, count: 2, vsel: 0 };
  const electrons = [];

  const topoSeg = makeSegment({
    options: [{ label: t('series'), value: 'series' }, { label: t('parallel'), value: 'parallel' }],
    value: 'series', onChange: v => { state.topo = v; rebuild(); },
  });
  const cntSeg = makeSegment({
    options: [{ label: t('one'), value: 1 }, { label: t('two'), value: 2 }, { label: t('three'), value: 3 }],
    value: 2, onChange: v => { state.count = v; rebuild(); },
  });
  const vSeg = makeSegment({
    options: [{ label: '测 R1', value: 0 }, { label: '测 R2', value: 1 }, { label: '测 R3', value: 2 }],
    value: 0, onChange: v => (state.vsel = v),
  });
  function segCtl(label, seg) {
    const d = document.createElement('div'); d.className = 'ctl'; d.style.minWidth = '200px'; d.style.flex = '0 1 auto';
    d.innerHTML = `<div class="ctl-row"><span>${label}</span></div>`;
    d.appendChild(seg); return d;
  }
  controls.append(
    segCtl(t('topo'), topoSeg),
    segCtl(t('cnt'), cntSeg),
    segCtl(t('vsel'), vSeg),
    makeSlider({ label: t('emf'), min: 1, max: 24, step: 0.5, value: state.E, unit: 'V', onInput: v => (state.E = v) }),
    makeSlider({ label: t('lbl_r1'), min: 2, max: 60, step: 1, value: state.r1, unit: 'Ω', onInput: v => (state.r1 = v) }),
    makeSlider({ label: t('lbl_r2'), min: 2, max: 60, step: 1, value: state.r2, unit: 'Ω', onInput: v => (state.r2 = v) }),
    makeSlider({ label: t('lbl_r3'), min: 2, max: 60, step: 1, value: state.r3, unit: 'Ω', onInput: v => (state.r3 = v) }),
  );

  function solve() {
    if (state.topo === 'series') {
      const rs = [state.r1, state.r2, state.r3].slice(0, state.count);
      const I = state.E / rs.reduce((a, b) => a + b, 0);
      return { rs, I, branchI: [I], vEach: rs.map(r => I * r), vMain: state.E };
    }
    const rs = [state.r1, state.r2];
    const branchI = rs.map(r => state.E / r);
    return { rs, I: branchI[0] + branchI[1], branchI, vEach: rs.map(() => state.E), vMain: state.E };
  }

  function seriesSlots(n) {
    const slots = [];
    const span = RX - LX - 180;
    for (let i = 0; i < n; i++) slots.push(LX + 90 + (span * (i + 0.5)) / n);
    return slots;
  }
  const branchX = () => [300, 440];

  function buildRoute(pts) {
    const segs = []; let len = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
      segs.push({ a: pts[i], b: pts[i + 1], l, start: len });
      len += l;
    }
    return { segs, len };
  }
  function pointAt(route, s) {
    s = ((s % route.len) + route.len) % route.len;
    for (const g of route.segs) if (s <= g.start + g.l) {
      const t = (s - g.start) / g.l;
      return [g.a[0] + (g.b[0] - g.a[0]) * t, g.a[1] + (g.b[1] - g.a[1]) * t];
    }
    return route.segs[0].a;
  }

  let routes = []; // {route, i}
  function rebuild() {
    electrons.length = 0;
    routes = [];
    if (state.topo === 'series') {
      routes.push({ route: buildRoute([[LX, BOT], [RX, BOT], [RX, TOP], [LX, TOP], [LX, BOT]]), i: 0 });
    } else {
      for (let b = 0; b < 2; b++) {
        const bx = branchX()[b];
        routes.push({ route: buildRoute([[LX, BOT], [RX, BOT], [RX, TOP], [bx, TOP], [bx, BOT], [LX, BOT], [LX, BOT]]), i: b });
      }
    }
    const sol = solve();
    routes.forEach((r, idx) => {
      const share = state.topo === 'parallel' ? sol.branchI[idx] : sol.I;
      const n = Math.max(6, Math.round(share * 8));
      for (let k = 0; k < n; k++)
        electrons.push({ route: idx, s: Math.random() * r.route.len });
    });
  }
  rebuild();

  function wire(pts, color = 'rgba(230,237,247,.85)') {
    ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  }
  function resistor(x, y, r, label, v) {
    ctx.fillStyle = '#1c2640'; ctx.strokeStyle = 'rgba(103,232,249,.75)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x - 34, y - 18, 68, 36, 6); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(103,232,249,.4)'; ctx.lineWidth = 1.4;
    for (let i = 0; i < 5; i++) { const zx = x - 26 + i * 12; ctx.beginPath(); ctx.moveTo(zx, y - 12); ctx.lineTo(zx + 6, y + 12); ctx.stroke(); }
    ctx.fillStyle = '#e6edf7'; ctx.font = '700 12px "Space Grotesk"'; ctx.textAlign = 'center';
    ctx.fillText(`${label} = ${r} Ω`, x, y + 4);
    ctx.fillStyle = 'rgba(251,191,36,.95)'; ctx.font = '600 11px "Space Grotesk"';
    ctx.fillText(`V = ${v.toFixed(1)} V`, x, y - 26);
  }
  function battery(x, yMid, E) {
    ctx.strokeStyle = 'rgba(230,237,247,.9)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x, yMid - 34); ctx.lineTo(x, yMid - 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, yMid + 8); ctx.lineTo(x, yMid + 34); ctx.stroke();
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 14, yMid - 8); ctx.lineTo(x + 14, yMid - 8); ctx.stroke();
    ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - 7, yMid + 8); ctx.lineTo(x + 7, yMid + 8); ctx.stroke();
    ctx.fillStyle = '#e6edf7'; ctx.font = '700 13px "Space Grotesk"'; ctx.textAlign = 'left';
    ctx.fillText('+', x + 18, yMid - 4);
    ctx.fillText('−', x + 18, yMid + 14);
    ctx.fillStyle = '#fbbf24'; ctx.font = '700 13px "Space Grotesk"';
    ctx.fillText(`E = ${E.toFixed(1)} V`, x - 30, yMid + 60);
  }
  function ammeter(x, y, I) {
    ctx.fillStyle = '#1c2640'; ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#5eead4'; ctx.font = '700 13px "Space Grotesk"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('A', x, y + 1); ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(94,234,212,.95)'; ctx.font = '600 11px "Space Grotesk"';
    ctx.fillText(`${I.toFixed(2)} A`, x, y + 34);
  }
  function voltmeter(x, y, V) {
    ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(251,191,36,.6)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x, y - 18); ctx.lineTo(x, y - 52); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#1c2640'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y - 66, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fbbf24'; ctx.font = '700 12px "Space Grotesk"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('V', x, y - 65); ctx.textBaseline = 'alphabetic';
    ctx.font = '600 11px "Space Grotsk"';
    ctx.fillText(`${V.toFixed(1)} V`, x, y - 90);
  }

  let lastT = performance.now();
  function draw(tm) {
    const dt = Math.min(0.05, (tm - lastT) / 1000); lastT = tm;
    ctx.clearRect(0, 0, W, H);
    const sol = solve();

    // wires
    if (state.topo === 'series') {
      wire([[LX, TOP], [RX, TOP]]);
      wire([[RX, BOT], [LX + 34, BOT]]);
      wire([[LX - 34, BOT], [LX, BOT]]);
      wire([[LX, TOP], [LX, TOP - 0]]);
    } else {
      wire([[LX, TOP], [RX, TOP]]);
      wire([[RX, BOT], [LX + 34, BOT]]);
      wire([[LX - 34, BOT], [LX, BOT]]);
      branchX().forEach(bx => wire([[bx, TOP], [bx, BOT]]));
    }
    // left vertical through battery
    wire([[LX, TOP], [LX, BOT]]);

    battery(LX, (TOP + BOT) / 2, state.E);

    if (state.topo === 'series') {
      const slots = seriesSlots(state.count);
      const rs = [state.r1, state.r2, state.r3];
      slots.forEach((x, i) => resistor(x, TOP, rs[i], `R${i + 1}`, sol.vEach[i]));
      ammeter((LX + RX) / 2, BOT, sol.I);
      voltmeter(slots[Math.min(state.vsel, state.count - 1)], TOP, sol.vEach[Math.min(state.vsel, state.count - 1)]);
    } else {
      const bx = branchX();
      resistor(bx[0], (TOP + BOT) / 2, state.r1, 'R1', state.E);
      resistor(bx[1], (TOP + BOT) / 2, state.r2, 'R2', state.E);
      ammeter((LX + RX) / 2, BOT, sol.I);
      voltmeter(bx[state.vsel === 2 ? 0 : state.vsel], (TOP + BOT) / 2, state.E);
      ctx.fillStyle = 'rgba(147,161,189,.9)'; ctx.font = '11px "Noto Sans SC"'; ctx.textAlign = 'center';
      ctx.fillText(`I₁ = ${sol.branchI[0].toFixed(2)} A`, bx[0], (TOP + BOT) / 2 + 56);
      ctx.fillText(`I₂ = ${sol.branchI[1].toFixed(2)} A`, bx[1], (TOP + BOT) / 2 + 56);
    }

    // electrons
    const speeds = state.topo === 'parallel' ? sol.branchI : [sol.I];
    for (const e of electrons) {
      const sp = 20 + speeds[e.route] * 40;
      e.s += sp * dt;
      const [x, y] = pointAt(routes[e.route].route, e.s);
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(103,232,249,.22)';
      ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
    }

    // summary chips
    const Rtot = state.topo === 'series'
      ? [state.r1, state.r2, state.r3].slice(0, state.count).reduce((a, b) => a + b, 0)
      : 1 / (1 / state.r1 + 1 / state.r2);
    ctx.fillStyle = 'rgba(20,27,46,.85)'; ctx.strokeStyle = 'rgba(147,161,189,.35)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(40, 16, 600, 56, 10); ctx.fill(); ctx.stroke();
    ctx.textAlign = 'left'; ctx.font = '700 13px "Space Grotesk"';
    ctx.fillStyle = '#67e8f9';
    ctx.fillText(`${t('i_total')} = ${sol.I.toFixed(2)} A`, 60, 40);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`${t('r_total')} = ${Rtot.toFixed(1)} Ω`, 200, 40);
    ctx.fillStyle = '#e6edf7';
    ctx.font = '500 12px "Noto Sans SC"';
    ctx.fillText(t(state.topo === 'series' ? 'series_rule' : 'parallel_rule'), 60, 62);
  }

  let raf;
  (function loop(t) { draw(t); raf = requestAnimationFrame(loop); })(lastT);
  return { destroy() { cancelAnimationFrame(raf); } };
}
