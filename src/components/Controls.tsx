import type { Distribution, ViewMode } from '../types';

type Mode = 'single' | 'race';

type Props = {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  algorithmId: string;
  onAlgorithmChange: (id: string) => void;
  algorithms: Array<{ id: string; name: string }>;
  size: number;
  onSizeChange: (n: number) => void;
  speed: number;
  onSpeedChange: (n: number) => void;
  distribution: Distribution;
  onDistributionChange: (d: Distribution) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  muted: boolean;
  onMutedChange: (m: boolean) => void;
  volume: number;
  onVolumeChange: (v: number) => void;
  running: boolean;
  done: boolean;
  onPlayPause: () => void;
  onReshuffle: () => void;
  raceSelected: string[];
  onRaceToggle: (id: string) => void;
};

const DISTRIBUTIONS: { value: Distribution; label: string }[] = [
  { value: 'random', label: 'Random' },
  { value: 'nearly-sorted', label: 'Nearly sorted' },
  { value: 'reversed', label: 'Reversed' },
  { value: 'few-unique', label: 'Few unique' },
  { value: 'sawtooth', label: 'Sawtooth' },
];

const VIEW_MODES: { value: ViewMode; label: string }[] = [
  { value: 'bars', label: 'Bars' },
  { value: 'rainbow', label: 'Rainbow' },
  { value: 'circle', label: 'Circle' },
  { value: 'dots', label: 'Dots' },
];

export function Controls(props: Props) {
  const {
    mode,
    onModeChange,
    algorithmId,
    onAlgorithmChange,
    algorithms,
    size,
    onSizeChange,
    speed,
    onSpeedChange,
    distribution,
    onDistributionChange,
    viewMode,
    onViewModeChange,
    muted,
    onMutedChange,
    volume,
    onVolumeChange,
    running,
    done,
    onPlayPause,
    onReshuffle,
    raceSelected,
    onRaceToggle,
  } = props;

  return (
    <aside className="controls">
      <section className="control-group mode-toggle">
        <button
          type="button"
          className={mode === 'single' ? 'tab active' : 'tab'}
          onClick={() => onModeChange('single')}
        >
          Single
        </button>
        <button
          type="button"
          className={mode === 'race' ? 'tab active' : 'tab'}
          onClick={() => onModeChange('race')}
        >
          Race
        </button>
      </section>

      <section className="control-group main-actions">
        <button
          type="button"
          className="btn primary"
          onClick={onPlayPause}
          disabled={done && !running}
        >
          {running ? 'Pause' : done ? 'Finished' : 'Play'}
        </button>
        <button type="button" className="btn" onClick={onReshuffle}>
          Reshuffle
        </button>
      </section>

      {mode === 'single' && (
        <section className="control-group">
          <label htmlFor="algo">Algorithm</label>
          <select
            id="algo"
            value={algorithmId}
            onChange={(e) => onAlgorithmChange(e.target.value)}
          >
            {algorithms.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </section>
      )}

      {mode === 'race' && (
        <section className="control-group">
          <label>Algorithms in race</label>
          <div className="checkbox-grid">
            {algorithms.map((a) => (
              <label key={a.id} className="checkbox">
                <input
                  type="checkbox"
                  checked={raceSelected.includes(a.id)}
                  onChange={() => onRaceToggle(a.id)}
                />
                <span>{a.name}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      <section className="control-group">
        <label htmlFor="size">
          Array size <span className="value">{size}</span>
        </label>
        <input
          id="size"
          type="range"
          min={10}
          max={500}
          step={10}
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
        />
      </section>

      <section className="control-group">
        <label htmlFor="speed">
          Steps / frame <span className="value">{speed}</span>
        </label>
        <input
          id="speed"
          type="range"
          min={1}
          max={400}
          step={1}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
      </section>

      <section className="control-group">
        <label htmlFor="dist">Distribution</label>
        <select
          id="dist"
          value={distribution}
          onChange={(e) => onDistributionChange(e.target.value as Distribution)}
        >
          {DISTRIBUTIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </section>

      <section className="control-group">
        <label htmlFor="view">View</label>
        <select
          id="view"
          value={viewMode}
          onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
        >
          {VIEW_MODES.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </section>

      <section className="control-group sound">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={!muted}
            onChange={(e) => onMutedChange(!e.target.checked)}
          />
          <span>Sound</span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          disabled={muted}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          aria-label="Volume"
        />
      </section>
    </aside>
  );
}
