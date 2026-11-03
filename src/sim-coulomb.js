import { K_COULOMB, setupCanvas, makeSlider, sci, drawArrow, chargeColor } from './util.js';

// ---- Chapter 1: Coulomb's Law ----
export function mountCoulomb(stage, controls, t) {
  const { ctx, W, H } = setupCanvas(stage, 680, 430);
  const state = { q1: 3, q2: -2, r: 1.8 }; // μC, m
  let drag = null;

  const sQ1 = makeSlider({ label: t('lbl_q1'), min: -8, max: 8, step: 0.5, value: state.q1, unit: 'μC', onInput: v => (state.q1 = v) });
  const sQ2 = makeSlider({ label: t('lbl_q2'), min: -8, max: 8, step: 0.5, value: state.q2, unit: 'μC', onInput: v => (state.q2 = v) });
  controls.append(sQ1, sQ2);

  const BASE_Y = 300, CX = 340;
  const pxPerM = 150;
  const x1 = () => CX - (state.r * pxPerM) / 2;
  const x2 = () => CX + (state.r * pxPerM) / 2;

  function forceN() {
    return (K_COULOMB * Math.abs(state.q1 * state.q2) * 1e-12) / (state.r * state.r);
  }
  const attract = () => state.q1 * state.q2 < 0;

  function pointerPos(e) {
    const rect = stage.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H };
  }
  stage.addEventListener('pointerdown', e => {
    const p = pointerPos(e);
    [[1, x1()], [2, x2()]].forEach(([id, x]) => {
      if (Math.hypot(p.x - x, p.y - BASE_Y) < 34) drag = id;
    });
    if (drag) stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    if (!drag) return;
    const p = pointerPos(e);
    if (drag === 1) state.r = Math.min(4.2, Math.max(0.5, ((x2() - p.x) * 2) / pxPerM));
    else state.r = Math.min(4.2, Math.max(0.5, ((p.x - x1()) * 2) / pxPerM));
  });
  stage.addEventListener('pointerup', () => (drag = null));

  function drawCharge(x, q, id) {
    const R = 24;
    const g = ctx.createRadialGradient(x - 6, BASE_Y - 8, 3, x, BASE_Y, R + 10);
    g.addColorStop(0, chargeColor(q));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, BASE_Y, R + 10, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#141b2e';
    ctx.strokeStyle = chargeColor(q); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(x, BASE_Y, R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = chargeColor(q);
    ctx.font = `700 ${q > 0 ? 22 : 24}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(q > 0 ? '+' : '−', x, BASE_Y + 1);
    ctx.fillStyle = 'rgba(230,237,247,.75)';
    ctx.font = '11px "Space Grotesk", sans-serif';
    ctx.fillText(`${id === 1 ? 'q₁' : 'q₂'} = ${q} μC`, x, BASE_Y + R + 16);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // distance ruler
    ctx.strokeStyle = 'rgba(147,161,189,.5)'; ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(x1(), BASE_Y); ctx.lineTo(x2(), BASE_Y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(230,237,247,.85)';
    ctx.font = '12px "Space Grotesk", sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`r = ${state.r.toFixed(2)} m`, CX, BASE_Y - 40);

    const F = forceN();
    const attractF = attract();
    const L = Math.min(120, 26 + F * 6e6);

    // force vectors
    if (F > 1e-9) {
      if (attractF) {
        drawArrow(ctx, x1(), BASE_Y, x1() + L, BASE_Y, '#67e8f9', 2.5);
        drawArrow(ctx, x2(), BASE_Y, x2() - L, BASE_Y, '#67e8f9', 2.5);
      } else {
        drawArrow(ctx, x1(), BASE_Y, x1() - L, BASE_Y, '#fb7185', 2.5);
        drawArrow(ctx, x2(), BASE_Y, x2() + L, BASE_Y, '#fb7185', 2.5);
      }
      ctx.font = '600 12px "Space Grotesk", sans-serif';
      ctx.fillStyle = attractF ? '#67e8f9' : '#fb7185';
      const ftxt = `${t('lbl_force')} = ${sci(F)} N`;
      ctx.fillText(ftxt, attractF ? x1() + L + 46 : x1() - L - 40, BASE_Y - 14);
    }

    drawCharge(x1(), state.q1, 1);
    drawCharge(x2(), state.q2, 2);

    // F–r graph (F ∝ 1/r²)
    const gx = 60, gy = 66, gw = 250, gh = 110;
    ctx.fillStyle = 'rgba(20,27,46,.75)';
    ctx.strokeStyle = 'rgba(147,161,189,.35)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(gx - 14, gy - 26, gw + 28, gh + 52, 10); ctx.fill(); ctx.stroke();
    const Fref = (K_COULOMB * 16e-12) / 0.25; // max curve value at r=0.5 with 4μC·4μC
    const Fcur = forceN();
    ctx.strokeStyle = 'rgba(103,232,249,.9)'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const r = 0.5 + (i / 100) * 3.7;
      const f = (K_COULOMB * Math.abs(state.q1 * state.q2) * 1e-12) / (r * r);
      const px = gx + ((r - 0.5) / 3.7) * gw;
      const py = gy + gh - Math.min(1, f / (Fref * 0.35)) * gh;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    const cxp = gx + ((state.r - 0.5) / 3.7) * gw;
    const cyp = gy + gh - Math.min(1, Fcur / (Fref * 0.35)) * gh;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(cxp, cyp, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(230,237,247,.8)';
    ctx.font = '11px "Space Grotesk", sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(t('curve_label'), gx, gy - 10);
    ctx.fillStyle = 'rgba(147,161,189,.9)';
    ctx.fillText(`${t('curve_current')} = ${sci(Fcur)} N`, gx, gy + gh + 20);
  }

  let raf;
  (function loop() { draw(); raf = requestAnimationFrame(loop); })();
  return { destroy() { cancelAnimationFrame(raf); } };
}
