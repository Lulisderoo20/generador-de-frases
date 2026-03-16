param(
  [string]$OutputDirectory = (Join-Path $PSScriptRoot "..\assets")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

function New-Color([string]$hex) {
  return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function New-RoundedPath([float]$x, [float]$y, [float]$width, [float]$height, [float]$radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $radius * 2

  $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
  $path.AddArc($x + $width - $diameter, $y, $diameter, $diameter, 270, 90)
  $path.AddArc($x + $width - $diameter, $y + $height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($x, $y + $height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Set-GraphicsQuality([System.Drawing.Graphics]$graphics) {
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
}

function Save-Icon([int]$size, [string]$path) {
  $bitmap = New-Object System.Drawing.Bitmap $size, $size
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  Set-GraphicsQuality $graphics

  $rect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
  $backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, (New-Color "#0e0f14"), (New-Color "#25131e"), 40
  $shape = New-RoundedPath 14 14 ($size - 28) ($size - 28) ($size * 0.18)

  $graphics.Clear((New-Color "#0b0b0e"))
  $graphics.FillPath($backgroundBrush, $shape)

  $glowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(42, (New-Color "#f4d0a2")))
  $graphics.FillEllipse($glowBrush, [int]($size * 0.08), [int]($size * 0.08), [int]($size * 0.44), [int]($size * 0.44))
  $graphics.FillEllipse($glowBrush, [int]($size * 0.58), [int]($size * 0.62), [int]($size * 0.28), [int]($size * 0.28))

  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(90, (New-Color "#f4d0a2")), [float]($size * 0.012))
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLine($pen, [int]($size * 0.18), [int]($size * 0.19), [int]($size * 0.82), [int]($size * 0.19))
  $graphics.DrawLine($pen, [int]($size * 0.35), [int]($size * 0.78), [int]($size * 0.65), [int]($size * 0.78))

  $fontStyle = [System.Drawing.FontStyle]::Bold -bor [System.Drawing.FontStyle]::Italic
  $letterFont = New-Object System.Drawing.Font -ArgumentList @("Georgia", [float]($size * 0.46), $fontStyle, [System.Drawing.GraphicsUnit]::Pixel)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(48, (New-Color "#f4d0a2")))
  $accentBrush = New-Object System.Drawing.SolidBrush (New-Color "#f4d0a2")

  $graphics.DrawString("L", $letterFont, $shadowBrush, ($size / 2) + ($size * 0.02), ($size / 2) + ($size * 0.03), $format)
  $graphics.DrawString("L", $letterFont, $accentBrush, $size / 2, ($size / 2) - ($size * 0.01), $format)

  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

  $format.Dispose()
  $letterFont.Dispose()
  $accentBrush.Dispose()
  $shadowBrush.Dispose()
  $pen.Dispose()
  $glowBrush.Dispose()
  $shape.Dispose()
  $backgroundBrush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

function Save-OgImage([string]$path) {
  $width = 1200
  $height = 630
  $bitmap = New-Object System.Drawing.Bitmap $width, $height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  Set-GraphicsQuality $graphics

  $rect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
  $backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, (New-Color "#0d1016"), (New-Color "#21141e"), 28
  $graphics.FillRectangle($backgroundBrush, $rect)

  $softBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(46, (New-Color "#f4d0a2")))
  $coolBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(36, (New-Color "#8db3ff")))
  $graphics.FillEllipse($softBrush, -40, -60, 360, 360)
  $graphics.FillEllipse($coolBrush, 870, 280, 280, 280)

  $panelPath = New-RoundedPath 46 46 1108 538 36
  $panelBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(26, 255, 255, 255))
  $panelPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(38, (New-Color "#f4d0a2")), 2)
  $graphics.FillPath($panelBrush, $panelPath)
  $graphics.DrawPath($panelPen, $panelPath)

  $labelFont = New-Object System.Drawing.Font -ArgumentList @("Segoe UI Semibold", [float]18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $bodyFont = New-Object System.Drawing.Font -ArgumentList @("Segoe UI", [float]26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $titleStyle = [System.Drawing.FontStyle]::Bold -bor [System.Drawing.FontStyle]::Italic
  $titleFont = New-Object System.Drawing.Font -ArgumentList @("Georgia", [float]88, $titleStyle, [System.Drawing.GraphicsUnit]::Pixel)
  $miniTitleFont = New-Object System.Drawing.Font -ArgumentList @("Georgia", [float]42, $titleStyle, [System.Drawing.GraphicsUnit]::Pixel)
  $labelBrush = New-Object System.Drawing.SolidBrush (New-Color "#f4d0a2")
  $textBrush = New-Object System.Drawing.SolidBrush (New-Color "#f8efe6")
  $softTextBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(212, (New-Color "#f8efe6")))
  $layout = New-Object System.Drawing.RectangleF 92, 84, 620, 420

  $graphics.DrawString("LUCHI STORY MAKER", $labelFont, $labelBrush, 92, 82)
  $graphics.DrawString("Frases listas para historia", $titleFont, $textBrush, $layout)
  $graphics.DrawString("Genera, descarga y comparte historias 1080 x 1920 con firma automatica y look editorial.", $bodyFont, $softTextBrush, 98, 338)
  $graphics.DrawString("@luchilisdero", $miniTitleFont, $labelBrush, 96, 460)

  $storyPath = New-RoundedPath 864 98 226 434 26
  $storyRect = New-Object System.Drawing.Rectangle 864, 98, 226, 434
  $storyBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $storyRect, (New-Color "#100d14"), (New-Color "#19141d"), 90
  $storyPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(56, (New-Color "#f4d0a2")), 2)
  $graphics.FillPath($storyBrush, $storyPath)
  $graphics.DrawPath($storyPen, $storyPath)

  $graphics.DrawLine($storyPen, 892, 136, 1062, 136)
  $graphics.DrawLine($storyPen, 931, 485, 1023, 485)

  $quoteFont = New-Object System.Drawing.Font -ArgumentList @("Georgia", [float]152, $titleStyle, [System.Drawing.GraphicsUnit]::Pixel)
  $quoteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(36, (New-Color "#f4d0a2")))
  $graphics.DrawString("`"", $quoteFont, $quoteBrush, 904, 150)

  $storyTextRect = New-Object System.Drawing.RectangleF 898, 190, 160, 220
  $storyTextFont = New-Object System.Drawing.Font -ArgumentList @("Georgia", [float]30, $titleStyle, [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.DrawString("Lo que vibra con vos vuelve distinto.", $storyTextFont, $textBrush, $storyTextRect)
  $graphics.DrawString("@luchilisdero", $labelFont, $labelBrush, 901, 500)

  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

  $storyTextFont.Dispose()
  $quoteBrush.Dispose()
  $quoteFont.Dispose()
  $storyPen.Dispose()
  $storyBrush.Dispose()
  $storyPath.Dispose()
  $softTextBrush.Dispose()
  $textBrush.Dispose()
  $labelBrush.Dispose()
  $miniTitleFont.Dispose()
  $titleFont.Dispose()
  $bodyFont.Dispose()
  $labelFont.Dispose()
  $panelPen.Dispose()
  $panelBrush.Dispose()
  $panelPath.Dispose()
  $coolBrush.Dispose()
  $softBrush.Dispose()
  $backgroundBrush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

if (-not (Test-Path $OutputDirectory)) {
  New-Item -ItemType Directory -Path $OutputDirectory | Out-Null
}

Save-Icon -size 192 -path (Join-Path $OutputDirectory "icon-192.png")
Save-Icon -size 512 -path (Join-Path $OutputDirectory "icon-512.png")
Save-Icon -size 180 -path (Join-Path $OutputDirectory "apple-touch-icon.png")
Save-OgImage -path (Join-Path $OutputDirectory "og-image.png")

Write-Output "Assets generated in $OutputDirectory"
