@echo off
REM ==============================================================================
REM Package WAR Script for Apache Tomcat Deployment
REM ==============================================================================
echo [INFO] Packaging OnlineExamPortal.war...

call compile.bat

jar -cvf OnlineExamPortal.war index.html login.html login.jsp dashboard.jsp instructions.jsp exam.jsp result.jsp session-demo.jsp css js WEB-INF

if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] OnlineExamPortal.war created successfully!
    echo [INFO] Deploy this WAR into your Apache Tomcat 'webapps' folder.
) else (
    echo [ERROR] Failed to package WAR file.
)

pause
