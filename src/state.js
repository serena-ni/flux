import { GRID_SIZE, MAX_ENERGY, INSTABILITY_THRESHOLD } from './constants.js';
import { energyFromMerge, updateInstability } from './energy.js';

const state = {
  grid: [],
  tiles: [],
  energy: MAX_ENERGY,
  gameOver: false,
};

function emptyGrid() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
  );
}

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

  const tile = {
    x,
    y,
    px: x,
    py: y,
    value,
    unstable: false,
    mergePulse: 0,
  };

  state.grid[y][x] = tile;
  state.tiles.push(tile);
}

function reset() {
  state.grid = emptyGrid();
  state.tiles = [];
  state.energy = MAX_ENERGY;
  state.gameOver = false;
  spawnTile();
  spawnTile();
}

function moveTiles() {
  const speed = 0.2;

  state.tiles.forEach(tile => {
    tile.px += (tile.x - tile.px) * speed;
    tile.py += (tile.y - tile.py) * speed;
    tile.mergePulse = Math.max(0, tile.mergePulse - 0.05);
  });

  if (state.energy <= 0) {
    state.gameOver = true;
  }
}

function noMovesLeft() {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const t = state.grid[y][x];
      if (!t) return false;

      if (
        (x < GRID_SIZE - 1 && state.grid[y][x + 1]?.value === t.value) ||
        (y < GRID_SIZE - 1 && state.grid[y + 1][x]?.value === t.value)
      ) {
        return false;
      }
    }
  }
  return true;
}

function move(direction) {
  if (state.gameOver) return;

  const merged = new Set();
  let moved = false;

  const range = [...Array(GRID_SIZE).keys()];
  const dirs = {
    up: [range, range, 0, -1],
    down: [range, range.slice().reverse(), 0, 1],
    left: [range, range, -1, 0],
    right: [range.slice().reverse(), range, 1, 0],
  };

  const [xOrder, yOrder, dx, dy] = dirs[direction];

  for (let yi of yOrder) {
    for (let xi of xOrder) {
      const tile = state.grid[yi][xi];
      if (!tile) continue;

      let x = xi;
      let y = yi;

      while (true) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE) break;

        const target = state.grid[ny][nx];

        if (!target) {
          state.grid[ny][nx] = tile;
          state.grid[y][x] = null;
          x = nx;
          y = ny;
          moved = true;
        } else if (
          target.value === tile.value &&
          !merged.has(target) &&
          !target.unstable
        ) {
          target.value *= 2;
          target.mergePulse = 1;
          target.unstable = target.value >= INSTABILITY_THRESHOLD;

          state.energy += energyFromMerge(target.value);

          state.grid[y][x] = null;
          state.tiles = state.tiles.filter(t => t !== tile);
          merged.add(target);
          moved = true;
          break;
        } else break;
      }

      tile.x = x;
      tile.y = y;
    }
  }

  if (moved) {
    state.energy = Math.max(0, state.energy - 1);
    spawnTile();
  }

  updateInstability(state);

  if (noMovesLeft()) {
    state.gameOver = true;
  }
}

export { state, reset, moveTiles, move };
