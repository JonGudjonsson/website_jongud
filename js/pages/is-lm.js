/**
 * IS-LM Interactive Model
 * A simple Keynesian IS-LM diagram with adjustable parameters.
 *
 * Model:
 *   IS: Y = C0 + c(Y - T) + I0 - b*r + G   →  r = (C0 + I0 + G - c*T - (1-c)*Y) / b
 *   LM: M/P = kY - h*r                       →  r = (kY - M/P) / h
 *
 * Parameters (stylised):
 *   c  = MPC = 0.75
 *   b  = interest sensitivity of investment = 30
 *   k  = income sensitivity of money demand = 0.5
 *   h  = interest sensitivity of money demand = 20
 *   P  = price level = 1 (fixed short-run)
 */

(function () {
  const canvas = document.getElementById('islm-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Model parameters
  const c  = 0.75;
  const b  = 30;
  const k  = 0.5;
  const h  = 20;
  const P  = 1;
  const C0 = 20;
  const I0 = 40;

  // Chart bounds in model space
  const Y_MIN = 0, Y_MAX = 400;
  const R_MIN = 0, R_MAX = 12;

  // DOM state
  let G  = 100;
  let MS = 100;
  let T  = 30;

  // ── Model equations ────────────────────────────────────────
  const isR  = Y => (C0 + I0 + G - c * T - (1 - c) * Y) / b;
  const lmR  = Y => (k * Y - MS / P) / h;

  function equilibrium() {
    // Set IS = LM and solve for Y*
    // (C0 + I0 + G - cT - (1-c)Y) / b = (kY - M/P) / h
    // h(C0 + I0 + G - cT) - h(1-c)Y = bkY - bM/P
    // h(C0+I0+G-cT) + bM/P = Y[bk + h(1-c)]
    const num = h * (C0 + I0 + G - c * T) + b * (MS / P);
    const den = b * k + h * (1 - c);
    const Ystar = num / den;
    const Rstar = lmR(Ystar);
    return { Ystar, Rstar };
  }

  // ── Canvas helpers ─────────────────────────────────────────
  let W, H, pad;

  function toPixel(Y, R) {
    const x = pad.l + (Y - Y_MIN) / (Y_MAX - Y_MIN) * (W - pad.l - pad.r);
    const y = pad.t + (1 - (R - R_MIN) / (R_MAX - R_MIN)) * (H - pad.t - pad.b);
    return [x, y];
  }

  const COLORS = {
    is:   '#1a3a5c',
    lm:   '#7c3e2f',
    eq:   '#2a7a4b',
    grid: '#e2e0da',
    text: '#6b6b65',
    ink:  '#1a1a18',
  };

  function drawLine(points, color, dash = []) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash(dash);
    points.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawGrid() {
    const yTicks = [0, 100, 200, 300, 400];
    const rTicks = [0, 2, 4, 6, 8, 10, 12];

    ctx.font = `${12 * dpr}px DM Sans, sans-serif`;
    ctx.fillStyle = COLORS.text;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    rTicks.forEach(r => {
      const [x, y] = toPixel(Y_MIN, r);
      drawLine([[x, y], [toPixel(Y_MAX, r)[0], y]], COLORS.grid);
      ctx.fillText(r + '%', x - 8, y);
    });

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    yTicks.forEach(y => {
      const [px, py] = toPixel(y, R_MIN);
      ctx.fillText(y, px, py + 8);
    });

    // Axis labels
    ctx.fillStyle = COLORS.ink;
    ctx.font = `${13 * dpr}px DM Sans, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Output (Y)', W / 2, H - 12 * dpr);

    ctx.save();
    ctx.translate(16 * dpr, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Interest rate (r)', 0, 0);
    ctx.restore();
  }

  // ── Main draw ──────────────────────────────────────────────
  let dpr = 1;

  function draw() {
    const rect = canvas.parentElement.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    W = rect.width;
    H = Math.min(400, W * 0.65);

    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    pad = { l: 52, r: 30, t: 20, b: 48 };

    ctx.clearRect(0, 0, W, H);
    drawGrid();

    // IS curve
    const isPoints = [];
    for (let Y = Y_MIN; Y <= Y_MAX; Y += 2) {
      const r = isR(Y);
      if (r >= R_MIN - 1 && r <= R_MAX + 1) isPoints.push(toPixel(Y, r));
    }
    drawLine(isPoints, COLORS.is);

    // LM curve
    const lmPoints = [];
    for (let Y = Y_MIN; Y <= Y_MAX; Y += 2) {
      const r = lmR(Y);
      if (r >= R_MIN - 1 && r <= R_MAX + 1) lmPoints.push(toPixel(Y, r));
    }
    drawLine(lmPoints, COLORS.lm);

    // Labels
    ctx.font = `bold ${13 * dpr}px EB Garamond, serif`;
    ctx.fillStyle = COLORS.is;
    if (isPoints.length) {
      const last = isPoints[isPoints.length - 1];
      ctx.textAlign = 'left';
      ctx.fillText('IS', last[0] + 5, last[1]);
    }
    ctx.fillStyle = COLORS.lm;
    if (lmPoints.length) {
      const last = lmPoints[lmPoints.length - 1];
      ctx.textAlign = 'left';
      ctx.fillText('LM', last[0] + 5, last[1]);
    }

    // Equilibrium
    const { Ystar, Rstar } = equilibrium();
    if (Rstar >= R_MIN && Rstar <= R_MAX && Ystar >= Y_MIN && Ystar <= Y_MAX) {
      const [ex, ey] = toPixel(Ystar, Rstar);

      // Dashed drop lines
      drawLine([[ex, ey], [toPixel(Y_MIN, Rstar)[0], ey]], COLORS.eq, [4, 4]);
      drawLine([[ex, ey], [ex, toPixel(Ystar, R_MIN)[1]]], COLORS.eq, [4, 4]);

      // Dot
      ctx.beginPath();
      ctx.arc(ex, ey, 6, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.eq;
      ctx.fill();

      // Update display
      document.getElementById('eq-y').textContent = Ystar.toFixed(1);
      document.getElementById('eq-r').textContent = Rstar.toFixed(2) + '%';
    }
  }

  // ── Controls ───────────────────────────────────────────────
  function bindSlider(id, displayId, setter) {
    const el = document.getElementById(id);
    const disp = document.getElementById(displayId);
    if (!el) return;
    el.addEventListener('input', () => {
      setter(parseFloat(el.value));
      if (disp) disp.textContent = el.value;
      draw();
    });
    if (disp) disp.textContent = el.value;
  }

  bindSlider('g-slider',  'g-value',  v => { G  = v; });
  bindSlider('ms-slider', 'ms-value', v => { MS = v; });
  bindSlider('t-slider',  't-value',  v => { T  = v; });

  window.addEventListener('resize', draw);
  draw();
})();
