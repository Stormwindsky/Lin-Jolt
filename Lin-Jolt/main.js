// main.js — Version ULTRA ROBUSTE by ChatGPT
const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

// Afficher ou non DevTools
const SHOW_DEV_TOOLS = false;

// Ton fichier local
const LOCAL_HTML_PATH = path.join(__dirname, "HowAndJoinUs.html");
const LOCAL_HTML_URL = pathToFileURL(LOCAL_HTML_PATH).href;

// Liste de pubs (tu peux remettre la tienne)
const AD_BLOCK_DOMAINS = [
  "*://*.doubleclick.net/*",
  "*://*.googlesyndication.com/*",
  "*://*.googleadservices.com/*",
  "*://*.adservice.google.com/*",
  "*://*.pubmatic.com/*",
  "*://*.adnxs.com/*",
  "*://*.criteo.com/*",
  "*://*.zedo.com/*",
  "*://*.outbrain.com/*",
  "*://*.taboola.com/*",
];

// URLs à intercepter
const GAMEJOLT_APP_URLS = [
  "*://gamejolt.com/app*",
  "*://www.gamejolt.com/app*",
  "https://gamejolt.com/app*",
  "https://www.gamejolt.com/app*"
];

// Setup interceptors AVANT la fenêtre
function setupInterceptors() {

  // Bloquage pubs
  session.defaultSession.webRequest.onBeforeRequest(
    { urls: AD_BLOCK_DOMAINS },
    (details, callback) => {
      callback({ cancel: true });
    }
  );

  // Interception réseau (si SPA recharge une ressource)
  session.defaultSession.webRequest.onBeforeRequest(
    { urls: GAMEJOLT_APP_URLS },
    (details, callback) => {
      console.log("[webRequest] Interception :", details.url);
      callback({ redirectURL: LOCAL_HTML_URL });
    }
  );

  // Empêche webviews/popups
  session.defaultSession.on("will-attach-webview", (event) => {
    event.preventDefault();
  });
}


// Création fenêtre
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  //------------------------------------------------------
  //   🚀 INTERCEPTIONS ULTIMES (SPA / React / pushState)
  //------------------------------------------------------

  // Navigation standard (spa ou classique)
  mainWindow.webContents.on("did-start-navigation", (event, url, isInPlace, isMainFrame) => {
    console.log("[did-start-navigation]", url);
    if (isMainFrame && url.startsWith("https://gamejolt.com/app")) {
      event.preventDefault();
      mainWindow.loadFile("HowAndJoinUs.html");
    }
  });

  // Navigation interne (react router / vue router)
  mainWindow.webContents.on("did-navigate-in-page", (event, url) => {
    console.log("[did-navigate-in-page]", url);
    if (url.startsWith("https://gamejolt.com/app")) {
      mainWindow.loadFile("HowAndJoinUs.html");
    }
  });

  // Redirections HTTP
  mainWindow.webContents.on("did-redirect-navigation", (event, url) => {
    console.log("[did-redirect-navigation]", url);
    if (url.startsWith("https://gamejolt.com/app")) {
      event.preventDefault();
      mainWindow.loadFile("HowAndJoinUs.html");
    }
  });

  // Blocage popups
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  //------------------------------------------------------

  // Charger GameJolt
  mainWindow.loadURL("https://gamejolt.com/@Stormwindsky");

  if (SHOW_DEV_TOOLS) {
    mainWindow.webContents.openDevTools();
  }
}


// App ready
app.whenReady().then(() => {
  setupInterceptors();
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Fermeture Linux/Windows
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

