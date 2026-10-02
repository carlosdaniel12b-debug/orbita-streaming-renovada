@echo off
chcp 65001 > nul
title Subir Órbita Streaming Renovada a GitHub
color 0B

echo ================================================================
echo    🪐 ÓRBITA STREAMING RENOVADA - SUBIDA A GITHUB
echo ================================================================
echo.
echo Repositorio objetivo:
echo https://github.com/carlosdaniel12b-debug/orbita-streaming-renovada.git
echo.
echo Rama: main
echo.
echo Asegúrate de haber creado el repositorio vacío en GitHub:
echo https://github.com/new (Nombre: orbita-streaming-renovada)
echo.
echo Subiendo código actualizado con efectos Liquid Glass y Arcade Fix...
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo    ✅ ¡SUBIDO EXITOSAMENTE A GITHUB!
    echo ================================================================
    echo Para activar GitHub Pages y tener tu web en vivo:
    echo 1. Entra a: https://github.com/carlosdaniel12b-debug/orbita-streaming-renovada/settings/pages
    echo 2. En "Branch", selecciona "main" y carpeta "/ (root)".
    echo 3. Haz clic en "Save".
    echo.
    echo ¡Tu página web quedará en línea para todo el mundo!
) else (
    echo.
    echo ================================================================
    echo ⚠️ Si es la primera vez, autoriza la ventana que abrió GitHub en tu navegador.
    echo Si el repositorio aún no existe en tu cuenta, créalo en:
    echo https://github.com/new con el nombre: orbita-streaming-renovada
    echo ================================================================
)

echo.
pause
