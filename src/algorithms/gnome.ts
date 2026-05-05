import type { Step } from '../types';

export function* gnomeSort(arr: number[]): Generator<Step> {
  const n = arr.length;
  let i = 0;
  while (i < n) {
    if (i === 0) {
      i++;
      continue;
    }
    yield { type: 'compare', i, j: i - 1 };
    if (arr[i] >= arr[i - 1]) {
      i++;
    } else {
      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      yield { type: 'swap', i, j: i - 1 };
      i--;
    }
  }
  yield { type: 'done' };
}
