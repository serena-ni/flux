import { GRID_SIZE, MAX_ENERGY, INSTABILITY_THRESHOLD } from './constants.js';
import { energyFromMerge, updateInstability } from './energy.js';

const state = {
  grid: [],
  tiles: [],
  energy: MAX_ENERGY,
  gameOver: false,
  overload: false,
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
  state.overload = false;
  spawnTile();
  spawnTile();
}

function moveTiles() {
  const speed = 0.2;

  state.tiles.forEach(tile => {
    tile.px += (tile.x - tile.px) * speed;
    tile.py += (tile.y - tile.py) * speed;
    if (tile.mergePulse > 0) {
      tile.mergePulse = Math.max(0, tile.mergePulse - 0.05);
    }
  });

  if (state.energy <= 0 && !state.gameOver) {
    state.gameOver = true;
  }
}

function checkOverload() {
  let hasMove = false;

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const t = state.grid[y][x];
      if (!t) return; // empty exists -> no overload

      const neighbors = [
        [x + 1, y],
        [x, y + 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (
          nx < GRID_SIZE &&
          ny < GRID_SIZE &&
          state.grid[ny][nx]?.value === t.value
        ) {
          hasMove = true;
        }
      }
    }
  }

  if (!hasMove) state.overload = true;
}

function move(direction) {
  if (state.gameOver || state.overload) return;

  const mergedThisMove = new Set();
  let moved = false;

  const range = [...Array(GRID_SIZE).keys()];
  const orders = {
    up: [range, range, 0, -1],
    down: [range, range.slice().reverse(), 0, 1],
    left: [range, range, -1, 0],
    right: [range.slice().reverse(), range, 1, 0],
  };

  const [xOrder, yOrder, dx, dy] = orders[direction];

  for (let yi of yOrder) {
    for (let xi of xOrder) {
      let tile = state.grid[yi][xi];
      if (!tile) continue;

      let x = xi;
      let y = yi;

      while (true) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx < 0 ||
          nx >= GRID_SIZE ||
          ny < 0 ||
          ny >= GRID_SIZE
        )
          break;

        const target = state.grid[ny][nx];

        if (!target) {
          state.grid[ny][nx] = tile;
          state.grid[y][x] = null;
          x = nx;
          y = ny;
          moved = true;
        } else if (
          target.value === tile.value &&
          !mergedThisMove.has(target) &&
          !target.unstable &&
          !tile.unstable
        ) {
          target.value *= 2;
          target.mergePulse = 1;
          target.unstable = target.value >= INSTABILITY_THRESHOLD;

          state.energy += energyFromMerge(target.value);

          state.grid[y][x] = null;
          state.tiles = state.tiles.filter(t => t !== tile);
          mergedThisMove.add(target);
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
  checkOverload();
}

export { state, reset, spawnTile, moveTiles, move };
