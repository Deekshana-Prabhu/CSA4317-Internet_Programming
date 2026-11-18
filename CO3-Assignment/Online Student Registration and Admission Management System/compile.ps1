# Apex Institute - Student Admission Portal Compilation Script (PowerShell)
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host " Compiling Student Admission Management System..." -ForegroundColor White
Write-Host "===============================================================" -ForegroundColor Cyan

if (!(Test-Path "WEB-INF\classes")) {
    New-Item -ItemType Directory -Path "WEB-INF\classes" -Force | Out-Null
}

$cp = "lib\servlet-api.jar;src"
if ($env:CATALINA_HOME) {
    Write-Host "Using Apache Tomcat servlet-api from: $env:CATALINA_HOME\lib\servlet-api.jar" -ForegroundColor Green
    $cp = "lib\servlet-api.jar;$env:CATALINA_HOME\lib\servlet-api.jar;src"
}

$javaFiles = (Get-ChildItem -Path "src" -Recurse -Filter "*.java").FullName

# Locate javac
$javacCmd = "javac"
if (Get-Command "javac" -ErrorAction SilentlyContinue) {
    $javacCmd = "javac"
} elseif (Test-Path "C:\Program Files\Android\Android Studio\jbr\bin\javac.exe") {
    $javacCmd = "C:\Program Files\Android\Android Studio\jbr\bin\javac.exe"
}

Write-Host "Compiling Java source files using: $javacCmd" -ForegroundColor Yellow
& $javacCmd -encoding UTF-8 -cp $cp -d "WEB-INF\classes" $javaFiles

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Compilation completed successfully!" -ForegroundColor Green
    Write-Host "Class files placed in: WEB-INF\classes\" -ForegroundColor Gray
} else {
    Write-Host "`n[ERROR] Compilation failed. Please verify JDK configuration." -ForegroundColor Red
}
