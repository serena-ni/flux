import { GRID_SIZE, MAX_ENERGY } from './constants.js';

const state = { grid: [], tiles: [], energy: MAX_ENERGY };

function emptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
}

function spawnTile() {
  const empties = [];
  state.grid.forEach((row, y) =>
    row.forEach((cell, x) => { if (!cell) empties.push({ x, y }); })
  );
  if (!empties.length) return;

  const { x, y } = empties[Math.floor(Math.random() * empties.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  const tile = { x, y, px: x, py: y, value, unstable: false, mergePulse: 0 };
  state.grid[y][x] = tile;
  state.tiles.push(tile);
  state.energy = Math.max(0, state.energy - 0.5);
}

function reset() {
  state.grid = emptyGrid();
  state.tiles = [];
  state.energy = MAX_ENERGY;
  spawnTile();
  spawnTile();
}

function moveTiles() {
  const speed = 0.2;
  state.tiles.forEach(tile => {
    tile.px += (tile.x - tile.px) * speed;
    tile.py += (tile.y - tile.py) * speed;

    // reduce mergePulse smoothly
    if (tile.mergePulse > 0) tile.mergePulse = Math.max(0, tile.mergePulse - 0.05);
  });
}

function move(direction) {
  const mergedThisMove = new Set();
  const range = [...Array(GRID_SIZE).keys()];

  let moved = false;

  const traverse = (xOrder, yOrder, dx, dy) => {
    for (let yi of yOrder) {
      for (let xi of xOrder) {
        let tile = state.grid[yi][xi];
        if (!tile) continue;
        let x = xi, y = yi;

        while (true) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break;
          const target = state.grid[ny][nx];

          if (!target) {
            state.grid[ny][nx] = tile;
            state.grid[y][x] = null;
            x = nx; y = ny;
            moved = true;
          } else if (target.value === tile.value && !mergedThisMove.has(target)) {
            // Merge tiles
            target.value *= 2;
            target.unstable = target.value >= 16;
            target.mergePulse = 1;
            state.grid[y][x] = null;
            mergedThisMove.add(target);

            // Remove old tile from tiles array
            state.tiles = state.tiles.filter(t => t !== tile);

            // Gain energy
            state.energy = Math.min(MAX_ENERGY, state.energy + 2);

            moved = true;
            break;
          } else break;
        }

        tile.x = x;
        tile.y = y;
      }
    }
  };

  switch (direction) {
    case 'up': traverse(range, range, 0, -1); break;
    case 'down': traverse(range, range.slice().reverse(), 0, 1); break;
    case 'left': traverse(range, range, -1, 0); break;
    case 'right': traverse(range.slice().reverse(), range, 1, 0); break;
  }

  if (moved) spawnTile();
}

export { state, reset, spawnTile, moveTiles, move };
