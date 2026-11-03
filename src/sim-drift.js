import { E_CHARGE, setupCanvas, makeSlider, sci } from './util.js';

// ---- Chapter 4: Current, Drift Velocity & Ohm's Law ----
export function mountDrift(stage, controls, t) {
  const { ctx, W, H } = setupCanvas(stage, 680, 430);
  const state = { V: 6, R: 10, n: 8.5e28, A: 1.5 }; // n in m^-3, A in mm^2
  const electrons = [];

  const sV = makeSlider({ label: t('lbl_V'), min: 0, max: 12, step: 0.5, value: state.V, unit: 'V', onInput: v => (state.V = v) });
  const sR = makeSlider({ label: t('lbl_R'), min: 2, max: 40, step: 1, value: state.R, unit: 'Ω', onInput: v => (state.R = v) });
  const sA = makeSlider({ label: t('lbl_A'), min: 0.5, max: 4, step: 0.1, value: state.A, unit: 'mm²', onInput: v => (state.A = v) });
  const sN = makeSlider({
    label: t('lbl_n'), min: 1, max: 20, step: 0.5, value: 8.5,
    onInput: v => (state.n = v * 1e28),
  });
  controls.append(sV, sR, sA, sN);

  const COND = { x: 40, y: 210, w: 420, h: 110 };
  const ions = [];
  for (let ix = 0; ix < 18; ix++) for (let iy = 0; iy < 5; iy++)
    ions.push({ x: COND.x + 14 + ix * 23, y: COND.y + 12 + iy * 22 });

  function current() { return state.V / state.R; }
  function drift() { return current() / (state.n * state.A * 1e-6 * E_CHARGE); }

  for (let i = 0; i < 56; i++)
    electrons.push({ x: COND.x + Math.random() * COND.w, y: COND.y + 10 + Math.random() * (COND.h - 20), jx: (Math.random() - 0.5) * 2, jy: (Math.random() - 0.5) * 2 });

  let lastT = performance.now();
  function draw(tm) {
    const dt = Math.min(0.05, (tm - lastT) / 1000); lastT = tm;
    ctx.clearRect(0, 0, W, H);
    const I = current(), vd = drift();

    // battery symbol + V label
    ctx.strokeStyle = 'rgba(230,237,247,.7)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(8, COND.y + COND.h / 2); ctx.lineTo(COND.x - 16, COND.y + COND.h / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(COND.x - 14, COND.y + 18); ctx.lineTo(COND.x - 14, COND.y + COND.h - 18); ctx.stroke();
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(COND.x - 22, COND.y + 32); ctx.lineTo(COND.x - 6, COND.y + 32); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(COND.x - 18, COND.y + 52); ctx.lineTo(COND.x - 10, COND.y + 52); ctx.stroke();
    ctx.fillStyle = 'rgba(230,237,247,.8)'; ctx.font = '11px "Space Grotesk"'; ctx.textAlign = 'center';
    ctx.fillText('+', COND.x - 14, COND.y + 26);
    ctx.fillText('V', COND.x - 14, COND.y + 70);

    // conductor
    ctx.fillStyle = 'rgba(22,32,58,.9)';
    ctx.strokeStyle = 'rgba(103,232,249,.5)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(COND.x, COND.y, COND.w, COND.h, 10); ctx.fill(); ctx.stroke();
    // area label
    ctx.fillStyle = 'rgba(147,161,189,.9)'; ctx.font = '11px "Space Grotesk"'; ctx.textAlign = 'left';
    ctx.fillText(`A = ${state.A.toFixed(1)} mm²`, COND.x + 6, COND.y - 8);

    for (const p of ions) {
      ctx.fillStyle = 'rgba(96,128,190,.8)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(96,128,190,.35)';
      ctx.font = '700 8px "Space Grotesk"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('+', p.x, p.y + 0.5);
    }
    ctx.textBaseline = 'alphabetic';

    // electrons drift (visual speed exaggerated ×5e6 relative to vd m/s -> px/s)
    const speedPx = 8 + vd * 5e6;
    for (const e of electrons) {
      e.x += speedPx * dt + e.jx * 14 * dt;
      e.y += e.jy * 18 * dt;
      if (e.x > COND.x + COND.w - 6) { e.x = COND.x + 6; e.y = COND.y + 10 + Math.random() * (COND.h - 20); }
      if (e.y < COND.y + 8 || e.y > COND.y + COND.h - 8) e.jy *= -1;
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath(); ctx.arc(e.x, e.y, 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(103,232,249,.25)';
      ctx.beginPath(); ctx.arc(e.x, e.y, 6, 0, Math.PI * 2); ctx.fill();
    }

    // I arrow under conductor
    ctx.fillStyle = '#67e8f9'; ctx.font = '600 13px "Space Grotesk"'; ctx.textAlign = 'center';
    ctx.fillText(`${t('lbl_force')} = V/R = ${I.toFixed(2)} A`, COND.x + COND.w / 2, COND.y + COND.h + 26);

    // right panel: numbers
    const px = 500, py = 60;
    ctx.textAlign = 'left';
    const rows = [
      [t('row_current'), `${I.toFixed(2)} A`],
      [t('row_drift'), `${sci(vd, 3)} m/s`],
      [t('row_n'), `${sci(state.n, 3)} m⁻³`],
      [t('row_a'), `${state.A.toFixed(1)} mm²`],
      [t('row_q'), `${sci(E_CHARGE, 3)} C`],
    ];
    rows.forEach((r, i) => {
      ctx.fillStyle = 'rgba(147,161,189,.95)'; ctx.font = '12px "Noto Sans SC"';
      ctx.fillText(r[0], px, py + i * 34);
      ctx.fillStyle = i === 1 ? '#fbbf24' : '#e6edf7'; ctx.font = '700 14px "Space Grotesk"';
      ctx.fillText(r[1], px, py + i * 34 + 18);
    });
    ctx.fillStyle = 'rgba(251,191,36,.9)'; ctx.font = '12px "Space Grotesk"';
    ctx.fillText(t('drift_formula'), px, py + 5 * 34 + 8);

    // V–I graph
    const gx = 500, gy = 260, gw = 150, gh = 130;
    ctx.strokeStyle = 'rgba(147,161,189,.4)'; ctx.lineWidth = 1;
    ctx.strokeRect(gx, gy, gw, gh);
    const iMax = 12 / 2; // 纵轴量程 0–6 A
    const iEnd = 12 / state.R;
    ctx.strokeStyle = 'rgba(103,232,249,.9)'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh);
    ctx.lineTo(gx + gw, gy + gh - (iEnd / iMax) * gh);
    ctx.stroke();
    // axis labels
    ctx.fillStyle = 'rgba(147,161,189,.9)'; ctx.font = '10px "Space Grotesk"'; ctx.textAlign = 'center';
    ctx.fillText(t('lbl_i_axis'), gx + 16, gy - 6);
    ctx.fillText(t('lbl_v_axis'), gx + gw - 14, gy + gh + 14);
    // operating point
    const opx = gx + (state.V / 12) * gw, opy = gy + gh - (I / iMax) * gh;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(opx, opy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(230,237,247,.85)';
    ctx.fillText(t('slope_label'), gx + gw / 2, gy + gh + 28);
  }

  let raf;
  (function loop(t) { draw(t); raf = requestAnimationFrame(loop); })(lastT);
  return { destroy() { cancelAnimationFrame(raf); } };
}
