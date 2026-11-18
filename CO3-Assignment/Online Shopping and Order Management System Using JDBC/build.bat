@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   SHOPZONE - Java Servlets and JDBC Build Script
echo ============================================================

REM 1. Check for javac
where javac >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] 'javac' is not found in your system PATH!
    echo Please install JDK 8 or higher and add its bin folder to PATH.
    echo Example: set PATH=C:\Program Files\Java\jdk-17\bin;%%PATH%%
    pause
    exit /b 1
)

REM 2. Determine CATALINA_HOME / Tomcat Lib
if "%CATALINA_HOME%"=="" (
    echo [INFO] CATALINA_HOME is not set. Searching common Tomcat directories...
    if exist "C:\Program Files\Apache Software Foundation\Tomcat 9.0\lib\servlet-api.jar" (
        set "TOMCAT_LIB=C:\Program Files\Apache Software Foundation\Tomcat 9.0\lib"
    ) else if exist "C:\apache-tomcat-9.0\lib\servlet-api.jar" (
        set "TOMCAT_LIB=C:\apache-tomcat-9.0\lib"
    ) else (
        set "TOMCAT_LIB=WEB-INF\lib"
    )
) else (
    set "TOMCAT_LIB=%CATALINA_HOME%\lib"
)

REM 3. Create target directory
if not exist "WEB-INF\classes" mkdir "WEB-INF\classes"

echo [1/3] Gathering Java source files...
dir /s /b src\*.java > sources.txt

echo [2/3] Compiling Java classes to WEB-INF\classes...
javac -encoding UTF-8 -cp "WEB-INF\classes;%TOMCAT_LIB%\servlet-api.jar;%TOMCAT_LIB%\jsp-api.jar;WEB-INF\lib\*" -d WEB-INF\classes @sources.txt

if %ERRORLEVEL% equ 0 (
    echo [3/3] Build SUCCESSFUL! All classes compiled into WEB-INF\classes.
    del sources.txt >nul 2>nul
) else (
    echo [ERROR] Compilation failed. Please ensure servlet-api.jar is in classpath.
    del sources.txt >nul 2>nul
    pause
    exit /b 1
)

echo ============================================================
echo   SHOPZONE is ready to deploy on Apache Tomcat!
echo ============================================================
pause
