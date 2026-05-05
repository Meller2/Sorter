import type { Step } from '../types';

export function* combSort(arr: number[]): Generator<Step> {
  const n = arr.length;
  let gap = n;
  const shrink = 1.3;
  let sorted = false;
  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }
    for (let i = 0; i + gap < n; i++) {
      yield { type: 'compare', i, j: i + gap };
      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        yield { type: 'swap', i, j: i + gap };
        sorted = false;
      }
    }
  }
  yield { type: 'done' };
}
