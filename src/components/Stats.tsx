import type { RunnerStats } from '../runner';
import type { AlgorithmInfo } from '../types';

type Props = {
  algorithm: AlgorithmInfo;
  stats: RunnerStats;
  elapsedMs: number;
};

export function Stats({ algorithm, stats, elapsedMs }: Props) {
  return (
    <div className="stats">
      <div className="stats-row">
        <Stat label="Comparisons" value={stats.comparisons.toLocaleString()} />
        <Stat label="Swaps" value={stats.swaps.toLocaleString()} />
        <Stat label="Writes" value={stats.writes.toLocaleString()} />
        <Stat label="Time" value={`${(elapsedMs / 1000).toFixed(2)}s`} />
        <Stat
          label="Status"
          value={stats.done ? 'Sorted' : 'Running'}
          highlight={stats.done ? 'good' : undefined}
        />
      </div>
      <div className="algo-meta">
        <div>
          <span className="meta-label">Best</span>
          <code>{algorithm.best}</code>
        </div>
        <div>
          <span className="meta-label">Avg</span>
          <code>{algorithm.avg}</code>
        </div>
        <div>
          <span className="meta-label">Worst</span>
          <code>{algorithm.worst}</code>
        </div>
        <div>
          <span className="meta-label">Space</span>
          <code>{algorithm.space}</code>
        </div>
        <div>
          <span className="meta-label">Stable</span>
          <code>{algorithm.stable ? 'yes' : 'no'}</code>
        </div>
      </div>
      <p className="algo-desc">{algorithm.description}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: 'good';
}) {
  return (
    <div className={highlight ? `stat ${highlight}` : 'stat'}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
