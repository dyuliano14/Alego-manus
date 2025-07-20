# Script PowerShell para iniciar sem warnings de deprecação
$env:NODE_OPTIONS = "--no-deprecation"
Set-Location "frontend"
npm run dev
