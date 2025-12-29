export function setCommitHash(hash) {
  const el = document.getElementById('commit-hash');
  if (el) el.textContent = hash.slice(0, 7); // short hash
}
