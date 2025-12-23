import { GRID_SIZE, TILE_SIZE, GAP, MAX_ENERGY } from './constants.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

export function render(state) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawTiles(state);
  updateEnergyBar(state);
  updateCanvasShadow(state);
}

function drawGrid() {
  ctx.fillStyle = '#0a1020';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTiles(state) {
  state.grid.forEach((row, y) =>
    row.forEach((tile, x) => {
      if (!tile) return;

      const px = x * (TILE_SIZE + GAP) + GAP;
      const py = y * (TILE_SIZE + GAP) + GAP;

      const pulse = tile.unstable
        ? 1 + Math.sin(performance.now() / 120) * 0.03
        : 1;

      ctx.save();
      ctx.translate(px + TILE_SIZE / 2, py + TILE_SIZE / 2);
      ctx.scale(pulse, pulse);
      ctx.translate(-TILE_SIZE / 2, -TILE_SIZE / 2);

      ctx.fillStyle = tile.unstable ? '#2a1c2e' : '#16203a';
      ctx.shadowBlur = tile.unstable ? 20 : 0;
      ctx.shadowColor = tile.unstable ? '#fb7185' : 'transparent';

      ctx.beginPath();
      ctx.roundRect(0, 0, TILE_SIZE, TILE_SIZE, 12);
      ctx.fill();
      ctx.restore();

      // Tile number
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '500 22px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tile.value, px + TILE_SIZE / 2, py + TILE_SIZE / 2);
    })
  );
}

function updateEnergyBar(state) {
  const fill = document.getElementById('energy-fill');
  const pct = state.energy / MAX_ENERGY;
  fill.style.width = `${pct * 100}%`;

  if (pct < 0.35) {
    fill.style.background =
      'linear-gradient(90deg, #fb7185, #f43f5e)';
  } else {
    fill.style.background =
      'linear-gradient(90deg, #7dd3fc, #38bdf8)';
  }
}

function updateCanvasShadow(state) {
  if (state.energy < 30) {
    canvas.style.boxShadow =
      '0 0 30px rgba(251,113,133,0.15)';
  } else {
    canvas.style.boxShadow = 'none';
  }
}
