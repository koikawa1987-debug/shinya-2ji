# Take the newest Gemini image from Downloads and file it as one person's portrait.
#
#   powershell -ExecutionPolicy Bypass -File generator\place-portrait.ps1 -Id h001
#
# Guards against filing the wrong picture:
#   - only files named Gemini_Generated_Image_* written in the last 15 minutes
#   - skips any file whose name OR content hash was already used
#     (a late second download of the same image must not be given to the
#     next person)
# Records the id in portraits/done.txt so a run that stops (for example on
# the free quota) can resume from where it left off.
#
# ASCII only: Windows PowerShell 5.1 reads BOM-less UTF-8 scripts as ANSI.

param([Parameter(Mandatory = $true)][string]$Id)

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$dl = Join-Path $env:USERPROFILE 'Downloads'
$portraits = Join-Path $root 'docs\portraits'
$used = Join-Path $root 'portraits\used.txt'
$hashes = Join-Path $root 'portraits\used-hashes.txt'
$done = Join-Path $root 'portraits\done.txt'

foreach ($f in @($used, $hashes, $done)) { if (-not (Test-Path $f)) { New-Item -ItemType File $f | Out-Null } }
$usedNames = @(Get-Content $used)
$usedHashes = @(Get-Content $hashes)

$cutoff = (Get-Date).AddMinutes(-15)
$candidates = Get-ChildItem $dl -File |
  Where-Object { $_.Name -like 'Gemini_Generated_Image_*' -and $_.Extension -match '^\.(jpg|jpeg|png)$' } |
  Where-Object { $_.LastWriteTime -gt $cutoff -and ($usedNames -notcontains $_.Name) } |
  Sort-Object LastWriteTime -Descending

$pick = $null
$pickHash = $null
foreach ($c in $candidates) {
  $h = (Get-FileHash $c.FullName -Algorithm SHA256).Hash
  if ($usedHashes -contains $h) {
    Add-Content $used $c.Name   # a duplicate of something already filed
    continue
  }
  $pick = $c; $pickHash = $h; break
}

if (-not $pick) {
  Write-Output "NG $Id : no new Gemini image in Downloads"
  exit 2
}

Get-ChildItem $portraits -File | Where-Object { $_.BaseName -eq $Id } | Remove-Item -Force

$dest = Join-Path $portraits ($Id + $pick.Extension.ToLower())
Copy-Item $pick.FullName $dest -Force
Add-Content $used $pick.Name
Add-Content $hashes $pickHash

# any other file already present with the same bytes is the same picture
foreach ($c in $candidates) {
  if ($c.Name -ne $pick.Name) {
    $h = (Get-FileHash $c.FullName -Algorithm SHA256).Hash
    if ($h -eq $pickHash) { Add-Content $used $c.Name }
  }
}

& (Join-Path $PSScriptRoot 'shrink-portraits.ps1') | Out-Null

$doneIds = @(Get-Content $done)
if ($doneIds -notcontains $Id) { Add-Content $done $Id }

$final = Get-ChildItem $portraits -File | Where-Object { $_.BaseName -eq $Id } | Select-Object -First 1
"OK $Id <- $($pick.Name)  $([math]::Round($final.Length / 1KB))KB  (done: $(@(Get-Content $done).Count))"
