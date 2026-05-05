import type { Step } from '../types';

export function* cocktailSort(arr: number[]): Generator<Step> {
  let lo = 0;
  let hi = arr.length - 1;
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = lo; i < hi; i++) {
      yield { type: 'compare', i, j: i + 1 };
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        yield { type: 'swap', i, j: i + 1 };
        swapped = true;
      }
    }
    if (!swapped) break;
    swapped = false;
    hi--;
    for (let i = hi; i > lo; i--) {
      yield { type: 'compare', i, j: i - 1 };
      if (arr[i] < arr[i - 1]) {
        [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
        yield { type: 'swap', i, j: i - 1 };
        swapped = true;
      }
    }
    lo++;
  }
  yield { type: 'done' };
}
