import { GRID_SIZE, TILE_SIZE, GAP, MAX_ENERGY } from './constants.js';

const canvas = document.getElementById('game');
canvas.width = GRID_SIZE * TILE_SIZE + (GRID_SIZE + 1) * GAP;
canvas.height = GRID_SIZE * TILE_SIZE + (GRID_SIZE + 1) * GAP;
const ctx = canvas.getContext('2d');

export function render(state) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawTiles(state);
  updateEnergyBar(state);
  updateCanvasGlow(state);
}

function drawGrid() {
  ctx.fillStyle = '#0b0d1c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

function drawTiles(state) {
  state.grid.forEach((row, y) =>
    row.forEach((tile, x) => {
      if (!tile) return;

      const px = x * (TILE_SIZE + GAP) + GAP;
      const py = y * (TILE_SIZE + GAP) + GAP;

      const pulse = tile.unstable
        ? 1 + Math.sin(performance.now() / 100) * 0.07
        : 1;

      ctx.save();
      ctx.translate(px + TILE_SIZE / 2, py + TILE_SIZE / 2);
      ctx.scale(pulse, pulse);
      ctx.translate(-TILE_SIZE / 2, -TILE_SIZE / 2);

      // Tile rectangle
      ctx.fillStyle = tile.unstable ? '#ff3f8e' : '#1b1f34';
      ctx.shadowBlur = tile.unstable ? 18 : 6;
      ctx.shadowColor = tile.unstable ? '#ff3f8e' : '#00f0ff';
      drawRoundedRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, 12);

      // Tile number
      ctx.fillStyle = '#e0e5ff';
      ctx.font = '500 22px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tile.value, TILE_SIZE / 2, TILE_SIZE / 2);

      ctx.restore();
    })
  );
}

function updateEnergyBar(state) {
  const fill = document.getElementById('energy-fill');
  const pct = state.energy / MAX_ENERGY;
  fill.style.width = `${pct * 100}%`;

  if (pct < 0.35) {
    fill.style.background =
      'linear-gradient(90deg, #ff3f8e, #ff1f70)';
  } else {
    fill.style.background =
      'linear-gradient(90deg, #00f0ff, #00c0ff)';
  }
}

function updateCanvasGlow(state) {
  if (state.energy < 30) {
    canvas.style.boxShadow =
      '0 0 40px rgba(255,63,142,0.25)';
  } else {
    canvas.style.boxShadow =
      '0 0 30px rgba(0,240,255,0.15)';
  }
}
