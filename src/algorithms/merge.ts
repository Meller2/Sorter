import type { Step } from '../types';

function* merge(
  arr: number[],
  lo: number,
  mid: number,
  hi: number,
): Generator<Step> {
  const left = arr.slice(lo, mid + 1);
  const right = arr.slice(mid + 1, hi + 1);
  let i = 0;
  let j = 0;
  let k = lo;
  while (i < left.length && j < right.length) {
    yield { type: 'compare', i: lo + i, j: mid + 1 + j };
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      yield { type: 'set', i: k, value: left[i] };
      i++;
    } else {
      arr[k] = right[j];
      yield { type: 'set', i: k, value: right[j] };
      j++;
    }
    k++;
  }
  while (i < left.length) {
    arr[k] = left[i];
    yield { type: 'set', i: k, value: left[i] };
    i++;
    k++;
  }
  while (j < right.length) {
    arr[k] = right[j];
    yield { type: 'set', i: k, value: right[j] };
    j++;
    k++;
  }
}

function* mergeRec(
  arr: number[],
  lo: number,
  hi: number,
): Generator<Step> {
  if (lo >= hi) return;
  const mid = (lo + hi) >> 1;
  yield* mergeRec(arr, lo, mid);
  yield* mergeRec(arr, mid + 1, hi);
  yield* merge(arr, lo, mid, hi);
}

export function* mergeSort(arr: number[]): Generator<Step> {
  yield* mergeRec(arr, 0, arr.length - 1);
  yield { type: 'done' };
}
