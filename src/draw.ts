import type { ViewMode } from './types';

export type DrawState = {
  arr: number[];
  active: Set<number>;
  pivots: Set<number>;
  sortedFrom: number;
  sortedTo: number;
  done: boolean;
};

const COLORS = {
  bar: '#6c8aff',
  active: '#ff4d6d',
  pivot: '#ffd166',
  sorted: '#10b981',
  done: '#22c55e',
  bg: 'transparent',
};

function colorFor(
  i: number,
  state: DrawState,
  total: number,
  mode: ViewMode,
): string {
  if (state.active.has(i)) return COLORS.active;
  if (state.pivots.has(i)) return COLORS.pivot;
  const inSorted =
    state.done ||
    (state.sortedFrom <= i && i <= state.sortedTo);
  if (inSorted) return COLORS.sorted;
  if (mode === 'rainbow') {
    const v = state.arr[i] ?? 0;
    const hue = total > 0 ? (v / total) * 320 : 0;
    return `hsl(${hue} 80% 60%)`;
  }
  return COLORS.bar;
}

export function draw(
  canvas: HTMLCanvasElement,
  state: DrawState,
  mode: ViewMode,
  maxValue: number,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  const w = cssW * dpr;
  const h = cssH * dpr;
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);

  const n = state.arr.length;
  if (n === 0 || maxValue <= 0) return;

  if (mode === 'bars' || mode === 'rainbow') {
    drawBars(ctx, state, cssW, cssH, n, maxValue, mode);
  } else if (mode === 'circle') {
    drawCircle(ctx, state, cssW, cssH, n, maxValue);
  } else {
    drawDots(ctx, state, cssW, cssH, n, maxValue);
  }
}

function drawBars(
  ctx: CanvasRenderingContext2D,
  state: DrawState,
  w: number,
  h: number,
  n: number,
  maxValue: number,
  mode: ViewMode,
): void {
  const barW = w / n;
  for (let i = 0; i < n; i++) {
    const v = state.arr[i];
    const bh = (v / maxValue) * (h - 6);
    ctx.fillStyle = colorFor(i, state, maxValue, mode);
    const x = i * barW;
    const y = h - bh;
    const drawW = Math.max(1, barW - (n > 200 ? 0 : 1));
    ctx.fillRect(x, y, drawW, bh);
  }
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  state: DrawState,
  w: number,
  h: number,
  n: number,
  maxValue: number,
): void {
  const cx = w / 2;
  const cy = h / 2;
  const rMax = Math.min(w, h) / 2 - 4;
  const rMin = rMax * 0.18;
  const step = (Math.PI * 2) / n;
  for (let i = 0; i < n; i++) {
    const v = state.arr[i];
    const r = rMin + (v / maxValue) * (rMax - rMin);
    const a0 = -Math.PI / 2 + i * step;
    const a1 = a0 + step + 0.001;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a0, a1);
    ctx.closePath();
    ctx.fillStyle = colorFor(i, state, maxValue, 'rainbow');
    if (state.active.has(i)) ctx.fillStyle = COLORS.active;
    else if (state.pivots.has(i)) ctx.fillStyle = COLORS.pivot;
    ctx.fill();
  }
}

function drawDots(
  ctx: CanvasRenderingContext2D,
  state: DrawState,
  w: number,
  h: number,
  n: number,
  maxValue: number,
): void {
  const colW = w / n;
  const radius = Math.max(1.5, Math.min(colW * 0.45, 5));
  for (let i = 0; i < n; i++) {
    const v = state.arr[i];
    const y = h - (v / maxValue) * (h - 6) - 3;
    const x = i * colW + colW / 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = colorFor(i, state, maxValue, 'rainbow');
    if (state.active.has(i)) ctx.fillStyle = COLORS.active;
    else if (state.pivots.has(i)) ctx.fillStyle = COLORS.pivot;
    ctx.fill();
  }
}
