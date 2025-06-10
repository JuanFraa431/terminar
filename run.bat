@echo off
echo Instalando dependencias y ejecutando servidores...

cd Back
if not exist node_modules (
  npm install
)
cd ..

cd Front
if not exist node_modules (
  npm install
)
cd ..

npx concurrently "npm run startBack --prefix Back" "npm run startFront --prefix Front"
pause