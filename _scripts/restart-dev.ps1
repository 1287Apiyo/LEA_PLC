$conn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($conn) {
  $pids = $conn | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($p in $pids) {
    taskkill.exe /PID $p /F /T | Out-Null
    Write-Output "Killed PID $p on port 3000"
  }
  Start-Sleep -Seconds 2
} else {
  Write-Output "No listener on port 3000"
}
