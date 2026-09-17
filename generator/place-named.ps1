# File a portrait that was saved from the page under its own id.
#
#   powershell -ExecutionPolicy Bypass -File generator\place-named.ps1 -Id h004
#
# The page script saves the newest image as Downloads\shinya_<id>.jpg, so the
# id travels in the file name and nothing has to be guessed from timestamps.
# (Guessing by time broke once the machine slept between steps: a download
# that landed an hour late was rejected as stale.)
#
# ASCII only: Windows PowerShell 5.1 reads BOM-less UTF-8 scripts as ANSI.

param([Parameter(Mandatory = $true)][string]$Id)

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$dl = Join-Path $env:USERPROFILE 'Downloads'
$portraits = Join-Path $root 'docs\portraits'
$done = Join-Path $root 'portraits\done.txt'
if (-not (Test-Path $done)) { New-Item -ItemType File $done | Out-Null }

# shinya_h004.jpg, or shinya_h004 (1).jpg if Chrome had to rename it
$pick = Get-ChildItem $dl -File |
  Where-Object { $_.Name -match ("^shinya_" + [regex]::Escape($Id) + "( \(\d+\))?\.(jpg|jpeg|png)$") } |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

if (-not $pick) {
  Write-Output "NG $Id : Downloads has no shinya_$Id.jpg"
  exit 2
}

Get-ChildItem $portraits -File | Where-Object { $_.BaseName -eq $Id } | Remove-Item -Force
Copy-Item $pick.FullName (Join-Path $portraits ($Id + '.jpg')) -Force
& (Join-Path $PSScriptRoot 'shrink-portraits.ps1') | Out-Null

# move the source aside so a later run cannot pick up a stale copy
$archive = Join-Path $dl 'shinya_filed'
if (-not (Test-Path $archive)) { New-Item -ItemType Directory $archive | Out-Null }
Move-Item $pick.FullName (Join-Path $archive $pick.Name) -Force

$doneIds = @(Get-Content $done)
if ($doneIds -notcontains $Id) { Add-Content $done $Id }

$final = Get-Item (Join-Path $portraits ($Id + '.jpg'))
"OK $Id  $([math]::Round($final.Length / 1KB))KB  (done: $(@(Get-Content $done).Count))"
