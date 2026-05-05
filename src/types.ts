export type Step =
  | { type: 'compare'; i: number; j: number }
  | { type: 'swap'; i: number; j: number }
  | { type: 'set'; i: number; value: number }
  | { type: 'highlight'; indices: number[] }
  | { type: 'done' };

export type SortGen = (arr: number[]) => Generator<Step, void, void>;

export type AlgorithmInfo = {
  id: string;
  name: string;
  short: string;
  best: string;
  avg: string;
  worst: string;
  space: string;
  stable: boolean;
  description: string;
  fn: SortGen;
};

export type Distribution =
  | 'random'
  | 'nearly-sorted'
  | 'reversed'
  | 'few-unique'
  | 'sawtooth';

export type ViewMode = 'bars' | 'circle' | 'dots' | 'rainbow';
