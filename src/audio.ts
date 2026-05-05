type AudioCtxLike = AudioContext;

let ctx: AudioCtxLike | null = null;
let master: GainNode | null = null;
let muted = true;
let volume = 0.15;

function ensureCtx(): AudioCtxLike | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
  }
  return ctx;
}

export function setMuted(value: boolean): void {
  muted = value;
  if (value) return;
  ensureCtx()?.resume().catch(() => undefined);
}

export function isMuted(): boolean {
  return muted;
}

export function setVolume(v: number): void {
  volume = Math.max(0, Math.min(1, v));
  if (master) master.gain.value = volume;
}

let lastTime = 0;
const MIN_INTERVAL = 0.004; // ~250 voices/sec ceiling

export function playTone(value: number, max: number, duration = 0.05): void {
  if (muted) return;
  const c = ensureCtx();
  if (!c || !master) return;
  const now = c.currentTime;
  // Throttle so we never blow up the graph at high speeds.
  const start = Math.max(now, lastTime + MIN_INTERVAL);
  lastTime = start;
  const ratio = max > 0 ? value / max : 0;
  const freq = 180 + ratio * 880;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(0.6, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain).connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}
