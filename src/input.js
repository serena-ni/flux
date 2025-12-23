import { move } from './merge.js';
import { state } from './state.js';

const canvas = document.getElementById('game');

export function initInput() {
  window.addEventListener('keydown', e => {
    if (state.energy <= 0) return;

    let moved = false;
    if (e.key === 'ArrowUp') { move('up'); moved = true; }
    if (e.key === 'ArrowDown') { move('down'); moved = true; }
    if (e.key === 'ArrowLeft') { move('left'); moved = true; }
    if (e.key === 'ArrowRight') { move('right'); moved = true; }

    if (moved) {
      canvas.classList.remove('nudge');
      void canvas.offsetWidth;
      canvas.classList.add('nudge');
    }
  });
}
