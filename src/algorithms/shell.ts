import type { Step } from '../types';

export function* shellSort(arr: number[]): Generator<Step> {
  const n = arr.length;
  // Ciura gap sequence (good practical performance)
  const gaps = [701, 301, 132, 57, 23, 10, 4, 1].filter((g) => g < n);
  if (gaps.length === 0) gaps.push(1);
  for (const gap of gaps) {
    for (let i = gap; i < n; i++) {
      const tmp = arr[i];
      let j = i;
      while (j >= gap) {
        yield { type: 'compare', i: j, j: j - gap };
        if (arr[j - gap] > tmp) {
          arr[j] = arr[j - gap];
          yield { type: 'set', i: j, value: arr[j] };
          j -= gap;
        } else {
          break;
        }
      }
      if (j !== i) {
        arr[j] = tmp;
        yield { type: 'set', i: j, value: tmp };
      }
    }
  }
  yield { type: 'done' };
}
