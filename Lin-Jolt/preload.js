const { contextBridge, shell } = require('electron'); // 🚨 'shell' est ajouté pour ouvrir le navigateur par défaut

// URL DIRECTE DE L'IMAGE pour le remplacement d'émoji
const JUX_IMAGE_URL = 'https://raw.githubusercontent.com/Stormwindsky/Lin-Jolt-Emoji-License-Only/refs/heads/main/Jux.png';

// --- Logique de Remplacement d'Émoji ---

function replaceEmojiWithImage(targetEmoji, imageURL) {
    const imageTag = `<img src="${imageURL}" alt="${targetEmoji}" style="width: 1em; height: 1em; vertical-align: middle; max-width: 100%; max-height: 100%;">`;
    const regex = new RegExp(targetEmoji, 'g');
    const container = document.body;

    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    const nodesToReplace = [];

    while (node = walker.nextNode()) {
        if (node.nodeValue.includes(targetEmoji) && 
            node.parentNode.nodeName !== 'SCRIPT' && 
            node.parentNode.nodeName !== 'STYLE' && 
            node.parentNode.nodeName !== 'TITLE') 
        {
             nodesToReplace.push(node);
        }
    }

    nodesToReplace.forEach(textNode => {
        const newNode = document.createElement('span');
        newNode.innerHTML = textNode.nodeValue.replace(regex, imageTag);
        textNode.parentNode.replaceChild(newNode, textNode);
    });
}

function hideDefaultEmoji() {
    const style = document.createElement('style');
    style.innerHTML = `
        [data-emoji="🐧"] { visibility: hidden !important; }
    `;
    document.head.appendChild(style);
}

const observerConfig = { childList: true, subtree: true, characterData: true };
const observer = new MutationObserver((mutations, obs) => {
    replaceEmojiWithImage('🐧', JUX_IMAGE_URL);
});

// --- Logique de Gestion des Liens (Nouveau) ---

function setupLinkHandling() {
    document.addEventListener('click', (event) => {
        const target = event.target.closest('a');
        if (!target) return; // Ce n'est pas un lien

        const url = target.href;
        
        // 1. Gère uniquement les liens http/https (ignore les ancres, mailto:, etc.)
        if (url.startsWith('http://') || url.startsWith('https://')) {
            event.preventDefault(); // Stoppe le comportement par défaut (qui échouerait)

            // 2. 🚨 Règle Spéciale pour YouTube
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                // Ouvre YouTube dans le navigateur par défaut (shell.openExternal)
                shell.openExternal(url);
            } else {
                // Laisse l'application Electron gérer les autres URL (Game Jolt, etc.)
                window.location.href = url;
            }
        }
    });
}

// --- Point d'entrée ---
contextBridge.exposeInMainWorld('appConfig', { isElectron: true });

window.addEventListener('DOMContentLoaded', () => {
    // 1. Initialiser la gestion des liens
    // Seulement si nous sommes sur la page HTML locale (protocole file://)
    if (window.location.protocol === 'file:') {
        setupLinkHandling();
    }
    
    // 2. Logique de remplacement d'émoji (active pour toutes les pages)
    hideDefaultEmoji();
    replaceEmojiWithImage('🐧', JUX_IMAGE_URL); 
    observer.observe(document.body, observerConfig);
});
