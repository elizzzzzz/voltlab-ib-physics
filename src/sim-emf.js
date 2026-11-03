import { setupCanvas, makeSlider } from './util.js';

// ---- Chapter 6: EMF & Internal Resistance ----
export function mountEmf(stage, controls, t) {
  const { ctx, W, H } = setupCanvas(stage, 680, 460);
  const TOP = 110, BOT = 350, LX = 150, RX = 540;
  const state = { E: 12, r: 2, R: 10 };

  controls.append(
    makeSlider({ label: t('emf_e'), min: 1, max: 24, step: 0.5, value: state.E, unit: 'V', onInput: v => (state.E = v) }),
    makeSlider({ label: t('emf_r'), min: 0.5, max: 10, step: 0.1, value: state.r, unit: 'Ω', onInput: v => (state.r = v) }),
    makeSlider({ label: t('emf_rload'), min: 1, max: 60, step: 1, value: state.R, unit: 'Ω', onInput: v => (state.R = v) }),
  );

  const loop = [[LX, BOT], [RX, BOT], [RX, TOP], [LX, TOP], [LX, BOT]];
  const segs = []; let loopLen = 0;
  for (let i = 0; i < loop.length - 1; i++) {
    const l = Math.hypot(loop[i + 1][0] - loop[i][0], loop[i + 1][1] - loop[i][1]);
    segs.push({ a: loop[i], b: loop[i + 1], l, start: loopLen });
    loopLen += l;
  }
  function pointAt(s) {
    s = ((s % loopLen) + loopLen) % loopLen;
    for (const g of segs) if (s <= g.start + g.l) {
      const t = (s - g.start) / g.l;
      return [g.a[0] + (g.b[0] - g.a[0]) * t, g.a[1] + (g.b[1] - g.a[1]) * t];
    }
    return loop[0];
  }
  const electrons = Array.from({ length: 34 }, () => ({ s: Math.random() * loopLen }));

  const I = () => state.E / (state.R + state.r);
  const Vt = () => state.E - I() * state.r;

  function wire(pts) {
    ctx.strokeStyle = 'rgba(230,237,247,.85)'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  }

  let lastT = performance.now();
  function draw(tm) {
    const dt = Math.min(0.05, (tm - lastT) / 1000); lastT = tm;
    ctx.clearRect(0, 0, W, H);
    const i = I(), vt = Vt(), p = i * i * state.R;

    wire([[LX, TOP], [RX, TOP]]);
    wire([[RX, BOT], [LX, BOT]]);
    wire([[LX, TOP], [LX, BOT]]);

    // battery + internal resistance (box on left wire)
    const cy = (TOP + BOT) / 2;
    ctx.fillStyle = '#1c2640'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(LX - 44, cy - 60, 88, 120, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fbbf24'; ctx.font = '700 13px "Space Grotesk"'; ctx.textAlign = 'center';
    ctx.fillText(t('lbl_source'), LX, cy - 34);
    ctx.fillStyle = '#e6edf7'; ctx.font = '600 12px "Space Grotesk"';
    ctx.fillText(`E = ${state.E.toFixed(1)} V`, LX, cy - 12);
    // internal resistor zigzag
    ctx.strokeStyle = 'rgba(251,113,133,.8)'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let k = 0; k <= 8; k++) {
      const zz = LX - 18 + (k % 2) * 36, zy = cy + 4 + k * 5.5;
      k ? ctx.lineTo(zz, zy) : ctx.moveTo(zz, zy);
    }
    ctx.stroke();
    ctx.fillStyle = '#fb7185'; ctx.font = '600 11px "Space Grotesk"';
    ctx.fillText(`r = ${state.r.toFixed(1)} Ω`, LX, cy + 62);

    // load resistor on top rail
    const rx = (LX + RX) / 2;
    ctx.fillStyle = '#1c2640'; ctx.strokeStyle = 'rgba(103,232,249,.75)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(rx - 44, TOP - 19, 88, 38, 6); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(103,232,249,.4)'; ctx.lineWidth = 1.4;
    for (let k = 0; k < 6; k++) { const zx = rx - 36 + k * 14; ctx.beginPath(); ctx.moveTo(zx, TOP - 12); ctx.lineTo(zx + 7, TOP + 12); ctx.stroke(); }
    ctx.fillStyle = '#e6edf7'; ctx.font = '700 12px "Space Grotesk"'; ctx.textAlign = 'center';
    ctx.fillText(`R = ${state.R} Ω`, rx, TOP + 4);
    ctx.fillStyle = '#67e8f9'; ctx.font = '600 11px "Space Grotesk"';
    ctx.fillText(`V_R = ${(i * state.R).toFixed(2)} V`, rx, TOP - 28);

    // electrons
    const sp = 16 + i * 26;
    for (const e of electrons) {
      e.s += sp * dt;
      const [x, y] = pointAt(e.s);
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(103,232,249,.2)';
      ctx.beginPath(); ctx.arc(x, y, 7.5, 0, Math.PI * 2); ctx.fill();
    }

    // V–I graph (terminal p.d. vs current)
    const gx = 470, gy = 396, gw = 190, gh = 150;
    const yMax = state.E * 1.12, xMax = (state.E / state.r) * 1.12;
    ctx.strokeStyle = 'rgba(147,161,189,.4)'; ctx.lineWidth = 1;
    ctx.strokeRect(gx, gy - gh, gw, gh);
    // line V = E - I r
    ctx.strokeStyle = 'rgba(103,232,249,.9)'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gx, gy - (state.E / yMax) * gh);
    ctx.lineTo(gx + (xMax * 0 + (state.E / state.r) / xMax) * gw, gy);
    ctx.stroke();
    // operating point
    const opx = gx + (i / xMax) * gw, opy = gy - (vt / yMax) * gh;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(opx, opy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(230,237,247,.85)'; ctx.font = '10px "Space Grotesk"';
    ctx.fillText(t('lbl_i_axis'), gx + gw - 12, gy + 14);
    ctx.fillText(t('lbl_v_axis'), gx + 8, gy - gh - 8);
    ctx.fillStyle = 'rgba(147,161,189,.9)';
    ctx.fillText(t('graph_note'), gx + gw / 2, gy + 28);

    // readout chips
    const rows = [
      [t('row_i'), `${i.toFixed(2)} A`, '#67e8f9'],
      [t('row_vt'), `${vt.toFixed(2)} V`, '#fbbf24'],
      [t('row_pint'), `${(i * i * state.r).toFixed(2)} W`, '#fb7185'],
      [t('row_pext'), `${p.toFixed(2)} W`, '#5eead4'],
    ];
    rows.forEach((r, k) => {
      const y = 40 + k * 44;
      ctx.fillStyle = 'rgba(20,27,46,.85)'; ctx.strokeStyle = 'rgba(147,161,189,.35)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(30, y, 300, 36, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(147,161,189,.95)'; ctx.font = '11.5px "Noto Sans SC"'; ctx.textAlign = 'left';
      ctx.fillText(r[0], 44, y + 15);
      ctx.fillStyle = r[2]; ctx.font = '700 14px "Space Grotesk"';
      ctx.fillText(r[1], 44, y + 30);
    });
  }

  let raf;
  (function loop(t) { draw(t); raf = requestAnimationFrame(loop); })(lastT);
  return { destroy() { cancelAnimationFrame(raf); } };
}
