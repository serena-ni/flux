import { INSTABILITY_THRESHOLD, MAX_ENERGY } from './constants.js';

export function energyFromMerge(value) {
  if (value < 16) return 2;
  if (value < 64) return 1.5;
  if (value < 128) return 1;
  if (value < 256) return 0.5;
  return 0;
}

export function updateInstability(state) {
  const highTiles = [];

  state.tiles.forEach(tile => {
    tile.unstable = tile.value >= INSTABILITY_THRESHOLD;
    if (tile.unstable) highTiles.push(tile);
  });

  // passive drain if instability active
  if (highTiles.length >= 3) {
    state.energy = Math.max(0, state.energy - 0.15);
  }

  state.energy = Math.min(MAX_ENERGY, state.energy);
}
