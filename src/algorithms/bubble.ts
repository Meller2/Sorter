import type { Step } from '../types';

export function* bubbleSort(arr: number[]): Generator<Step> {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      yield { type: 'compare', i: j, j: j + 1 };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { type: 'swap', i: j, j: j + 1 };
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  yield { type: 'done' };
}
