import type { AlgorithmInfo } from '../types';
import { bubbleSort } from './bubble';
import { cocktailSort } from './cocktail';
import { insertionSort } from './insertion';
import { selectionSort } from './selection';
import { quickSort } from './quick';
import { mergeSort } from './merge';
import { heapSort } from './heap';
import { shellSort } from './shell';
import { radixSort } from './radix';
import { combSort } from './comb';
import { gnomeSort } from './gnome';

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'quick',
    name: 'Quick Sort',
    short: 'quick',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    stable: false,
    description:
      'Divide & conquer using a pivot. Lomuto partitioning. Fast in practice; quadratic on adversarial inputs.',
    fn: quickSort,
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    short: 'merge',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    stable: true,
    description:
      'Divide & conquer with linear merge. Stable, predictable, but uses extra memory.',
    fn: mergeSort,
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    short: 'heap',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(1)',
    stable: false,
    description:
      'Build a max-heap, then repeatedly extract the max. In-place, no quadratic worst case.',
    fn: heapSort,
  },
  {
    id: 'shell',
    name: 'Shell Sort',
    short: 'shell',
    best: 'O(n log n)',
    avg: '~O(n^1.3)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: false,
    description:
      'Generalized insertion sort with shrinking gap (Ciura sequence). Surprisingly fast for medium arrays.',
    fn: shellSort,
  },
  {
    id: 'radix',
    name: 'Radix Sort (LSD)',
    short: 'radix',
    best: 'O(n·k)',
    avg: 'O(n·k)',
    worst: 'O(n·k)',
    space: 'O(n + k)',
    stable: true,
    description:
      'Non-comparative. Sorts by digits from least to most significant. k = number of digits.',
    fn: radixSort,
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    short: 'insert',
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    description:
      'Builds sorted prefix one element at a time. Excellent on small or nearly-sorted arrays.',
    fn: insertionSort,
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    short: 'select',
    best: 'O(n²)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: false,
    description:
      'Repeatedly selects the minimum from the unsorted suffix. Few writes, but always quadratic comparisons.',
    fn: selectionSort,
  },
  {
    id: 'bubble',
    name: 'Bubble Sort',
    short: 'bubble',
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    description:
      'Repeatedly swaps adjacent out-of-order pairs. Classic teaching algorithm; rarely useful in practice.',
    fn: bubbleSort,
  },
  {
    id: 'cocktail',
    name: 'Cocktail Shaker',
    short: 'cocktail',
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    description:
      'Bidirectional bubble sort. Slightly better at handling small turtles & rabbits.',
    fn: cocktailSort,
  },
  {
    id: 'comb',
    name: 'Comb Sort',
    short: 'comb',
    best: 'O(n log n)',
    avg: 'Ω(n²/2^p)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: false,
    description:
      'Bubble sort with a shrinking gap (1.3). Eliminates "turtles" early, then finishes as bubble sort.',
    fn: combSort,
  },
  {
    id: 'gnome',
    name: 'Gnome Sort',
    short: 'gnome',
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    description:
      'Walks forward, swaps backward when out of order. Garden gnome sorting flowerpots.',
    fn: gnomeSort,
  },
];

export function getAlgorithm(id: string): AlgorithmInfo {
  const a = ALGORITHMS.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown algorithm: ${id}`);
  return a;
}
