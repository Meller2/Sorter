import type { Step } from '../types';

function* partition(
  arr: number[],
  lo: number,
  hi: number,
): Generator<Step, number> {
  const pivot = arr[hi];
  yield { type: 'highlight', indices: [hi] };
  let i = lo;
  for (let j = lo; j < hi; j++) {
    yield { type: 'compare', i: j, j: hi };
    if (arr[j] < pivot) {
      if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield { type: 'swap', i, j };
      }
      i++;
    }
  }
  if (i !== hi) {
    [arr[i], arr[hi]] = [arr[hi], arr[i]];
    yield { type: 'swap', i, j: hi };
  }
  return i;
}

function* quick(arr: number[], lo: number, hi: number): Generator<Step> {
  if (lo >= hi) return;
  const p: number = yield* partition(arr, lo, hi);
  yield* quick(arr, lo, p - 1);
  yield* quick(arr, p + 1, hi);
}

export function* quickSort(arr: number[]): Generator<Step> {
  yield* quick(arr, 0, arr.length - 1);
  yield { type: 'done' };
}
