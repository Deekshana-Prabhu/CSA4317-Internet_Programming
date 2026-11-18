@echo off
echo ===============================================================
echo  Apex Institute - Student Admission Portal Compilation Script
echo ===============================================================

if not exist "WEB-INF\classes" mkdir "WEB-INF\classes"

:: Check if CATALINA_HOME is set for Apache Tomcat
if defined CATALINA_HOME (
    echo Using Tomcat servlet-api from: %CATALINA_HOME%\lib\servlet-api.jar
    set CLASSPATH="lib\servlet-api.jar;%CATALINA_HOME%\lib\servlet-api.jar;src"
) else (
    echo CATALINA_HOME not set. Using included lib\servlet-api.jar
    set CLASSPATH="lib\servlet-api.jar;src"
)

echo Compiling Java source files...
javac -encoding UTF-8 -cp %CLASSPATH% -d "WEB-INF\classes" src\com\college\admission\*.java src\*.java

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===============================================================
    echo [SUCCESS] Compilation completed successfully!
    echo Class files placed in: WEB-INF\classes\
    echo ===============================================================
) else (
    echo.
    echo [ERROR] Compilation failed. Please ensure JDK/javac is in your PATH.
)
pause
