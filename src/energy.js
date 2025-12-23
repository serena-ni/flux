import { INSTABILITY_THRESHOLD, MAX_ENERGY } from './constants.js';

export function mergeCost(value) {
  return Math.log2(value);
}

export function updateInstability(state) {
  state.grid.forEach(row =>
    row.forEach(tile => {
      if (!tile) return;
      tile.unstable = tile.value >= INSTABILITY_THRESHOLD;
      if (tile.unstable) state.energy -= 0.05;
    })
  );

  state.energy = Math.max(0, Math.min(MAX_ENERGY, state.energy));
}
