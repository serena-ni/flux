import { GRID_SIZE } from "./constants.js";

export const state = {
  grid: [],
  energy: 20,
  gameOver: false,
  overload: false,

  unstableTileId: null,
};

export function initState() {
  state.grid = Array(GRID_SIZE * GRID_SIZE).fill(null);
  state.energy = 20;
  state.gameOver = false;
  state.overload = false;
  state.unstableTileId = null;
}

export function hasEmptyCell() {
  return state.grid.some(c => c === null);
}

export function hasValidMoves() {
  for (let i = 0; i < state.grid.length; i++) {
    const tile = state.grid[i];
    if (!tile) continue;

    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE);

    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE) continue;
      const nIdx = ny * GRID_SIZE + nx;
      const neighbor = state.grid[nIdx];
      if (neighbor && neighbor.value === tile.value) {
        return true;
      }
    }
  }
  return false;
}

export function checkOverload() {
  if (!hasEmptyCell() && !hasValidMoves()) {
    state.overload = true;
  }
}

export function getHighEnergyTiles() {
  return state.grid.filter(t => t && t.value >= 128);
}
