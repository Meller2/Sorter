import type { Step } from '../types';

function* siftDown(
  arr: number[],
  start: number,
  end: number,
): Generator<Step> {
  let root = start;
  while (root * 2 + 1 <= end) {
    const child = root * 2 + 1;
    let swap = root;
    yield { type: 'compare', i: swap, j: child };
    if (arr[swap] < arr[child]) swap = child;
    if (child + 1 <= end) {
      yield { type: 'compare', i: swap, j: child + 1 };
      if (arr[swap] < arr[child + 1]) swap = child + 1;
    }
    if (swap === root) return;
    [arr[root], arr[swap]] = [arr[swap], arr[root]];
    yield { type: 'swap', i: root, j: swap };
    root = swap;
  }
}

export function* heapSort(arr: number[]): Generator<Step> {
  const n = arr.length;
  // build max-heap
  for (let start = (n - 2) >> 1; start >= 0; start--) {
    yield* siftDown(arr, start, n - 1);
  }
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    yield { type: 'swap', i: 0, j: end };
    yield* siftDown(arr, 0, end - 1);
  }
  yield { type: 'done' };
}
