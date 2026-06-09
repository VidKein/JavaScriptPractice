const { ipcRenderer } = require('electron');

document.getElementById('choose').addEventListener('click', async () => {
  const folder = await ipcRenderer.invoke('choose-folder');
  if (!folder) return;
  const result = await ipcRenderer.invoke('write-files', folder);
  document.getElementById('status').textContent = result;
});
