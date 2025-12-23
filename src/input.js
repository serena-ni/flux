import { move } from './state.js';

export function initInput(){
  // keyboard
  window.addEventListener('keydown', e=>{
    switch(e.key){
      case 'ArrowUp': move('up'); break;
      case 'ArrowDown': move('down'); break;
      case 'ArrowLeft': move('left'); break;
      case 'ArrowRight': move('right'); break;
    }
  });

  // mobile swipe
  let startX = 0;
  let startY = 0;
  const threshold = 30; // min swipe distance

  document.addEventListener('touchstart', e=>{
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  }, { passive: true });

  document.addEventListener('touchend', e=>{
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if(Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

    if(Math.abs(dx) > Math.abs(dy)){
      move(dx > 0 ? 'right' : 'left');
    }else{
      move(dy > 0 ? 'down' : 'up');
    }
  });
}
