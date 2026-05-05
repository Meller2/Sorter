import { useEffect, useMemo, useRef, useState } from 'react';
import type { AlgorithmInfo, ViewMode } from '../types';
import { Runner } from '../runner';
import { SortCanvas } from './SortCanvas';
import { playTone } from '../audio';

type Props = {
  algorithms: AlgorithmInfo[];
  array: number[];
  speed: number;
  viewMode: ViewMode;
  running: boolean;
  resetKey: number;
};

type Track = {
  algo: AlgorithmInfo;
  runner: Runner;
  finishedAtMs: number | null;
  rank: number | null;
};

export function RaceMode({
  algorithms,
  array,
  speed,
  viewMode,
  running,
  resetKey,
}: Props) {
  const tracks = useMemo<Track[]>(() => {
    const max = Math.max(1, ...array);
    // Only the first track makes sound to avoid cacophony.
    return algorithms.map((algo, idx) => ({
      algo,
      runner: new Runner(
        algo.fn,
        array,
        idx === 0 ? (v) => playTone(v, max) : undefined,
      ),
      finishedAtMs: null,
      rank: null,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithms.map((a) => a.id).join(','), resetKey]);

  const elapsedRef = useRef(0);
  const nextRankRef = useRef(1);
  const [, force] = useState(0);

  useEffect(() => {
    let raf = 0;
    let lastTime = performance.now();
    const tick = (t: number) => {
      const dt = t - lastTime;
      lastTime = t;
      if (running) {
        elapsedRef.current += dt;
        for (const tr of tracks) {
          if (tr.runner.isDone()) {
            if (tr.finishedAtMs == null) {
              tr.finishedAtMs = elapsedRef.current;
              tr.rank = nextRankRef.current++;
            }
            continue;
          }
          tr.runner.step(speed);
          if (tr.runner.isDone() && tr.finishedAtMs == null) {
            tr.finishedAtMs = elapsedRef.current;
            tr.rank = nextRankRef.current++;
          }
        }
      }
      force((x) => (x + 1) & 0xffff);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tracks, speed, running]);

  useEffect(() => {
    elapsedRef.current = 0;
    nextRankRef.current = 1;
  }, [resetKey, algorithms.length]);

  if (tracks.length === 0) {
    return (
      <div className="race-empty">
        Select at least one algorithm to start a race.
      </div>
    );
  }

  return (
    <div className="race-grid" data-count={tracks.length}>
      {tracks.map((tr) => {
        const stats = tr.runner.getStats();
        return (
          <div key={tr.algo.id} className="race-card">
            <header className="race-card-header">
              <h3>{tr.algo.name}</h3>
              {tr.rank != null && (
                <span className={`rank rank-${tr.rank}`}>#{tr.rank}</span>
              )}
            </header>
            <div className="race-canvas-wrap">
              <SortCanvas
                runner={tr.runner}
                viewMode={viewMode}
                className="race-canvas"
              />
            </div>
            <footer className="race-card-footer">
              <span>{stats.comparisons.toLocaleString()} cmp</span>
              <span>{stats.swaps.toLocaleString()} swp</span>
              <span>
                {tr.finishedAtMs != null
                  ? `${(tr.finishedAtMs / 1000).toFixed(2)}s`
                  : `${(elapsedRef.current / 1000).toFixed(2)}s`}
              </span>
            </footer>
          </div>
        );
      })}
    </div>
  );
}
