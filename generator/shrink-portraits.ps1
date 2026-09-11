# Shrink portraits to the size the paper actually shows them at.
#
#   powershell -ExecutionPolicy Bypass -File generator\shrink-portraits.ps1
#
# The listing shows 22px thumbnails and the panel shows 84px. Dropping a
# 1024px 1.1MB file straight from the generator would put 60MB of images in
# the repository for 55 people. Centre-crop to a square, resample to 320px,
# save as JPEG quality 82 - enough for a 2x display, about 30KB each.
#
# ASCII only on purpose: Windows PowerShell 5.1 reads a BOM-less UTF-8 script
# as ANSI, which mangles non-ASCII identifiers and can break parsing.

Add-Type -AssemblyName System.Drawing

$dir = (Resolve-Path (Join-Path $PSScriptRoot '..\docs\portraits')).Path
$side = 320
$quality = 82

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [long]$quality)

$before = 0; $after = 0; $count = 0

foreach ($f in Get-ChildItem $dir -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png)$' }) {
  $img = [System.Drawing.Image]::FromFile($f.FullName)
  if ($img.Width -le $side -and $img.Height -le $side) { $img.Dispose(); continue }

  $srcSide = [Math]::Min($img.Width, $img.Height)
  $x = [int](($img.Width - $srcSide) / 2)
  $y = [int](($img.Height - $srcSide) / 2)

  $bmp = New-Object System.Drawing.Bitmap($side, $side)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.DrawImage($img,
    (New-Object System.Drawing.Rectangle(0, 0, $side, $side)),
    (New-Object System.Drawing.Rectangle($x, $y, $srcSide, $srcSide)),
    [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $img.Dispose()

  $srcSize = $f.Length
  $out = Join-Path $dir ($f.BaseName + '.jpg')
  $tmp = $out + '.tmp'
  $bmp.Save($tmp, $encoder, $params)
  $bmp.Dispose()
  Move-Item $tmp $out -Force
  if ($f.Extension -ne '.jpg') { Remove-Item $f.FullName -Force }

  $newSize = (Get-Item $out).Length
  $before += $srcSize; $after += $newSize; $count += 1
  "{0}  {1:N0}KB -> {2:N0}KB" -f $f.BaseName, ($srcSize / 1KB), ($newSize / 1KB)
}

if ($count -eq 0) { "nothing to shrink" }
else { "`n{0} files / {1:N1}MB -> {2:N1}MB" -f $count, ($before / 1MB), ($after / 1MB) }
