import { reset } from './src/state.js';

export function initInfo(){
  const btn = document.getElementById('info-btn');
  const overlay = document.getElementById('info-overlay');
  const closeBtn = document.getElementById('close-info');

  btn.addEventListener('click',()=>overlay.style.display='flex');
  closeBtn.addEventListener('click',()=>overlay.style.display='none');

  const restartBtn = document.getElementById('restart-btn');
  restartBtn.addEventListener('click', ()=>{
    overlay.style.display='none';
    document.getElementById('end-overlay').style.display='none';
    reset();
  });
}
