import { app, BrowserWindow } from 'electron';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { watch } from 'fs';

const require = createRequire(import.meta.url);
try {
    require('electron-reloader')({ filename: fileURLToPath(import.meta.url) });
} catch (_) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            sandbox: false,
        }
    })
    win.loadFile('index.html');
    watch('.', { recursive: true }, (_, filename) => {
        if (filename && !filename.includes('node_modules')) {
            win.webContents.reload();
        }
    });
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

