import type { Step, SortGen } from './types';

export type RunnerStats = {
  comparisons: number;
  swaps: number;
  writes: number;
  steps: number;
  done: boolean;
};

export class Runner {
  private gen: Generator<Step, void, void>;
  private arr: number[];
  private maxValue: number;
  private active: Set<number> = new Set();
  private pivots: Set<number> = new Set();
  private done = false;
  private stats: RunnerStats = {
    comparisons: 0,
    swaps: 0,
    writes: 0,
    steps: 0,
    done: false,
  };
  private lastValue = 0;
  private onTone?: (value: number) => void;

  constructor(
    fn: SortGen,
    initial: number[],
    onTone?: (value: number) => void,
  ) {
    this.arr = initial.slice();
    this.maxValue = Math.max(1, ...this.arr);
    this.gen = fn(this.arr);
    this.onTone = onTone;
  }

  getArray(): readonly number[] {
    return this.arr;
  }

  getMaxValue(): number {
    return this.maxValue;
  }

  getActive(): ReadonlySet<number> {
    return this.active;
  }

  getPivots(): ReadonlySet<number> {
    return this.pivots;
  }

  isDone(): boolean {
    return this.done;
  }

  getStats(): RunnerStats {
    return this.stats;
  }

  getLastValue(): number {
    return this.lastValue;
  }

  // Run up to `n` steps. Returns true if anything changed (or done flips).
  step(n: number): boolean {
    if (this.done) return false;
    this.active.clear();
    let changed = false;
    for (let k = 0; k < n; k++) {
      const r = this.gen.next();
      if (r.done) {
        this.done = true;
        this.stats.done = true;
        changed = true;
        break;
      }
      changed = true;
      this.stats.steps++;
      const s = r.value;
      switch (s.type) {
        case 'compare':
          this.stats.comparisons++;
          this.active.add(s.i);
          this.active.add(s.j);
          this.lastValue = this.arr[s.i] ?? 0;
          this.onTone?.(this.lastValue);
          break;
        case 'swap':
          this.stats.swaps++;
          this.stats.writes += 2;
          this.active.add(s.i);
          this.active.add(s.j);
          this.lastValue = this.arr[s.i] ?? 0;
          this.onTone?.(this.lastValue);
          break;
        case 'set':
          this.stats.writes++;
          this.active.add(s.i);
          this.lastValue = s.value;
          this.onTone?.(this.lastValue);
          break;
        case 'highlight':
          this.pivots = new Set(s.indices);
          break;
        case 'done':
          this.done = true;
          this.stats.done = true;
          break;
      }
    }
    return changed;
  }
}
