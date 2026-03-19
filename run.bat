@echo off
chcp 65001 >nul
REM QClaw Agent Framework - Windows 启动脚本

echo ==========================================
echo   QClaw Agent Framework
echo   无限运行 AI 开发系统
echo ==========================================
echo.

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Node.js，请先安装 Node.js 16+
    exit /b 1
)

echo [✓] Node.js 检查通过

REM 设置工作目录
set "FRAMEWORK_DIR=E:\code\qclaw-agent-framework"
cd /d "%FRAMEWORK_DIR%"

echo [✓] 工作目录: %FRAMEWORK_DIR%

REM 创建必要目录
if not exist "logs" mkdir logs
if not exist "projects" mkdir projects

echo [✓] 目录结构检查完成
echo.

REM 显示当前任务状态
echo ------------------------------------------
echo 当前任务状态:
echo ------------------------------------------
node scripts\status.js
echo.

REM 询问操作
echo ==========================================
echo 选择操作:
echo ==========================================
echo 1. 执行单个任务 (agent-loop.js)
echo 2. 查看状态 (status.js)
echo 3. 初始化新项目 (init-project.js)
echo 4. 退出
echo.
set /p choice="请输入选项 (1-4): "

if "%choice%"=="1" goto run_agent
if "%choice%"=="2" goto show_status
if "%choice%"=="3" goto init_project
if "%choice%"=="4" goto exit

echo 无效选项
goto exit

:run_agent
echo.
echo ==========================================
echo 启动 Agent 主循环...
echo ==========================================
echo.
node scripts\agent-loop.js
goto end

:show_status
echo.
node scripts\status.js
goto end

:init_project
echo.
node scripts\init-project.js
goto end

:exit
echo 已退出

:end
echo.
echo ==========================================
echo 操作完成
echo ==========================================

pause
