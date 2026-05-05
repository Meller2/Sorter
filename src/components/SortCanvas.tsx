import { useEffect, useRef } from 'react';
import { draw, type DrawState } from '../draw';
import type { ViewMode } from '../types';
import { Runner } from '../runner';

type Props = {
  runner: Runner | null;
  viewMode: ViewMode;
  className?: string;
};

export function SortCanvas({ runner, viewMode, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    const render = () => {
      if (canvas && runner) {
        const state: DrawState = {
          arr: runner.getArray() as number[],
          active: runner.getActive() as Set<number>,
          pivots: runner.getPivots() as Set<number>,
          sortedFrom: 0,
          sortedTo: runner.isDone() ? runner.getArray().length - 1 : -1,
          done: runner.isDone(),
        };
        draw(canvas, state, viewMode, runner.getMaxValue());
      } else if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [runner, viewMode]);

  return <canvas ref={canvasRef} className={className} />;
}
