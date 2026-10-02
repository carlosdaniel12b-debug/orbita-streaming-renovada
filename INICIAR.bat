@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Para el servidor opcional instala Node.js 20 o posterior.
  echo Puedes abrir index.html directamente para usar el sitio sin servidor.
  pause
  exit /b 1
)
echo Abre http://127.0.0.1:4174 en tu navegador.
node server.cjs
