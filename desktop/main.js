const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        icon: undefined,
        frame: true,
        titleBarStyle: "default",
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true
        }
    });

    Menu.setApplicationMenu(null);
    const startUrl = `file://${path.join(__dirname, "app/index.html")}`;
    mainWindow.loadURL(startUrl);
    mainWindow.setTitle("Shell");
    mainWindow.webContents.openDevTools();
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
