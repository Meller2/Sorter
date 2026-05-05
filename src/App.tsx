import { useCallback, useEffect, useMemo, useState } from 'react';
import { ALGORITHMS, getAlgorithm } from './algorithms';
import { generateArray } from './distributions';
import { setMuted, setVolume } from './audio';
import { Controls } from './components/Controls';
import { SingleSort } from './components/SingleSort';
import { RaceMode } from './components/RaceMode';
import type { Distribution, ViewMode } from './types';

const DEFAULT_RACE = ['quick', 'merge', 'heap', 'bubble'];

type Mode = 'single' | 'race';

export function App() {
  const [mode, setMode] = useState<Mode>('single');
  const [algorithmId, setAlgorithmId] = useState<string>('quick');
  const [size, setSize] = useState<number>(120);
  const [speed, setSpeed] = useState<number>(8);
  const [distribution, setDistribution] = useState<Distribution>('random');
  const [viewMode, setViewMode] = useState<ViewMode>('bars');
  const [muted, setMutedState] = useState(true);
  const [volume, setVolumeState] = useState(0.15);
  const [running, setRunning] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [raceSelected, setRaceSelected] = useState<string[]>(DEFAULT_RACE);
  const [doneFlag, setDoneFlag] = useState(false);

  const array = useMemo(
    () => generateArray(size, distribution),
    // resetKey intentionally invalidates the array on reshuffle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [size, distribution, resetKey],
  );

  useEffect(() => setMuted(muted), [muted]);
  useEffect(() => setVolume(volume), [volume]);

  const raceKey = raceSelected.join(',');
  // Reset run state when inputs change.
  useEffect(() => {
    setRunning(false);
    setDoneFlag(false);
  }, [size, distribution, algorithmId, mode, raceKey]);

  const reshuffle = useCallback(() => {
    setRunning(false);
    setDoneFlag(false);
    setResetKey((k) => k + 1);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (doneFlag) {
      reshuffle();
      setRunning(true);
      return;
    }
    setRunning((r) => !r);
  }, [doneFlag, reshuffle]);

  const handleRaceToggle = useCallback((id: string) => {
    setRaceSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const algorithm = getAlgorithm(algorithmId);
  const raceAlgorithms = useMemo(
    () =>
      raceSelected
        .map((id) => ALGORITHMS.find((a) => a.id === id))
        .filter((a): a is (typeof ALGORITHMS)[number] => Boolean(a)),
    [raceSelected],
  );

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <span style={{ background: '#ff5d8f' }} />
            <span style={{ background: '#ffb86c' }} />
            <span style={{ background: '#a3e635' }} />
            <span style={{ background: '#38bdf8' }} />
            <span style={{ background: '#a78bfa' }} />
          </span>
          <h1>Sorter</h1>
          <span className="tagline">Sorting Algorithm Visualizer</span>
        </div>
        <a
          className="topbar-link"
          href="https://github.com/Meller2/Sorter"
          target="_blank"
          rel="noreferrer"
        >
          Source on GitHub
        </a>
      </header>

      <div className="layout">
        <Controls
          mode={mode}
          onModeChange={setMode}
          algorithmId={algorithmId}
          onAlgorithmChange={setAlgorithmId}
          algorithms={ALGORITHMS.map((a) => ({ id: a.id, name: a.name }))}
          size={size}
          onSizeChange={setSize}
          speed={speed}
          onSpeedChange={setSpeed}
          distribution={distribution}
          onDistributionChange={setDistribution}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          muted={muted}
          onMutedChange={setMutedState}
          volume={volume}
          onVolumeChange={setVolumeState}
          running={running}
          done={doneFlag}
          onPlayPause={handlePlayPause}
          onReshuffle={reshuffle}
          raceSelected={raceSelected}
          onRaceToggle={handleRaceToggle}
        />

        <main className="main">
          {mode === 'single' ? (
            <SingleSort
              algorithm={algorithm}
              array={array}
              speed={speed}
              viewMode={viewMode}
              running={running}
              resetKey={resetKey}
              onDone={() => {
                setDoneFlag(true);
                setRunning(false);
              }}
            />
          ) : (
            <RaceMode
              algorithms={raceAlgorithms}
              array={array}
              speed={speed}
              viewMode={viewMode}
              running={running}
              resetKey={resetKey}
            />
          )}
        </main>
      </div>

      <footer className="footer">
        <span>
          {ALGORITHMS.length} algorithms · canvas rendering · Web Audio
        </span>
      </footer>
    </div>
  );
}
