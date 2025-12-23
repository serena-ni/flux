import { GRID_SIZE, MAX_ENERGY } from './constants.js';

const state = {
  grid: [],
  energy: MAX_ENERGY,
  tiles: [], // all tiles for animation
};

function emptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
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
  const tile = { x, y, px: x, py: y, value, unstable: false, merged: false };
  state.grid[y][x] = tile;
  state.tiles.push(tile);
  state.energy = Math.max(0, state.energy - 0.5);
}

function reset() {
  state.grid = emptyGrid();
  state.energy = MAX_ENERGY;
  state.tiles = [];
  spawnTile();
  spawnTile();
}

// animation
function moveTiles() {
  const speed = 0.2;
  state.tiles.forEach(tile => {
    tile.px += (tile.x - tile.px) * speed;
    tile.py += (tile.y - tile.py) * speed;
  });
}

// sliding logic
function move(direction) {
  // direction: 'up','down','left','right'
  const mergedThisMove = new Set();

  function traverse(start, dx, dy) {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        let x = start(i,j)[0];
        let y = start(i,j)[1];
        let tile = state.grid[y][x];
        if (!tile) continue;

        let nx = x, ny = y;
        while (true) {
          const tx = nx + dx, ty = ny + dy;
          if (tx < 0 || tx >= GRID_SIZE || ty < 0 || ty >= GRID_SIZE) break;
          const target = state.grid[ty][tx];
          if (!target) {
            state.grid[ty][tx] = tile;
            state.grid[ny][nx] = null;
            nx = tx;
            ny = ty;
          } else if (target.value === tile.value && !mergedThisMove.has(target)) {
            target.value *= 2;
            target.unstable = target.value >= 16;
            state.grid[ny][nx] = null;
            mergedThisMove.add(target);
            state.energy = Math.max(0, state.energy - 1);
            break;
          } else break;
        }
        tile.x = nx;
        tile.y = ny;
      }
    }
  }

  switch(direction){
    case 'up': traverse((i,j)=>[j,i],0,-1); break;
    case 'down': traverse((i,j)=>[j,GRID_SIZE-1-i],0,1); break;
    case 'left': traverse((i,j)=>[i,j],-1,0); break;
    case 'right': traverse((i,j)=>[i,GRID_SIZE-1-j],1,0); break;
  }

  spawnTile();
}

export { state, reset, spawnTile, moveTiles, move };
