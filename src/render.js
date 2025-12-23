import { GRID_SIZE, TILE_SIZE, GAP, MAX_ENERGY } from './constants.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

export function render(state) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawTiles(state);
  updateEnergyBar(state);
}

function drawGrid() {
  ctx.fillStyle = '#0f1624';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTiles(state) {
  state.grid.forEach((row, y) =>
    row.forEach((tile, x) => {
      if (!tile) return;

      const px = x * (TILE_SIZE + GAP) + GAP;
      const py = y * (TILE_SIZE + GAP) + GAP;

      ctx.fillStyle = tile.unstable ? '#2b1d2e' : '#1b2436';
      ctx.shadowBlur = tile.unstable ? 20 : 0;
      ctx.shadowColor = tile.unstable ? '#fb7185' : 'transparent';

      ctx.beginPath();
      ctx.roundRect(px, py, TILE_SIZE, TILE_SIZE, 12);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '20px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tile.value, px + TILE_SIZE / 2, py + TILE_SIZE / 2);
    })
  );
}

function updateEnergyBar(state) {
  const fill = document.getElementById('energy-fill');
  fill.style.width = `${(state.energy / MAX_ENERGY) * 100}%`;
}
