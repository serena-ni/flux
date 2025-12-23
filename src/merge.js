import { MOVE_COST } from './constants.js';
import { mergeCost, updateInstability } from './energy.js';
import { state, spawnTile } from './state.js';

function slide(row) {
  return row.filter(Boolean);
}

function merge(row) {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i].value === row[i + 1].value) {
      row[i].value *= 2;
      state.energy -= mergeCost(row[i].value);
      row.splice(i + 1, 1);
    }
  }
  return row;
}

function operate(row) {
  let r = slide(row);
  r = merge(r);
  while (r.length < row.length) r.push(null);
  return r;
}

export function move(dir) {
  const prevGrid = JSON.stringify(state.grid);

  state.energy -= MOVE_COST;
  let rotated = false;

  // rotate grid for up/down
  if (dir === 'up' || dir === 'down') {
    state.grid = transpose(state.grid);
    rotated = true;
  }
  if (dir === 'right' || dir === 'down') {
    state.grid = state.grid.map(row => row.reverse());
  }

  // apply merge/slide
  state.grid = state.grid.map(operate);

  if (dir === 'right' || dir === 'down') {
    state.grid = state.grid.map(row => row.reverse());
  }
  if (rotated) state.grid = transpose(state.grid);

  // spawn tile only if move changed grid
  if (JSON.stringify(state.grid) !== prevGrid) {
    updateInstability(state);
    spawnTile();
  } else {
    updateInstability(state);
  }
}

function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}
