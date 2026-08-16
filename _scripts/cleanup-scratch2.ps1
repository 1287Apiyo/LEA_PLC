Add-Type -AssemblyName Microsoft.VisualBasic
$dir = 'C:\Users\Volo\Desktop\LEASYSTEM\_scripts'
$scratch = @('verify-detail.mjs', 'del-admin-folder.ps1')
foreach ($f in $scratch) {
  $p = Join-Path $dir $f
  if (Test-Path $p) {
    [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($p, 'OnlyErrorDialogs', 'SendToRecycleBin')
    Write-Output "removed $f"
  }
}
