@echo off
REM ==============================================================================
REM Online Examination Portal - Servlet Compilation Script
REM ==============================================================================
echo [INFO] Compiling Java Servlets for Apache Tomcat...

REM Create output directory if it doesn't exist
if not exist "WEB-INF\classes" mkdir "WEB-INF\classes"

REM Check for CATALINA_HOME or local lib
set CLASSPATH_JAR=lib\servlet-api.jar
if defined CATALINA_HOME (
    if exist "%CATALINA_HOME%\lib\servlet-api.jar" (
        set CLASSPATH_JAR=%CATALINA_HOME%\lib\servlet-api.jar
    )
)

echo [INFO] Using classpath: %CLASSPATH_JAR%

REM Compile all Java source files
javac -cp "%CLASSPATH_JAR%" -d WEB-INF\classes src\*.java

if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] All servlets compiled successfully into WEB-INF\classes!
) else (
    echo [ERROR] Compilation failed. Please ensure JDK and servlet-api.jar are available.
)

pause
