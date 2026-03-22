const { app, BrowserWindow, session } = require('electron');

app.commandLine.appendSwitch('log-level', '3');
app.commandLine.appendSwitch('disable-logging');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Lin-Jolt",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false 
    }
  });

  // --- 1. RÉSEAU (PUBS & REDIRECTION) ---
  const adPatterns = ["doubleclick.net", "pubmatic.com", "googlesyndication.com", "adservice.google.com", "measureadv.com"];
  session.defaultSession.webRequest.onBeforeRequest({ urls: ["*://*/*"] }, (details, callback) => {
    if (details.url.includes('gamejolt.com/app')) {
      return callback({ redirectURL: 'https://gamejolt.com/c/LC-6vqt3d' });
    }
    if (adPatterns.some(p => details.url.includes(p))) return callback({ cancel: true });
    callback({});
  });

  // --- 2. SURVEILLANCE ACTIVE ---
  setInterval(async () => {
    if (win.isDestroyed()) return;

    await win.webContents.executeJavaScript(`
      (function() {
        // A. BOUTON "GET APP"
        document.querySelectorAll('a.button.-outline').forEach(btn => {
          if (btn.innerText.includes('Get App')) btn.innerHTML = 'Linux Community 🐧';
        });

        // B. GESTION DES FILTRES ÉMOJIS
        const isLinuxPage = window.location.href.includes('gamejolt.com/c/LC-6vqt3d');
        
        // Liste des IDs incluant les deux nouveaux (21896746 et 21896761)
        const targetIds = [
          '21896739','21896740','21896741','21896745','21896748','21896749',
          '21896751','21896752','21896754','21896757','21896756','21896758',
          '21896759','21896760','21896763','21896766','21896770','21896764',
          '21896771','21896773','21896738','21896742','21896743','21896744',
          '21896753','21896755','21896765','21896768','21896769','21896772',
          '21896746','21896761' // Les deux manquants rajoutés ici
        ];

        document.querySelectorAll('img').forEach(img => {
          const isTargetEmoji = targetIds.some(id => img.src.includes(id));
          
          if (isLinuxPage && isTargetEmoji) {
            // Applique le filtre si on est sur la bonne page
            img.style.filter = 'hue-rotate(160deg) brightness(1.2) contrast(1.2)';
          } else if (!isLinuxPage && img.style.filter !== '') {
            // RETIRE le filtre si on quitte la page Linux
            img.style.filter = '';
          }
        });

        // C. GESTION DE LA NEIGE
        if (isLinuxPage && !window.snowActive) {
          window.snowActive = true;
          const container = document.createElement('div');
          container.id = 'snow-layer';
          container.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999999;overflow:hidden;';
          document.body.appendChild(container);
          window.snowInterval = setInterval(() => {
            const f = document.createElement('div');
            f.className = 'flake';
            f.innerHTML = '❄';
            f.style = 'color:white;position:absolute;top:-30px;font-size:20px;left:'+(Math.random()*100)+'vw;opacity:'+Math.random();
            container.appendChild(f);
            f.animate([{transform:'translateY(0)'},{transform:'translateY(110vh)'}], {duration:4000}).onfinish=()=>f.remove();
          }, 150);
        } else if (!isLinuxPage && window.snowActive) {
          window.snowActive = false;
          clearInterval(window.snowInterval);
          const c = document.getElementById('snow-layer');
          if (c) c.remove();
        }
      })();
    `);
  }, 1000);

  win.loadURL('https://gamejolt.com/c/LC-6vqt3d');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
