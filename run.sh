#!/bin/bash
# QClaw Agent Framework - macOS/Linux 启动脚本

echo "=========================================="
echo "  QClaw Agent Framework"
echo "  无限运行 AI 开发系统"
echo "=========================================="
echo

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "[错误] 未找到 Python3，请先安装 Python 3.8+"
    exit 1
fi

echo "[✓] Python 检查通过"

# 设置工作目录
FRAMEWORK_DIR="/mnt/e/code/qclaw-agent-framework"
cd "$FRAMEWORK_DIR" || exit 1

echo "[✓] 工作目录: $FRAMEWORK_DIR"

# 创建必要目录
mkdir -p logs projects

echo "[✓] 目录结构检查完成"
echo

# 显示当前任务状态
echo "------------------------------------------"
echo "当前任务状态:"
echo "------------------------------------------"
python3 -c "import json; d=json.load(open('tasks.json')); print(f'  总计: {d[\"total_tasks\"]} | 已完成: {d[\"completed\"]} | 进行中: {d[\"in_progress\"]} | 待处理: {d[\"pending\"]}')" 2>/dev/null || echo "  无法读取任务状态"
echo

# 启动主循环
echo "=========================================="
echo "启动 Agent 主循环..."
echo "按 Ctrl+C 停止"
echo "=========================================="
echo

python3 scripts/agent_loop.py

echo
echo "=========================================="
echo "Agent Framework 已停止"
echo "=========================================="
