@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "VENV_DIR=%SCRIPT_DIR%backend\venv"

if not exist "%VENV_DIR%\Scripts\activate.bat" (
    echo Sanal ortam bulunamadi: %VENV_DIR%
    echo Once su komutu calistirin: pip install -r backend\requirements.txt
    pause
    exit /b 1
)

call "%VENV_DIR%\Scripts\activate.bat"
cd /d "%SCRIPT_DIR%backend"
python app_launcher.py

if errorlevel 1 (
    echo.
    echo Bir hata olustu. Yukaridaki mesaji kontrol edin.
    pause
)

endlocal
