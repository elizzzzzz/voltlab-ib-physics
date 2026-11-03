// VoltLab shared utilities
export const K_COULOMB = 8.99e9; // N·m²/C²
export const E_CHARGE = 1.602e-19; // C

export function setupCanvas(canvas, logicalW, logicalH) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(logicalW * dpr);
  canvas.height = Math.round(logicalH * dpr);
  canvas.style.aspectRatio = `${logicalW} / ${logicalH}`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, W: logicalW, H: logicalH };
}

export function makeSlider({ label, min, max, step = 1, value, unit = '', onInput }) {
  const wrap = document.createElement('div');
  wrap.className = 'ctl';
  wrap.innerHTML = `
    <div class="ctl-row"><span>${label}</span><output></output></div>
    <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${label}">
  `;
  const input = wrap.querySelector('input');
  const output = wrap.querySelector('output');
  const fmt = v => `${(+v).toLocaleString('en-US', { maximumSignificantDigits: 4 })}${unit ? ' ' + unit : ''}`;
  output.textContent = fmt(value);
  input.addEventListener('input', () => {
    output.textContent = fmt(input.value);
    onInput(parseFloat(input.value));
  });
  wrap.setValue = v => { input.value = v; output.textContent = fmt(v); onInput(parseFloat(v)); };
  wrap.getValue = () => parseFloat(input.value);
  return wrap;
}

export function makeSegment({ options, value, onChange }) {
  const seg = document.createElement('div');
  seg.className = 'seg';
  seg.setAttribute('role', 'group');
  options.forEach(opt => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = opt.label;
    b.setAttribute('aria-pressed', String(opt.value === value));
    b.addEventListener('click', () => {
      seg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      onChange(opt.value);
    });
    seg.appendChild(b);
  });
  seg.setValue = v => {
    seg.querySelectorAll('button').forEach((x, i) => x.setAttribute('aria-pressed', String(options[i].value === v)));
    onChange(v);
  };
  return seg;
}

export function sci(x, digits = 3) {
  if (!isFinite(x)) return '—';
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e5 || a < 1e-2)) return x.toExponential(digits - 1).replace('e+', '×10^').replace('e-0', '×10^-').replace('e-', '×10^-');
  return (+x.toPrecision(digits)).toString();
}

export function drawArrow(ctx, x1, y1, x2, y2, color, width = 2, head = 7) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(ang - 0.42), y2 - head * Math.sin(ang - 0.42));
  ctx.lineTo(x2 - head * Math.cos(ang + 0.42), y2 - head * Math.sin(ang + 0.42));
  ctx.closePath(); ctx.fill();
}

export function chargeColor(q) {
  return q > 0 ? '#fbbf24' : '#38bdf8';
}
