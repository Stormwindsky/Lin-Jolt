// =================================================================
// 1. LOGIQUE ANTI-PUBLICITÉ (Démarrage précoce)
// =================================================================

function disableAdsInElectron() {
    // Vérifie si la variable 'appConfig' injectée par preload.js existe et est vraie.
    if (window.appConfig && window.appConfig.isElectron) {
        console.log("Application Electron détectée : Suppression des publicités et blocage des scripts.");

        // Liste des sélecteurs CSS à cibler pour les publicités.
        // Vous devez adapter cette liste avec les classes et IDs réels de VOS publicités.
        const selectorsToHide = [
            '.classe-de-vos-pubs',       // Exemple de classe
            '#id-de-votre-banniere',     // Exemple d'ID
            'iframe[src*="ads"]',        // Bloque les iframes avec 'ads' dans leur source
            '#ID_OU_CLASSE_DU_POPUP_PRIME' // Si vous avez identifié le conteneur du popup Prime
        ];

        selectorsToHide.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                // Retirer l'élément complètement du DOM pour ne laisser aucun trou.
                element.remove();
            });
        });

        // Suppression des scripts publicitaires externes
        document.querySelectorAll('script[src*="ads"], script[src*="analytics"]').forEach(script => {
            script.remove();
        });
    }
}

// =================================================================
// 2. FONCTIONNALITÉ DE REMPLACEMENT D'ÉMOJI (🐧 -> Jux.png)
// =================================================================

/**
 * Fonction pour remplacer un caractère Unicode par une image personnalisée.
 *
 * @param {string} targetEmoji - Le caractère Unicode à remplacer (ex: '🐧').
 * @param {string} imageName - Le nom du fichier image ('Jux.png').
 */
function replaceEmojiWithImage(targetEmoji, imageName) {
    // Crée une balise image avec des styles pour s'assurer qu'elle a une taille d'émoji.
    const imageTag = `<img src="${imageName}" alt="${targetEmoji}" style="width: 1em; height: 1em; vertical-align: middle;">`;
    
    // Expression régulière globale pour trouver toutes les occurrences
    const regex = new RegExp(targetEmoji, 'g');

    // Cible le corps de la page
    const container = document.body;

    // Utilise un TreeWalker pour parcourir les nœuds de texte
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    const nodesToReplace = [];

    // Collecter les nœuds de texte
    while (node = walker.nextNode()) {
        // S'assurer de ne pas modifier le contenu à l'intérieur de balises sensibles
        if (node.nodeValue.includes(targetEmoji) && 
            node.parentNode.nodeName !== 'SCRIPT' && 
            node.parentNode.nodeName !== 'STYLE' && 
            node.parentNode.nodeName !== 'TITLE') 
        {
             nodesToReplace.push(node);
        }
    }

    // Remplacer l'émoji dans les nœuds de texte
    nodesToReplace.forEach(textNode => {
        // Crée un nouveau nœud (span) qui contient le HTML de l'image
        const newNode = document.createElement('span');
        newNode.innerHTML = textNode.nodeValue.replace(regex, imageTag);

        // Remplace le nœud de texte original par le nouveau nœud HTML
        textNode.parentNode.replaceChild(newNode, textNode);
    });
}

// =================================================================
// 3. INITIALISATION
// =================================================================

// Exécutez les deux fonctions après que le DOM (Document Object Model) est prêt.
window.addEventListener('load', () => {
    // 1. Lance la logique anti-publicité
    disableAdsInElectron();
    
    // 2. Lance le remplacement d'émoji : '🐧' est remplacé par 'Jux.png'
    replaceEmojiWithImage('🐧', 'Jux.png');
});
