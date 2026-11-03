import { K_COULOMB, setupCanvas, sci } from './util.js';

// ---- Chapter 3: Electric Potential ----
export function mountPotential(stage, controls, t) {
  const { ctx, W, H } = setupCanvas(stage, 680, 470);
  const M_PER_PX = 0.01; // 1 px = 1 cm
  const state = {
    charges: [
      { q: 4, x: W * 0.36, y: H * 0.4 },
      { q: -4, x: W * 0.68, y: H * 0.58 },
    ],
    probe: { x: W * 0.5, y: H * 0.8 },
    showContours: true,
  };
  let dragIdx = -1, dragProbe = false, dirty = true;

  const hint = document.createElement('p');
  hint.className = 'sim-note';
  hint.innerHTML = t('sim_drag_hint_potential');
  controls.appendChild(hint);

  const cell = 5;
  const gw = Math.ceil(W / cell), gh = Math.ceil(H / cell);
  const off = document.createElement('canvas');
  off.width = gw; off.height = gh;
  const offCtx = off.getContext('2d');
  const img = offCtx.createImageData(gw, gh);

  function potentialAt(x, y) {
    let v = 0;
    for (const c of state.charges) {
      const r = Math.max(6, Math.hypot(x - c.x, y - c.y)) * M_PER_PX;
      v += (K_COULOMB * c.q * 1e-6) / r;
    }
    return v;
  }

  // signed-sqrt tone mapping keeps sign, compresses magnitude
  function tone(v) {
    return Math.sign(v) * Math.sqrt(Math.min(1, Math.abs(v) / 1.2e6));
  }

  function renderHeat() {
    const d = img.data;
    let i = 0;
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        const t = tone(potentialAt(x * cell, y * cell));
        let r, g, b;
        if (t >= 0) { r = 20 + 215 * t; g = 22 + 120 * t * t; b = 38 - 10 * t; }
        else { const a = -t; r = 20 + 40 * a * a; g = 24 + 130 * a; b = 40 + 205 * a; }
        d[i++] = r; d[i++] = g; d[i++] = b; d[i++] = 255;
      }
    }
    offCtx.putImageData(img, 0, 0);
  }

  const LEVELS = [3e5, 1.5e5, 6e4, 2e4, -2e4, -6e4, -1.5e5, -3e5];
  function drawContours() {
    ctx.lineWidth = 1;
    for (const L of LEVELS) {
      ctx.strokeStyle = L > 0 ? 'rgba(255,240,214,.34)' : 'rgba(214,240,255,.34)';
      ctx.beginPath();
      for (let gy = 0; gy < gh - 1; gy++) {
        for (let gx = 0; gx < gw - 1; gx++) {
          const x0 = gx * cell, y0 = gy * cell;
          const v00 = potentialAt(x0, y0), v10 = potentialAt(x0 + cell, y0);
          const v01 = potentialAt(x0, y0 + cell), v11 = potentialAt(x0 + cell, y0 + cell);
          const pts = [];
          const interp = (a, b) => (L - a) / (b - a);
          if ((v00 - L) * (v10 - L) < 0) pts.push([x0 + cell * interp(v00, v10), y0]);
          if ((v10 - L) * (v11 - L) < 0) pts.push([x0 + cell, y0 + cell * interp(v10, v11)]);
          if ((v01 - L) * (v11 - L) < 0) pts.push([x0 + cell * interp(v01, v11), y0 + cell]);
          if ((v00 - L) * (v01 - L) < 0) pts.push([x0, y0 + cell * interp(v00, v01)]);
          if (pts.length >= 2) {
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
            if (pts.length === 4) { ctx.moveTo(pts[2][0], pts[2][1]); ctx.lineTo(pts[3][0], pts[3][1]); }
          }
        }
      }
      ctx.stroke();
    }
  }

  function pointerPos(e) {
    const rect = stage.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H };
  }
  stage.addEventListener('pointerdown', e => {
    const p = pointerPos(e);
    dragProbe = Math.hypot(p.x - state.probe.x, p.y - state.probe.y) < 16;
    dragIdx = state.charges.findIndex(c => Math.hypot(p.x - c.x, p.y - c.y) < 24);
    if (e.altKey && dragIdx !== -1) { state.charges.splice(dragIdx, 1); dragIdx = -1; dirty = true; return; }
    if (dragIdx === -1 && !dragProbe && state.charges.length < 4) {
      state.charges.push({ q: 4, x: p.x, y: p.y }, { q: -4, x: Math.min(W - 30, p.x + 130), y: p.y });
      dragIdx = state.charges.length - 2; dirty = true;
    }
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    const p = pointerPos(e);
    if (dragProbe) { state.probe.x = p.x; state.probe.y = p.y; return; }
    if (dragIdx >= 0) { state.charges[dragIdx].x = p.x; state.charges[dragIdx].y = p.y; dirty = true; }
  });
  stage.addEventListener('pointerup', () => { dragIdx = -1; dragProbe = false; });

  function draw() {
    if (dirty) { renderHeat(); dirty = false; }
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(off, 0, 0, W, H);
    if (state.showContours) drawContours();

    for (const c of state.charges) {
      const col = c.q > 0 ? '#fbbf24' : '#38bdf8';
      ctx.fillStyle = '#141b2e'; ctx.strokeStyle = col; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(c.x, c.y, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = col; ctx.font = '700 16px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(c.q > 0 ? '+' : '−', c.x, c.y + 1);
    }
    // probe
    const pv = potentialAt(state.probe.x, state.probe.y);
    ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(state.probe.x, state.probe.y, 9, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(state.probe.x - 14, state.probe.y); ctx.lineTo(state.probe.x + 14, state.probe.y);
    ctx.moveTo(state.probe.x, state.probe.y - 14); ctx.lineTo(state.probe.x, state.probe.y + 14); ctx.stroke();
    ctx.fillStyle = 'rgba(20,27,46,.85)';
    const label = `V = ${sci(pv)} V`;
    ctx.font = '600 12px "Space Grotesk", sans-serif';
    const tw = ctx.measureText(label).width;
    const lx = Math.min(W - tw - 24, state.probe.x + 14), ly = Math.max(20, state.probe.y - 30);
    ctx.beginPath(); ctx.roundRect(lx - 7, ly - 14, tw + 14, 22, 6); ctx.fill();
    ctx.fillStyle = '#5eead4'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(label, lx, ly + 2);
  }

  let raf;
  (function loop() { draw(); raf = requestAnimationFrame(loop); })();
  return { destroy() { cancelAnimationFrame(raf); } };
}
