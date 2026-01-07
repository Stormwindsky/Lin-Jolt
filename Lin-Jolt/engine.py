import os
import json
import sys
import subprocess
import urllib.request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
APPS_DIR = os.path.join(BASE_DIR, "Apps")

if not os.path.exists(APPS_DIR):
    os.makedirs(APPS_DIR)

def get_installed_apps():
    apps = []
    for item in os.listdir(APPS_DIR):
        item_path = os.path.join(APPS_DIR, item)
        if os.path.isfile(item_path) and item.lower().endswith('.exe'):
            apps.append({"name": item, "path": APPS_DIR, "exe": item})
        elif os.path.isdir(item_path):
            exes = [f for f in os.listdir(item_path) if f.lower().endswith('.exe')]
            if exes:
                apps.append({"name": item, "path": item_path, "exe": exes[0]})
    return apps

def launch_game(game_path, exe_name):
    full_path = os.path.join(game_path, exe_name)
    # Exécution via Wine
    subprocess.Popen(['wine', full_path], cwd=game_path)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "--launch":
            launch_game(sys.argv[2], sys.argv[3])
    else:
        print(json.dumps(get_installed_apps()))
        sys.stdout.flush()
