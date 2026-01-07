const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const fetch = require('cross-fetch');

let win;
const pythonExec = path.join(__dirname, 'venv', 'bin', 'python3');

async function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Lin-Jolt - Created by Stormwindsky",
        icon: path.join(__dirname, 'icon.png'), // Assure-toi d'avoir un fichier icon.png
        webPreferences: { 
            nodeIntegration: true, 
            contextIsolation: false 
        }
    });

    const blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);
    blocker.enableBlockingInSession(win.webContents.session);

    // Redirection auto des téléchargements vers /Apps
    win.webContents.session.on('will-download', (event, item) => {
        const filePath = path.join(__dirname, 'Apps', item.getFilename());
        item.setSavePath(filePath);
    });

    win.loadFile('index.html');
}

ipcMain.on('get-apps', (event) => {
    const py = spawn(pythonExec, [path.join(__dirname, 'engine.py')]);
    py.stdout.on('data', (data) => {
        try { event.reply('apps-data', JSON.parse(data.toString())); } 
        catch(e) { console.error("Error parsing Python data"); }
    });
});

ipcMain.on('launch-app', (event, appData) => {
    spawn(pythonExec, [path.join(__dirname, 'engine.py'), '--launch', appData.path, appData.exe]);
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
