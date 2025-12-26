import { GRID_SIZE, TILE_SIZE, GAP, MAX_ENERGY } from './constants.js';

export function render(state, canvas) {
  const ctx = canvas.getContext('2d');

  const size = GRID_SIZE * TILE_SIZE + GAP * (GRID_SIZE + 1);
  const dpr = window.devicePixelRatio || 1;

  // --- DPR-safe canvas sizing (THIS FIXES BLUR) ---
  if (canvas.width !== size * dpr) {
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  ctx.clearRect(0, 0, size, size);

  // background
  ctx.fillStyle = '#121528';
  ctx.fillRect(0, 0, size, size);

  drawTiles(ctx, state);
  updateEnergyBar(state);

  if (state.gameOver) {
    document.getElementById('end-overlay').classList.add('show');
    document.getElementById('end-score').textContent =
      `score: ${Math.max(...state.tiles.map(t => t.value), 0)}`;
  }
}

function drawTiles(ctx, state) {
  const shake = state.energy < 5 ? (Math.random() - 0.5) * 2 : 0;

  for (const tile of state.tiles) {
    const x = GAP + tile.px * (TILE_SIZE + GAP) + shake;
    const y = GAP + tile.py * (TILE_SIZE + GAP) + shake;

    ctx.save();

    const pulse = 1 + tile.mergePulse * 0.12;
    const wobble = tile.unstable
      ? Math.sin(performance.now() / 220) * 0.03
      : 0;

    const scale = pulse + wobble;

    ctx.translate(x + TILE_SIZE / 2, y + TILE_SIZE / 2);
    ctx.scale(scale, scale);
    ctx.translate(-TILE_SIZE / 2, -TILE_SIZE / 2);

    ctx.fillStyle = tile.unstable ? '#4b5c7f' : '#1e2235';
    ctx.shadowBlur = tile.unstable ? 8 : 4;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    roundRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, 12);

    // CRISP text
    ctx.fillStyle = '#e6e9ef';
    ctx.font = '500 22px "JetBrains Mono"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tile.value, TILE_SIZE / 2, TILE_SIZE / 2);

    ctx.restore();
  }
}

function roundRect(ctx, x, y, w, h, r) {
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

function updateEnergyBar(state) {
  document.getElementById('energy-fill').style.width =
    `${(state.energy / MAX_ENERGY) * 100}%`;
}
