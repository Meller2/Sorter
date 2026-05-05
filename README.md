# Sorter — Sorting Algorithm Visualizer

An interactive, in-browser visualizer for **11 sorting algorithms**, complete with sound, multiple visualization modes, and a side-by-side **race mode** that runs several algorithms in parallel on the same input.

Built with **TypeScript + React + Vite** and rendered to `<canvas>` for smooth animation up to 500 elements.

## Features

- **11 algorithms**: Quick, Merge, Heap, Shell, Radix (LSD), Insertion, Selection, Bubble, Cocktail Shaker, Comb, Gnome.
- **4 visualization modes**: Bars, Rainbow bars, Circle (polar), Dots.
- **5 input distributions**: Random, Nearly sorted, Reversed, Few unique, Sawtooth.
- **Sound on every compare/swap** — frequency mapped from element value (Web Audio API).
- **Race mode** — pick any subset of algorithms and watch them race on identical input.
- Live counters: comparisons, swaps, writes, time elapsed.
- Time/space complexity & stability info per algorithm.
- Adjustable array size (10–500) and steps-per-frame (1–400).

## Development

```bash
npm install
npm run dev       # Vite dev server
npm run build     # production build to dist/
npm run preview   # serve the production build
npm run typecheck # tsc --noEmit
npm run lint      # eslint
```

## Architecture

Each algorithm is implemented as a **generator** yielding typed `Step` events
(`compare`, `swap`, `set`, `highlight`, `done`). The `Runner` advances the
generator on demand and tracks comparisons/swaps/writes. The visualizer
consumes the runner's state on each animation frame and draws to canvas.

This makes it trivial to:

- Throttle / pause / step through any algorithm.
- Run multiple algorithms in parallel (race mode) with independent state.
- Drive the audio engine off the same step stream.

## License

CC0 — see `LICENSE`.
