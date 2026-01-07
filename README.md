# 🐧 Lin-Jolt
**Unofficial Game Jolt Client for Linux** Created by **Stormwindsky** | Licensed under **MIT**

Lin-Jolt is a lightweight Electron-based launcher for Game Jolt on Linux. It features a built-in adblocker, a direct link to the Linux Game Jolt community, and a dedicated "Apps" gallery to run your downloaded Windows games (.exe) via Wine.

---

## 🇬🇧 English Instructions

### Prerequisites
Make sure you have `node`, `npm`, `python3`, and `wine` installed on your Linux system.

### 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/Stormwindsky/Lin-Jolt.git](https://github.com/Stormwindsky/Lin-Jolt.git)
   cd Lin-Jolt

    Create the "Apps" folder (Where your games will be stored)
    Bash

mkdir Apps

Setup Python Virtual Environment (venv)
Bash

python3 -m venv venv
source venv/bin/activate
# No additional python pip installs required for the basic engine, 
# but if you need requests later: pip install requests

Install Node.js dependencies
Bash

    npm install

🚀 How to Run

Make sure your venv is activated, then run:
Bash

npm start

🇫🇷 Instructions en Français
Prérequis

Assurez-vous d'avoir node, npm, python3, et wine installés sur votre système Linux.
🛠️ Installation et Configuration

    Cloner le dépôt
    Bash

git clone [https://github.com/Stormwindsky/Lin-Jolt.git](https://github.com/Stormwindsky/Lin-Jolt.git)
cd Lin-Jolt

Créer le dossier "Apps" (Où vos jeux seront stockés)
Bash

mkdir Apps

Configurer l'environnement virtuel Python (venv)
Bash

python3 -m venv venv
source venv/bin/activate

Installer les dépendances Node.js
Bash

    npm install

🚀 Comment lancer

Assurez-vous que votre venv est activé, puis lancez :
Bash

npm start
