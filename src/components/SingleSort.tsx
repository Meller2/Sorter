import { useEffect, useMemo, useRef, useState } from 'react';
import type { AlgorithmInfo, ViewMode } from '../types';
import { Runner } from '../runner';
import { SortCanvas } from './SortCanvas';
import { Stats } from './Stats';
import { playTone } from '../audio';

type Props = {
  algorithm: AlgorithmInfo;
  array: number[];
  speed: number;
  viewMode: ViewMode;
  running: boolean;
  resetKey: number;
  onDone?: () => void;
};

export function SingleSort({
  algorithm,
  array,
  speed,
  viewMode,
  running,
  resetKey,
  onDone,
}: Props) {
  const runner = useMemo(() => {
    const max = Math.max(1, ...array);
    return new Runner(algorithm.fn, array, (v) => playTone(v, max));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm.id, resetKey]);

  const startRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);
  const [, force] = useState(0);
  const doneNotified = useRef(false);

  useEffect(() => {
    let raf = 0;
    let lastTime = performance.now();
    if (running && startRef.current == null) startRef.current = lastTime;

    const tick = (t: number) => {
      const dt = t - lastTime;
      lastTime = t;
      if (running && !runner.isDone()) {
        runner.step(speed);
        elapsedRef.current += dt;
        if (runner.isDone() && !doneNotified.current) {
          doneNotified.current = true;
          onDone?.();
        }
      }
      force((x) => (x + 1) & 0xffff);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [runner, speed, running, onDone]);

  useEffect(() => {
    elapsedRef.current = 0;
    startRef.current = null;
    doneNotified.current = false;
  }, [resetKey, algorithm.id]);

  return (
    <div className="single-sort">
      <div className="canvas-wrap">
        <SortCanvas runner={runner} viewMode={viewMode} className="canvas" />
      </div>
      <Stats
        algorithm={algorithm}
        stats={runner.getStats()}
        elapsedMs={elapsedRef.current}
      />
    </div>
  );
}
