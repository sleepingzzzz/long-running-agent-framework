@echo off
REM Long Running Agent Framework - Environment Setup (Windows)

echo Setting up environment variables...

REM Set framework directory
set "LRAF_WORKSPACE=%~dp0"
if "%LRAF_WORKSPACE:~-1%"=="\" set "LRAF_WORKSPACE=%LRAF_WORKSPACE:~0,-1%"

echo LRAF_WORKSPACE=%LRAF_WORKSPACE%

REM Add to system environment (requires admin)
echo.
echo To permanently add to system environment, run as administrator:
echo   setx LRAF_WORKSPACE "%LRAF_WORKSPACE%"
echo.

echo Environment setup complete!
echo.
echo You can now use the framework from any directory.
echo.
pause
