import type { Distribution } from './types';

export function generateArray(size: number, dist: Distribution): number[] {
  const arr = Array.from({ length: size }, (_, i) => i + 1);
  switch (dist) {
    case 'random':
      shuffle(arr);
      return arr;
    case 'reversed':
      arr.reverse();
      return arr;
    case 'nearly-sorted': {
      const swaps = Math.max(1, Math.floor(size * 0.05));
      for (let s = 0; s < swaps; s++) {
        const i = Math.floor(Math.random() * size);
        const j = Math.floor(Math.random() * size);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    case 'few-unique': {
      const unique = Math.max(3, Math.min(8, Math.floor(size / 20)));
      const buckets = Array.from(
        { length: unique },
        (_, i) => Math.floor(((i + 1) / unique) * size),
      );
      const out = Array.from(
        { length: size },
        () => buckets[Math.floor(Math.random() * unique)],
      );
      return out;
    }
    case 'sawtooth': {
      const teeth = Math.max(2, Math.floor(size / 12));
      return Array.from({ length: size }, (_, i) =>
        ((i % teeth) + 1) * Math.floor(size / teeth),
      );
    }
  }
}

function shuffle<T>(a: T[]): void {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}
