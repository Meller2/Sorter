import type { Step } from '../types';

export function* insertionSort(arr: number[]): Generator<Step> {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      yield { type: 'compare', i: j, j: j - 1 };
      if (arr[j] < arr[j - 1]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
        yield { type: 'swap', i: j, j: j - 1 };
        j--;
      } else {
        break;
      }
    }
  }
  yield { type: 'done' };
}
