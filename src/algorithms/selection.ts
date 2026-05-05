import type { Step } from '../types';

export function* selectionSort(arr: number[]): Generator<Step> {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', i: minIdx, j };
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { type: 'swap', i, j: minIdx };
    }
  }
  yield { type: 'done' };
}
