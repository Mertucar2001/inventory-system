"""Local backup for atolye.db.

Copies the SQLite file into backend/yedekler/ with a timestamped name
(atolye_YYYY-MM-DD_HHMM.db) and prunes the folder down to the most
recent MAX_BACKUPS afterward, so it never grows without bound.

Can be run directly (python backup.py) or imported by app_launcher.py
(once-per-day auto backup) and routers/backups.py (manual "Şimdi
Yedekle" trigger + listing/downloading existing backups).
"""

import os
import re
import shutil
from datetime import date, datetime

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BACKEND_DIR, "atolye.db")
BACKUP_DIR = os.path.join(BACKEND_DIR, "yedekler")
MAX_BACKUPS = 30

FILENAME_RE = re.compile(r"^atolye_(\d{4}-\d{2}-\d{2})_(\d{2})(\d{2})\.db$")


def _backup_filename(when):
    return f"atolye_{when.strftime('%Y-%m-%d_%H%M')}.db"


def _parse_backup_datetime(filename):
    match = FILENAME_RE.match(filename)
    if not match:
        return None
    date_part, hour, minute = match.groups()
    return datetime.strptime(f"{date_part} {hour}:{minute}", "%Y-%m-%d %H:%M")


def list_backups():
    """Existing backups, newest first. The timestamp is parsed from the
    filename rather than read from file mtime, since copying a file
    preserves the *source*'s mtime, not the moment the copy was made."""
    if not os.path.isdir(BACKUP_DIR):
        return []
    entries = []
    for filename in os.listdir(BACKUP_DIR):
        when = _parse_backup_datetime(filename)
        if when is None:
            continue
        path = os.path.join(BACKUP_DIR, filename)
        entries.append({
            "filename": filename,
            "created_at": when.isoformat(),
            "size": os.path.getsize(path),
        })
    entries.sort(key=lambda e: e["created_at"], reverse=True)
    return entries


def _prune(keep=MAX_BACKUPS):
    for old in list_backups()[keep:]:
        try:
            os.remove(os.path.join(BACKUP_DIR, old["filename"]))
        except OSError:
            pass


def create_backup():
    """Always makes a new backup, then prunes down to MAX_BACKUPS.
    Returns the backup's full path, or None if there's no database yet."""
    if not os.path.exists(DB_PATH):
        return None
    os.makedirs(BACKUP_DIR, exist_ok=True)
    dest = os.path.join(BACKUP_DIR, _backup_filename(datetime.now()))
    shutil.copy(DB_PATH, dest)
    _prune()
    return dest


def has_backup_today():
    today = date.today().isoformat()
    return any(b["filename"].startswith(f"atolye_{today}") for b in list_backups())


def create_backup_if_needed():
    """For app startup — skip if a backup was already taken today."""
    if has_backup_today():
        return None
    return create_backup()


if __name__ == "__main__":
    result = create_backup()
    if result:
        print(f"Yedek oluşturuldu: {result}")
    else:
        print(f"Veritabanı bulunamadı, yedek alınamadı: {DB_PATH}")
