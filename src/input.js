import { move } from './merge.js';
import { state } from './state.js';

export function initInput() {
  window.addEventListener('keydown', e => {
    if (state.energy <= 0) return;

    if (e.key === 'ArrowUp') move('up');
    if (e.key === 'ArrowDown') move('down');
    if (e.key === 'ArrowLeft') move('left');
    if (e.key === 'ArrowRight') move('right');
  });
}
