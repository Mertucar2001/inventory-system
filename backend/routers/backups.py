from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
import backup

router = APIRouter()

@router.get("/")
def get_backups():
    return backup.list_backups()

@router.post("/")
def trigger_backup():
    path = backup.create_backup()
    if path is None:
        raise HTTPException(status_code=404, detail="Veritabanı dosyası bulunamadı")
    return {"filename": os.path.basename(path)}

@router.get("/{filename}/download")
def download_backup(filename: str):
    # Only ever serve filenames list_backups() itself discovered on disk —
    # that set is already limited to the safe atolye_YYYY-MM-DD_HHMM.db
    # pattern, so this can't be used to path-traverse to arbitrary files.
    known = {b["filename"] for b in backup.list_backups()}
    if filename not in known:
        raise HTTPException(status_code=404, detail="Yedek bulunamadı")
    return FileResponse(
        os.path.join(backup.BACKUP_DIR, filename),
        media_type="application/octet-stream",
        filename=filename,
    )
