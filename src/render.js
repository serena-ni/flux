import { GRID_SIZE, TILE_SIZE, GAP, MAX_ENERGY } from './constants.js';
import { state } from './state.js';

const canvas = document.getElementById('game');
canvas.width = GRID_SIZE * TILE_SIZE + (GRID_SIZE + 1) * GAP;
canvas.height = GRID_SIZE * TILE_SIZE + (GRID_SIZE + 1) * GAP;
const ctx = canvas.getContext('2d');

export function render(state) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawTiles(state);
  updateEnergyBar(state);
}

function drawGrid() {
  ctx.fillStyle = '#121528';
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
  state.tiles.forEach(tile => {
    const px = tile.px * (TILE_SIZE + GAP) + GAP;
    const py = tile.py * (TILE_SIZE + GAP) + GAP;

    const scale = 1 + (tile.unstable ? Math.sin(performance.now() / 200) * 0.02 : 0);

    ctx.save();
    ctx.translate(px + TILE_SIZE/2, py + TILE_SIZE/2);
    ctx.scale(scale, scale);
    ctx.translate(-TILE_SIZE/2, -TILE_SIZE/2);

    ctx.fillStyle = tile.unstable ? '#4b5c7f' : '#1e2235';
    ctx.shadowBlur = tile.unstable ? 6 : 4;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    drawRoundedRect(ctx, 0,0,TILE_SIZE,TILE_SIZE,12);

    ctx.fillStyle = '#e0e5f0';
    ctx.font = '500 28px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tile.value, TILE_SIZE/2, TILE_SIZE/2);

    ctx.restore();
  });
}

function updateEnergyBar(state){
  const fill = document.getElementById('energy-fill');
  const pct = state.energy / MAX_ENERGY;
  fill.style.width = `${pct*100}%`;
  fill.style.background = `linear-gradient(90deg, #6ab5ff, #4b7fcf)`;
}
