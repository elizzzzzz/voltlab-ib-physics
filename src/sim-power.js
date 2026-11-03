import { setupCanvas, makeSlider } from './util.js';

// ---- Chapter 7: Electric Power ----
export function mountPower(stage, controls, t) {
  const { ctx, W, H } = setupCanvas(stage, 680, 430);
  const state = { V: 12, R: 6 };
  controls.append(
    makeSlider({ label: t('lbl_V'), min: 1, max: 24, step: 0.5, value: state.V, unit: 'V', onInput: v => (state.V = v) }),
    makeSlider({ label: t('lbl_R'), min: 1, max: 30, step: 0.5, value: state.R, unit: 'Ω', onInput: v => (state.R = v) }),
  );

  const I = () => state.V / state.R;
  const P = () => (state.V * state.V) / state.R;

  // photons animation pool
  const photons = Array.from({ length: 40 }, () => ({
    a: Math.random() * Math.PI * 2, r: 30 + Math.random() * 70, s: 0.4 + Math.random() * 0.8, o: Math.random(),
  }));

  let lastT = performance.now();
  function draw(tm) {
    const dt = Math.min(0.05, (tm - lastT) / 1000); lastT = tm;
    ctx.clearRect(0, 0, W, H);
    const Ival = I(), Pval = P();
    const cx = 200, cy = 215;
    const pNorm = Math.min(1, Pval / 90);

    // glow
    const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 150);
    glow.addColorStop(0, `rgba(251,191,36,${0.12 + 0.5 * pNorm})`);
    glow.addColorStop(1, 'rgba(251,191,36,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, 150, 0, Math.PI * 2); ctx.fill();

    // bulb
    ctx.fillStyle = `rgba(${30 + 200 * pNorm},${26 + 150 * pNorm},${40 + 40 * pNorm},1)`;
    ctx.strokeStyle = 'rgba(230,237,247,.85)'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(cx, cy, 52, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(230,237,247,.55)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx - 26, cy + 36); ctx.lineTo(cx - 10, cy + 10); ctx.lineTo(cx - 18, cy - 4);
    ctx.moveTo(cx + 26, cy + 36); ctx.lineTo(cx + 10, cy + 10); ctx.lineTo(cx + 18, cy - 4); ctx.stroke();
    // base
    ctx.strokeStyle = 'rgba(230,237,247,.7)'; ctx.lineWidth = 2;
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(cx - 14, cy + 56 + k * 8); ctx.lineTo(cx + 14, cy + 56 + k * 8); ctx.stroke(); }

    // photons (more & faster with power)
    const n = Math.floor(pNorm * 40);
    for (let k = 0; k < n; k++) {
      const ph = photons[k];
      ph.a += ph.s * dt * (1 + pNorm * 3);
      ph.o += dt * 0.7;
      const alpha = 0.5 * (0.5 + 0.5 * Math.sin(ph.o * Math.PI * 2));
      ctx.fillStyle = `rgba(251,191,36,${alpha})`;
      const px = cx + Math.cos(ph.a) * (60 + ph.r * 0.6), py = cy + Math.sin(ph.a) * (60 + ph.r * 0.6);
      ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2); ctx.fill();
    }

    // circuit loop wires around bulb
    ctx.strokeStyle = 'rgba(230,237,247,.85)'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + 14, cy + 80); ctx.lineTo(cx + 14, 400); ctx.lineTo(360, 400); ctx.lineTo(360, 60); ctx.lineTo(40, 60); ctx.lineTo(40, 400); ctx.lineTo(cx - 14, 400); ctx.lineTo(cx - 14, cy + 80);
    ctx.stroke();
    // battery on top wire
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(170, 60); ctx.lineTo(198, 60); ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(176, 60); ctx.lineTo(192, 60); ctx.stroke();
    ctx.fillStyle = '#e6edf7'; ctx.font = '700 12px "Space Grotesk"'; ctx.textAlign = 'left';
    ctx.fillText('+', 158, 52); ctx.fillText(`V = ${state.V.toFixed(1)} V`, 214, 52);

    // electrons moving (speed ∝ I)
    const t2 = tm / 1000;
    const per = 26;
    for (let k = 0; k < 12; k++) {
      const s = (t2 * (14 + Ival * 26) + k * per * 4) % (per * 11);
      // path: start (40,400) right to (360,400), up to (360,60), left to (40,60), down
      let x, y;
      if (s < per * 4) { x = 40 + (s / (per * 4)) * 320; y = 400; }
      else if (s < per * 6.5) { x = 360; y = 400 - ((s - per * 4) / (per * 2.5)) * 340; }
      else if (s < per * 10.5) { x = 360 - ((s - per * 6.5) / (per * 4)) * 320; y = 60; }
      else { x = 40; y = 60 + ((s - per * 10.5) / (per * 0.5)) * 340; }
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill();
    }

    // right panel: P formulas
    const px = 430, py = 60;
    ctx.textAlign = 'left';
    const rows = [
      [`${t('row_current')} = V/R`, `${Ival.toFixed(2)} A`, '#e6edf7'],
      [`P = V·I`, `${Pval.toFixed(1)} W`, '#fbbf24'],
      ['P = I²R', `${(Ival * Ival * state.R).toFixed(1)} W`, '#67e8f9'],
      ['P = V²/R', `${(state.V * state.V / state.R).toFixed(1)} W`, '#5eead4'],
    ];
    rows.forEach((r, k) => {
      const y = py + k * 58;
      ctx.fillStyle = 'rgba(20,27,46,.85)'; ctx.strokeStyle = 'rgba(147,161,189,.35)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(px, y, 220, 46, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(147,161,189,.95)'; ctx.font = '12px "Space Grotesk"';
      ctx.fillText(r[0], px + 14, y + 18);
      ctx.fillStyle = r[2]; ctx.font = '700 16px "Space Grotesk"';
      ctx.fillText(r[1], px + 14, y + 38);
    });
    ctx.fillStyle = 'rgba(147,161,189,.9)'; ctx.font = '11.5px "Noto Sans SC"';
    ctx.fillText(t('power_note_1'), px, py + 4 * 58 + 12);
    ctx.fillText(t('power_note_2'), px, py + 4 * 58 + 30);
  }

  let raf;
  (function loop(t) { draw(t); raf = requestAnimationFrame(loop); })(lastT);
  return { destroy() { cancelAnimationFrame(raf); } };
}
