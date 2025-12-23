import { reset } from './src/state.js';

export function initInfo(){
  const btn = document.getElementById('info-btn');
  const overlay = document.getElementById('info-overlay');
  const closeBtn = document.getElementById('close-info');

  btn.addEventListener('click',()=>overlay.classList.add('show'));
  closeBtn.addEventListener('click',()=>overlay.classList.remove('show'));

  // tap outside to close
  overlay.addEventListener('click', e => {
    if(e.target === overlay) overlay.classList.remove('show');
  });

  const restartBtn = document.getElementById('restart-btn');
  restartBtn.addEventListener('click', ()=>{
    overlay.classList.remove('show');
    document.getElementById('end-overlay').classList.remove('show');
    reset();
  });
}
