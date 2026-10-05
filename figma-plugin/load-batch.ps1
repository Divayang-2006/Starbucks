<#
    load-batch.ps1 - copy a Claude Design batch script into the plugin.

    Usage:
        .\figma-plugin\load-batch.ps1 01
        .\figma-plugin\load-batch.ps1 03 -From "D:\downloads"

    Finds the newest file matching <NN>-*.js in your Downloads folder (Claude
    Design re-issues revised copies under the same name, so newest is the one
    you want), copies it over figma-plugin\code.js, and prints what it did.

    After running this, go back to Figma and re-run the plugin.

    NOTE: this file is deliberately ASCII-only. Windows PowerShell 5.1 reads
    .ps1 files as ANSI unless they carry a UTF-8 BOM, and a stray smart quote
    from a mangled em-dash is enough to break the parse.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Batch,

    [string]$From = (Join-Path $env:USERPROFILE 'Downloads')
)

$ErrorActionPreference = 'Stop'

$pluginDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$target    = Join-Path $pluginDir 'code.js'

# Accept "1", "01", "01-tokens", "01-tokens.js"
$prefix = $Batch -replace '\.js$', ''
if ($prefix -match '^\d$') { $prefix = '0' + $prefix }

$candidates = @(Get-ChildItem -Path $From -Filter ($prefix + '*.js') -File -ErrorAction SilentlyContinue |
                Sort-Object LastWriteTime -Descending)

if ($candidates.Count -eq 0) {
    Write-Host ("No file matching '" + $prefix + "*.js' in " + $From) -ForegroundColor Red
    Write-Host 'Newest .js files there:' -ForegroundColor DarkGray
    Get-ChildItem -Path $From -Filter '*.js' -File -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 10 |
        ForEach-Object {
            Write-Host ('   ' + $_.LastWriteTime.ToString('yyyy-MM-dd HH:mm') + '  ' + $_.Name) -ForegroundColor DarkGray
        }
    exit 1
}

$src = $candidates[0]

if ($candidates.Count -gt 1) {
    Write-Host ([string]$candidates.Count + ' matches - taking the newest:') -ForegroundColor Yellow
    foreach ($c in $candidates) {
        if ($c.FullName -eq $src.FullName) { $mark = '  > ' } else { $mark = '    ' }
        Write-Host ($mark + $c.LastWriteTime.ToString('yyyy-MM-dd HH:mm') + '  ' + $c.Name)
    }
}

# Read as UTF-8 and write back as UTF-8 without BOM. These scripts contain
# non-ASCII characters in their log output; a bad round-trip corrupts them.
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$content   = [System.IO.File]::ReadAllText($src.FullName, [System.Text.Encoding]::UTF8)

# The batch scripts never close themselves - each one ends at "})();" with the
# closePlugin call either absent or commented out. A plugin with no UI that
# never closes shows as "Running" forever, which reads exactly like a hang.
# Insert a real close as the last statement INSIDE the async IIFE. It must go
# inside: appended after the IIFE it would run synchronously and kill the
# script the instant it started.
$patched = $false
if ($content -notmatch '(?m)^\s*figma\.closePlugin\(\);\s*$') {
    $idx = $content.LastIndexOf('})();')
    if ($idx -ge 0) {
        $content = $content.Substring(0, $idx) +
                   "  figma.closePlugin();`r`n})();" +
                   $content.Substring($idx + 5)
        $patched = $true
    }
}

[System.IO.File]::WriteAllText($target, $content, $utf8NoBom)

$kb    = [math]::Round($src.Length / 1KB, 1)
$stamp = $src.LastWriteTime.ToString('yyyy-MM-dd HH:mm')

Write-Host ''
Write-Host ('Loaded  ' + $src.Name + '  (' + $kb + ' KB, saved ' + $stamp + ')') -ForegroundColor Green
Write-Host ('     to ' + $target)
if ($patched) {
    Write-Host '     + added figma.closePlugin() so the plugin ends instead of idling' -ForegroundColor DarkGray
} else {
    Write-Host '     (already closes itself - left as is)' -ForegroundColor DarkGray
}
Write-Host ''
Write-Host 'Now in Figma: Plugins > Development > Starbucks DS Batch Runner' -ForegroundColor Cyan
Write-Host 'Save a named version FIRST if you have not already.' -ForegroundColor DarkYellow
