import { GRID_SIZE, MAX_ENERGY, TILE_SIZE, GAP } from './constants.js';
import { state } from './state.js';

export function render(state, canvas) {
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const available = Math.min(canvas.width, canvas.height);
  const tileSize = (available - GAP * (GRID_SIZE + 1)) / GRID_SIZE;

  drawGrid(ctx, tileSize);
  drawTiles(ctx, tileSize, state);
  updateEnergyBar(state);
}

function drawGrid(ctx, tileSize) {
  ctx.fillStyle = '#121528';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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

function drawTiles(ctx, tileSize, state) {
  const shake = state.energy < 5 ? (Math.random() - 0.5) * 4 : 0;

  state.tiles.forEach(tile => {
    const px = tile.px * (tileSize + GAP) + GAP + shake;
    const py = tile.py * (tileSize + GAP) + GAP + shake;

    const pulse = 1 + tile.mergePulse * 0.15;
    const scale = pulse + (tile.unstable ? Math.sin(performance.now() / 200) * 0.04 : 0);

    ctx.save();
    ctx.translate(px + tileSize / 2, py + tileSize / 2);
    ctx.scale(scale, scale);
    ctx.translate(-tileSize / 2, -tileSize / 2);

    ctx.fillStyle = tile.unstable ? '#4b5c7f' : '#1e2235';
    ctx.shadowBlur = tile.unstable ? 8 : 4;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    drawRoundedRect(ctx, 0, 0, tileSize, tileSize, 12);

    ctx.fillStyle = '#e0e5f0';
    ctx.font = `bold ${tileSize * 0.4}px JetBrains Mono`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tile.value, tileSize / 2, tileSize / 2);

    ctx.restore();
  });

  const bgIntensity = Math.max(0, state.energy / MAX_ENERGY);
  ctx.canvas.style.background = `rgb(${18 * bgIntensity}, ${18 * bgIntensity}, ${40 * bgIntensity + 8})`;

  if (state.gameOver) {
    document.getElementById('end-score').innerText = `score: ${Math.max(...state.tiles.map(t => t.value)) || 0}`;
    document.getElementById('end-overlay').style.display = 'flex';
  }
}

function updateEnergyBar(state) {
  const fill = document.getElementById('energy-fill');
  fill.style.width = `${(state.energy / MAX_ENERGY) * 100}%`;
}
