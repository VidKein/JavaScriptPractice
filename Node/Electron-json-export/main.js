const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('choose-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('write-files', async (event, folderPath) => {
  const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
  const json = JSON.parse(data);

  const lines = Object.entries(json).map(([id, obj]) => {
    const [x, y] = obj.position;
    return `${id};${x};${y};${obj.vycka};${obj.date};${obj.systemCoordinates};${obj.positionType}`;
  });

  const output = lines.join('\n');

  fs.writeFileSync(path.join(folderPath, 'output.csv'), output, 'utf8');
  fs.writeFileSync(path.join(folderPath, 'output.txt'), output, 'utf8');

  return 'Файлы успешно сохранены.';
});
