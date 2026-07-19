"""Desktop launcher for Mertory.

Starts the FastAPI backend as a subprocess, serves the static frontend
alongside it, opens both in a native (chromeless) pywebview window, and
shuts both servers down cleanly when that window is closed.
"""

import http.server
import os
import socketserver
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request

import webview

import backup

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(os.path.dirname(BACKEND_DIR), "frontend")
# Servers bind to every interface, so a phone on the same LAN can reach
# them — but the desktop app's own health checks and its webview window
# always talk to itself over loopback, since 0.0.0.0 isn't a connectable
# address (only valid as a bind target, not a destination).
BIND_HOST = "0.0.0.0"
LOCAL_HOST = "127.0.0.1"
BACKEND_PORT = 8000
FRONTEND_PORT = 8080
BACKEND_URL = f"http://{LOCAL_HOST}:{BACKEND_PORT}/"
APP_URL = f"http://{LOCAL_HOST}:{FRONTEND_PORT}/index.html"


def is_port_responding(url, timeout=1):
    try:
        urllib.request.urlopen(url, timeout=timeout)
        return True
    except (urllib.error.URLError, ConnectionError, OSError):
        return False


def start_backend():
    """Launch uvicorn as a child process using this venv's own
    interpreter, so it works whether app_launcher.py is run through the
    venv's python.exe directly or via run.bat."""
    creationflags = subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
    log_path = os.path.join(BACKEND_DIR, "app_launcher.log")
    log_file = open(log_path, "a", encoding="utf-8")
    log_file.write(f"\n--- backend started {time.strftime('%Y-%m-%d %H:%M:%S')} ---\n")
    log_file.flush()
    return subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", BIND_HOST, "--port", str(BACKEND_PORT)],
        cwd=BACKEND_DIR,
        stdout=log_file,
        stderr=log_file,
        creationflags=creationflags,
    ), log_file


def wait_until_ready(url, timeout=15):
    deadline = time.time() + timeout
    while time.time() < deadline:
        if is_port_responding(url):
            return True
        time.sleep(0.3)
    return False


class QuietStaticHandler(http.server.SimpleHTTPRequestHandler):
    """Serves the frontend directory; silent, so the console log stays
    readable (the backend log already goes to app_launcher.log)."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def log_message(self, format, *args):
        pass


def start_frontend_server():
    httpd = socketserver.TCPServer((BIND_HOST, FRONTEND_PORT), QuietStaticHandler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd


def main():
    backend_process = None
    backend_log_file = None
    frontend_httpd = None

    try:
        if is_port_responding(BACKEND_URL):
            print("Backend already running on port 8000 — reusing it.")
        else:
            print("Starting backend...")
            backend_process, backend_log_file = start_backend()
            if not wait_until_ready(BACKEND_URL):
                print("Backend did not respond within 15s — check backend/app_launcher.log")

        try:
            backup_path = backup.create_backup_if_needed()
            if backup_path:
                print(f"Otomatik yedek oluşturuldu: {backup_path}")
        except OSError as e:
            # A failed backup shouldn't block the app from opening.
            print(f"Otomatik yedekleme atlandı (hata): {e}")

        if not is_port_responding(f"http://{LOCAL_HOST}:{FRONTEND_PORT}/index.html"):
            print("Starting frontend static server...")
            try:
                frontend_httpd = start_frontend_server()
            except OSError:
                print(f"Port {FRONTEND_PORT} already in use — reusing whatever is serving it.")
        else:
            print("Frontend already served on port 8080 — reusing it.")

        webview.create_window(
            "Mertory",
            APP_URL,
            width=1280,
            height=860,
            min_size=(960, 600),
        )
        webview.start()
    finally:
        print("Window closed, shutting down...")
        if frontend_httpd is not None:
            frontend_httpd.shutdown()
            frontend_httpd.server_close()
        if backend_process is not None:
            backend_process.terminate()
            try:
                backend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                backend_process.kill()
        if backend_log_file is not None:
            backend_log_file.close()


if __name__ == "__main__":
    main()
