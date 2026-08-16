Add-Type -AssemblyName Microsoft.VisualBasic
$dir = 'C:\Users\Volo\Desktop\LEASYSTEM\_scripts'
$scratch = @(
  'check-firestore.ps1', 'create-db.ps1', 'curl-test.ps1', 'enable-firestore.ps1',
  'setup-firestore.ps1', 'remove-mocks-dir.ps1', 'remove-test-data.ps1', 'remove-test-files.ps1',
  'db-body.json', 'login-body.json', 'db-create-err.txt', 'db-get-err.txt', 'db-get-out.txt',
  'db-list-err.txt', 'db-list-out.txt', 'enable-err.txt', 'enable-out.txt',
  'final-proof.mjs', 'verify-api.mjs'
)
foreach ($f in $scratch) {
  $p = Join-Path $dir $f
  if (Test-Path $p) {
    [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($p, 'OnlyErrorDialogs', 'SendToRecycleBin')
    Write-Output "removed $f"
  }
}
