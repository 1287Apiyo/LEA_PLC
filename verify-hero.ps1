$ErrorActionPreference = 'Stop'
$project = 'C:\Users\Volo\Desktop\LEA_PLC\frontend'
$port = 3002
$log = Join-Path $project 'hero-verify.log'
$err = Join-Path $project 'hero-verify.err.log'
Remove-Item $log, $err -Force -ErrorAction SilentlyContinue
$proc = Start-Process -FilePath 'npm.cmd' -ArgumentList @('run','dev','--','--hostname','127.0.0.1','--port', "$port") -WorkingDirectory $project -RedirectStandardOutput $log -RedirectStandardError $err -PassThru
try {
  $ready = $false
  for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 1
    try {
      $response = Invoke-WebRequest -Uri "http://127.0.0.1:$port/" -UseBasicParsing -TimeoutSec 3
      if ($response.StatusCode -eq 200) { $ready = $true; break }
    } catch {}
  }
  if (-not $ready) { throw 'Frontend did not become ready within 30 seconds.' }
  $routes = @('/', '/about', '/corporate', '/programmes/software-engineering', '/programmes/applied-ai', '/programmes/basic-computer-knowledge', '/login', '/register')
  foreach ($route in $routes) {
    $response = Invoke-WebRequest -Uri ("http://127.0.0.1:$port" + $route) -UseBasicParsing -TimeoutSec 20
    "{0}:{1}" -f $route, $response.StatusCode
  }
  $source = Get-Content (Join-Path $project 'components\landing\landing-page.tsx') -Raw
  "hero-full-background:{0}" -f ($source.Contains('absolute inset-0 h-full w-full object-cover'))
  "hero-background-overlay:{0}" -f ($source.Contains('linear-gradient(90deg'))
  "hero-copy-over-image:{0}" -f ($source.Contains('text-white') -and $source.Contains('Build the skills'))
  Write-Output 'verification-complete'
} finally {
  if ($proc -and -not $proc.HasExited) { taskkill.exe /PID $proc.Id /T /F | Out-Null }
}
