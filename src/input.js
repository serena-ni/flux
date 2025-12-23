import { move } from './state.js';

export function initInput() {
  window.addEventListener('keydown', e => {
    switch(e.key){
      case 'ArrowUp': move('up'); break;
      case 'ArrowDown': move('down'); break;
      case 'ArrowLeft': move('left'); break;
      case 'ArrowRight': move('right'); break;
    }
  });
}
