export function initInfo() {
  const infoBtn = document.getElementById('info-btn');
  const overlay = document.getElementById('info-overlay');
  const closeBtn = document.getElementById('close-info');

  infoBtn.addEventListener('click', () => overlay.style.display='flex');
  closeBtn.addEventListener('click', () => overlay.style.display='none');
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.style.display='none'; });
}
