import type { Step } from '../types';

export function* radixSort(arr: number[]): Generator<Step> {
  const n = arr.length;
  if (n === 0) {
    yield { type: 'done' };
    return;
  }
  let max = arr[0];
  for (let i = 1; i < n; i++) {
    yield { type: 'compare', i, j: 0 };
    if (arr[i] > max) max = arr[i];
  }
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    for (let i = 0; i < n; i++) {
      yield { type: 'highlight', indices: [i] };
      const d = Math.floor(arr[i] / exp) % 10;
      buckets[d].push(arr[i]);
    }
    let k = 0;
    for (const bucket of buckets) {
      for (const v of bucket) {
        arr[k] = v;
        yield { type: 'set', i: k, value: v };
        k++;
      }
    }
  }
  yield { type: 'done' };
}
