@echo off
echo Instalando dependencias y ejecutando servidores...

cd Back
if not exist node_modules (
  echo Instalando dependencias del BACKEND...
  npm install || goto error
)
cd ..

cd Front
if not exist node_modules (
  echo Instalando dependencias del FRONTEND...
  npm install || goto error
)
cd ..

echo Levantando servidores...
npx concurrently "npm run startBack --prefix Back" "npm run startFront --prefix Front" || goto error

pause
exit

:error
echo ❌ Ocurrió un error. Revisá si tenés Node.js instalado correctamente.
pause
exit
