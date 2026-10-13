$root = "C:\Users\itosa\OneDrive\Desktop\MilMemory_online"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8931/")
$listener.Start()
Write-Output "listening on 8931"
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $root ($path -replace '/', '\')
    try {
        if (Test-Path $file -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($file)
            $ext = [System.IO.Path]::GetExtension($file)
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css" }
                ".js"   { "application/javascript" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".mp3"  { "audio/mpeg" }
                ".woff" { "font/woff" }
                ".woff2" { "font/woff2" }
                default { "application/octet-stream" }
            }
            $ctx.Response.ContentType = $mime
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $ctx.Response.StatusCode = 404
        }
    } catch {}
    $ctx.Response.Close()
}
