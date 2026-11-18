========================================================================
SHOPZONE JDBC DRIVER INSTRUCTIONS
========================================================================

Place the MySQL Connector/J JAR file in this directory (or in your 
Apache Tomcat `lib/` folder):

Recommended Driver:
- mysql-connector-j-8.3.0.jar (or mysql-connector-java-8.0.33.jar)

Official Download URL:
https://dev.mysql.com/downloads/connector/j/
or from Maven Central:
https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.3.0/mysql-connector-j-8.3.0.jar

When running in Eclipse or IntelliJ IDEA:
Right-click Project -> Build Path -> Add External Archives -> Select the MySQL connector JAR.
When running standalone Tomcat:
Copy `mysql-connector-j-8.3.0.jar` into `<Tomcat_Home>/lib/` or `<Project_Root>/WEB-INF/lib/`.
