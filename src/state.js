import { GRID_SIZE, MAX_ENERGY } from './constants.js';

const state = {
  grid: [],
  energy: MAX_ENERGY,
};

function emptyGrid() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
  );
}

// spawn a new tile
function spawnTile() {
  const empties = [];
  state.grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (!cell) empties.push({ x, y });
    })
  );

  if (!empties.length) return;

  const { x, y } = empties[Math.floor(Math.random() * empties.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  state.grid[y][x] = { value, unstable: false };

  // energy cost
  state.energy = Math.max(0, state.energy - 0.5);
}

// reset the board
function reset() {
  state.grid = emptyGrid();
  state.energy = MAX_ENERGY;
  spawnTile();
  spawnTile();
}

reset();

export { state, spawnTile, reset };
