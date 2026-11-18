# ==============================================================================
# Online Examination Portal - PowerShell Compilation Script
# ==============================================================================
Write-Host "[INFO] Compiling Java Servlets for Apache Tomcat..." -ForegroundColor Cyan

$classesDir = Join-Path $PSScriptRoot "WEB-INF\classes"
if (-not (Test-Path $classesDir)) {
    New-Item -ItemType Directory -Path $classesDir -Force | Out-Null
}

$servletJar = Join-Path $PSScriptRoot "lib\servlet-api.jar"
if ($env:CATALINA_HOME -and (Test-Path "$env:CATALINA_HOME\lib\servlet-api.jar")) {
    $servletJar = "$env:CATALINA_HOME\lib\servlet-api.jar"
}

# Check for javac in PATH or fallback to Android Studio JBR
$javac = "javac"
if (-not (Get-Command javac -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files\Android\Android Studio\jbr\bin\javac.exe") {
        $javac = "C:\Program Files\Android\Android Studio\jbr\bin\javac.exe"
    }
}

Write-Host "[INFO] Using Compiler: $javac" -ForegroundColor DarkGray
Write-Host "[INFO] Using Classpath: $servletJar" -ForegroundColor DarkGray

$srcFiles = Get-ChildItem -Path (Join-Path $PSScriptRoot "src\*.java") | Select-Object -ExpandProperty FullName
& $javac -cp "$servletJar" -d "$classesDir" $srcFiles

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] All Java Servlets compiled successfully into WEB-INF\classes!" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Compilation failed with exit code $LASTEXITCODE" -ForegroundColor Red
}
