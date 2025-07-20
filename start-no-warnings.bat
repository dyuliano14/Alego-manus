@echo off
REM Script para iniciar o servidor de desenvolvimento sem warnings de deprecação
set NODE_OPTIONS=--no-deprecation
cd frontend
npm run dev
