@echo off
chcp 65001 >nul
REM QClaw Agent Framework - 自动化任务生成向导

echo ==========================================
echo   QClaw Agent Framework
echo   自动化任务生成向导
echo ==========================================
echo.
echo 这个向导会帮你自动生成开发任务列表。
echo 你只需要描述需求，AI会分析并生成详细的任务。
echo.

REM 设置工作目录
set "FRAMEWORK_DIR=E:\code\qclaw-agent-framework"
cd /d "%FRAMEWORK_DIR%"

echo 请选择操作:
echo.
echo [1] 生成新项目的任务列表
echo [2] 优化现有任务列表
echo [3] 查看当前任务
echo [4] 清空任务重新开始
echo [5] 退出
echo.

set /p choice="请输入选项 (1-5): "

if "%choice%"=="1" goto generate
if "%choice%"=="2" goto optimize
if "%choice%"=="3" goto view
if "%choice%"=="4" goto clear
if "%choice%"=="5" goto exit

echo 无效选项
goto end

:generate
echo.
echo ==========================================
echo 生成新任务列表
echo ==========================================
echo.
echo 请在 QClaw 中发送以下提示词：
echo.
echo --------------------------------------------------
echo 请为我的项目生成开发任务列表。
echo.
echo 项目名称: [输入你的项目名]
echo 项目描述: [输入项目一句话描述]
echo 需求: [详细描述功能需求]
echo.
echo 请分析需求，生成详细的开发任务列表，
echo 保存到 E:\code\qclaw-agent-framework\tasks.json
echo.
echo 要求：
echo 1. 每个任务2小时内可完成
echo 2. 包含项目初始化、数据库、后端、前端、测试
echo 3. 标注优先级（high/medium/low）
echo 4. 预估每个任务的耗时
echo 5. 任务描述要具体明确
echo --------------------------------------------------
echo.
pause
goto end

:optimize
echo.
echo ==========================================
echo 优化现有任务列表
echo ==========================================
echo.
echo 请在 QClaw 中发送以下提示词：
echo.
echo --------------------------------------------------
echo 请优化当前的任务列表。
echo.
echo 当前任务文件: E:\code\qclaw-agent-framework\tasks.json
echo.
echo 我的反馈: [描述你想修改的地方]
echo - 例如：任务粒度太粗，需要更细
echo - 例如：缺少测试相关的任务
echo - 例如：任务3和4可以合并
echo.
echo 请读取当前任务，根据反馈优化，
echo 然后保存回 tasks.json。
echo --------------------------------------------------
echo.
pause
goto end

:view
echo.
node scripts\status.js
pause
goto end

:clear
echo.
echo ⚠️ 确定要清空所有任务吗？
pause
node scripts\task-manager.js clear
echo.
echo 任务已清空，可以重新生成。
pause
goto end

:exit
echo 已退出

:end
