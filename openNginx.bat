cls 
@ECHO OFF 

SET NGINX_PATH=%~d0: 
SET NGINX_DIR=%cd%\
color 0a 
TITLE Nginx 管理程序 Power By Ants (http://leleroyn.cnblogs.com)
GOTO MENU 
:MENU 
CLS 
ECHO 当前盘符：%~d0
ECHO 当前路径：%cd%\
ECHO 当前执行命令行：%0
ECHO 当前bat文件路径：%~dp0
ECHO 当前bat文件短路径：%~sdp0

ECHO. 
ECHO. * * * *  Nginx 管理程序 Power By Ants (http://leleroyn.cnblogs.com) * * *  
ECHO. * * * * * * * * * * * * * * * * * * * * * * * * 
ECHO. * *                                           *
ECHO. *     1 启动Nginx *                           *
ECHO. * *                                           *
ECHO. *     2 关闭Nginx *                           *
ECHO. * *                                           *
ECHO. *     3 重启Nginx *                           *
ECHO. * *                                           *
ECHO. *     4 退 出 *                               *
ECHO. * *                                           *
ECHO. * * * * * * * * * * * * * * * * * * * * * * * * 
ECHO. 
ECHO.请输入选择项目的序号： 
set /p ID= 
IF "%id%"=="1" GOTO cmd1 
IF "%id%"=="2" GOTO cmd2 
IF "%id%"=="3" GOTO cmd3 
IF "%id%"=="4" EXIT 
PAUSE 
:cmd1 
ECHO. 
ECHO.启动Nginx...... 
IF NOT EXIST %NGINX_DIR%nginx.exe ECHO %NGINX_DIR%nginx.exe不存在 
%NGINX_PATH% 
cd %NGINX_DIR% 
IF EXIST %NGINX_DIR%nginx.exe start %NGINX_DIR%nginx.exe 
ECHO.OK 
PAUSE 
GOTO MENU 
:cmd2 
ECHO. 
ECHO.关闭Nginx...... 
taskkill /F /IM nginx.exe > nul 
ECHO.OK 
PAUSE 
GOTO MENU 
:cmd3 
ECHO. 
ECHO.关闭Nginx...... 
taskkill /F /IM nginx.exe > nul 
ECHO.OK 
GOTO cmd1 
GOTO MENU