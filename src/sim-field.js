import { K_COULOMB, setupCanvas, makeSlider, makeSegment, sci, chargeColor } from './util.js';

// ---- Chapter 2: Electric Field ----
export function mountField(stage, controls, t) {
  const { ctx, W, H } = setupCanvas(stage, 680, 470);
  const state = {
    charges: [
      { q: 5, x: W * 0.38, y: H * 0.42 },
      { q: -5, x: W * 0.66, y: H * 0.6 },
    ],
    mode: 'vectors', // vectors | lines | test
    test: { x: W * 0.5, y: H * 0.85, vx: 0, vy: 0, trail: [] },
  };
  let dragIdx = -1, dragTest = false;

  const modeSeg = makeSegment({
    options: [
      { label: t('mode_vectors'), value: 'vectors' },
      { label: t('mode_lines'), value: 'lines' },
      { label: t('mode_test'), value: 'test' },
    ],
    value: 'vectors',
    onChange: v => { state.mode = v; state.test.trail = []; },
  });
  const mCtl = document.createElement('div'); mCtl.className = 'ctl'; mCtl.style.minWidth = '240px';
  mCtl.innerHTML = `<div class="ctl-row"><span>${t('lbl_show_mode')}</span></div>`;
  mCtl.appendChild(modeSeg);
  controls.appendChild(mCtl);

  const hint = document.createElement('p');
  hint.className = 'sim-note';
  hint.innerHTML = t('sim_drag_hint_field');
  controls.appendChild(hint);

  function fieldAt(x, y) {
    let ex = 0, ey = 0;
    for (const c of state.charges) {
      const dx = x - c.x, dy = y - c.y;
      const r2 = dx * dx + dy * dy + 60;
      const r = Math.sqrt(r2);
      const e = (K_COULOMB * c.q * 1e-6) / r2;
      ex += (e * dx) / r; ey += (e * dy) / r;
    }
    return { ex, ey };
  }

  function pointerPos(e) {
    const rect = stage.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H };
  }
  stage.addEventListener('pointerdown', e => {
    const p = pointerPos(e);
    dragIdx = state.charges.findIndex(c => Math.hypot(p.x - c.x, p.y - c.y) < 26);
    if (state.mode === 'test' && Math.hypot(p.x - state.test.x, p.y - state.test.y) < 16) dragTest = true;
    if (dragIdx === -1 && !dragTest && state.charges.length < 4) {
      state.charges.push({ q: 5, x: p.x, y: p.y });
      state.charges.push({ q: -5, x: Math.min(W - 30, p.x + 120), y: p.y });
      dragIdx = state.charges.length - 2;
    } else if (e.altKey && dragIdx !== -1) {
      state.charges.splice(dragIdx, 1); dragIdx = -1; return;
    }
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    const p = pointerPos(e);
    if (dragTest) { state.test.x = p.x; state.test.y = p.y; state.test.trail = []; return; }
    if (dragIdx >= 0) { state.charges[dragIdx].x = p.x; state.charges[dragIdx].y = p.y; }
  });
  stage.addEventListener('pointerup', () => { dragIdx = -1; dragTest = false; });

  function drawFieldLines() {
    ctx.lineWidth = 1.1;
    for (const c of state.charges) {
      const n = Math.min(16, Math.max(6, Math.round(Math.abs(c.q) * 2.4)));
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * Math.PI * 2 + (c.q > 0 ? 0 : Math.PI / n);
        let x = c.x + 15 * Math.cos(a0), y = c.y + 15 * Math.sin(a0);
        const dir = Math.sign(c.q);
        ctx.strokeStyle = c.q > 0 ? 'rgba(251,191,36,.55)' : 'rgba(56,189,248,.55)';
        ctx.beginPath(); ctx.moveTo(x, y);
        let steps = 0;
        while (steps++ < 220) {
          const f = fieldAt(x, y);
          const m = Math.hypot(f.ex, f.ey);
          if (m < 1e-4) break;
          x += (dir * f.ex * 5.5) / m; y += (dir * f.ey * 5.5) / m;
          ctx.lineTo(x, y);
          if (x < 4 || x > W - 4 || y < 4 || y > H - 4) break;
          const hit = state.charges.find(o => o !== c && Math.hypot(x - o.x, y - o.y) < 14);
          if (hit) break;
        }
        ctx.stroke();
      }
    }
  }

  function drawVectors() {
    const gap = 46;
    for (let gx = gap / 2; gx < W; gx += gap) {
      for (let gy = gap / 2; gy < H; gy += gap) {
        const f = fieldAt(gx, gy);
        const m = Math.hypot(f.ex, f.ey);
        if (m < 1e-3) continue;
        const L = Math.min(18, 4 + m * 4e6);
        const ux = (f.ex / m) * L, uy = (f.ey / m) * L;
        ctx.strokeStyle = 'rgba(103,232,249,.6)'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(gx - ux, gy - uy); ctx.lineTo(gx + ux, gy + uy); ctx.stroke();
        const a = Math.atan2(uy, ux);
        ctx.fillStyle = 'rgba(103,232,249,.6)';
        ctx.beginPath();
        ctx.moveTo(gx + ux, gy + uy);
        ctx.lineTo(gx + ux - 6 * Math.cos(a - 0.4), gy + uy - 6 * Math.sin(a - 0.4));
        ctx.lineTo(gx + ux - 6 * Math.cos(a + 0.4), gy + uy - 6 * Math.sin(a + 0.4));
        ctx.closePath(); ctx.fill();
      }
    }
  }

  let lastT = performance.now();
  function stepTest(dt) {
    const f = fieldAt(state.test.x, state.test.y);
    state.test.vx += f.ex * dt * 3.2e5;
    state.test.vy += f.ey * dt * 3.2e5;
    state.test.x += state.test.vx * dt * 60;
    state.test.y += state.test.vy * dt * 60;
    state.test.trail.push({ x: state.test.x, y: state.test.y });
    if (state.test.trail.length > 90) state.test.trail.shift();
    if (state.test.x < 8 || state.test.x > W - 8 || state.test.y < 8 || state.test.y > H - 8 ||
        state.charges.some(c => Math.hypot(state.test.x - c.x, state.test.y - c.y) < 18)) {
      state.test = { x: W * 0.5, y: H * 0.85, vx: 0, vy: 0, trail: [] };
    }
  }

  function draw(tm) {
    const dt = Math.min(0.05, (tm - lastT) / 1000); lastT = tm;
    ctx.clearRect(0, 0, W, H);
    if (state.mode === 'vectors') drawVectors();
    if (state.mode === 'lines') drawFieldLines();

    if (state.mode === 'test') {
      stepTest(dt);
      ctx.strokeStyle = 'rgba(94,234,212,.55)'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      state.test.trail.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
      const f = fieldAt(state.test.x, state.test.y);
      ctx.fillStyle = '#5eead4';
      ctx.beginPath(); ctx.arc(state.test.x, state.test.y, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(230,237,247,.9)'; ctx.font = '11px "Space Grotesk", sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(`|E| = ${sci(Math.hypot(f.ex, f.ey))} N/C`, 14, H - 14);
    }

    for (const c of state.charges) {
      const col = chargeColor(c.q);
      const g = ctx.createRadialGradient(c.x, c.y, 2, c.x, c.y, 30);
      g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.x, c.y, 30, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#141b2e'; ctx.strokeStyle = col; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(c.x, c.y, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = col; ctx.font = '700 18px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(c.q > 0 ? '+' : '−', c.x, c.y + 1);
      ctx.font = '10px "Space Grotesk", sans-serif'; ctx.textBaseline = 'alphabetic';
      ctx.fillText(`${c.q > 0 ? '+' : ''}${c.q} μC`, c.x, c.y + 32);
    }
  }

  let raf;
  (function loop(t) { draw(t); raf = requestAnimationFrame(loop); })(lastT);
  return { destroy() { cancelAnimationFrame(raf); } };
}
