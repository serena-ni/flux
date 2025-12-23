import { GRID_SIZE, MAX_ENERGY } from './constants.js';

export const state = {
  grid: [],
  energy: MAX_ENERGY,
};

function emptyGrid() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
  );
}

function addRandomTile() {
  const empties = [];
  state.grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (!cell) empties.push({ x, y });
    })
  );

  if (!empties.length) return;

  const { x, y } = empties[Math.floor(Math.random() * empties.length)];
  state.grid[y][x] = { value: 2, unstable: false };
}

export function reset() {
  state.grid = emptyGrid();
  state.energy = MAX_ENERGY;
  addRandomTile();
  addRandomTile();
}

reset();
