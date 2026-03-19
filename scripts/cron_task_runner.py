#!/usr/bin/env python3
"""
Cron 调度的任务执行器
每次运行时检查是否有待处理任务，有则创建子代理执行
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime

# Use environment variable or auto-detect
import os
FRAMEWORK_DIR = Path(os.environ.get("LRAF_WORKSPACE", "E:/code/long-running-agent-framework"))
TASKS_FILE = FRAMEWORK_DIR / "tasks.json"
WORK_SPEC_FILE = FRAMEWORK_DIR / "WORK_SPEC.md"
CONFIG_FILE = FRAMEWORK_DIR / "config.json"
LOGS_DIR = FRAMEWORK_DIR / "logs"


def log(msg: str):
    """打印并记录日志"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {msg}")


def load_json(path: Path) -> dict:
    """加载JSON文件"""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_next_pending_task() -> dict | None:
    """获取下一个待处理任务"""
    tasks = load_json(TASKS_FILE)
    for task in tasks["tasks"]:
        if task["status"] == "pending":
            return task
    return None


def build_task_prompt(task: dict) -> str:
    """构建任务提示词"""
    work_spec = WORK_SPEC_FILE.read_text(encoding="utf-8")
    config = load_json(CONFIG_FILE)
    
    prompt = f"""你是 QClaw Agent Framework 的 AI 开发工程师。

# 工作规范
{work_spec}

# 当前任务信息

任务ID: {task['id']}
任务标题: {task['title']}
任务描述: {task['description']}
优先级: {task['priority']}
预计耗时: {task['estimated_hours']}小时

# 项目信息

项目名称: {config['project_name']}
项目描述: {config['project_description']}
项目路径: {FRAMEWORK_DIR}/{config['project_path']}

# 你的工作流程

1. 读取 {TASKS_FILE}，将任务 {task['id']} 标记为 "in_progress"
2. 按照工作规范完成开发任务
3. 完成后更新 {TASKS_FILE}，将任务标记为 "completed"
4. 在 {FRAMEWORK_DIR}/progress.txt 记录详细工作日志
5. 执行 Git Commit，提交信息格式: "[Task {task['id']}] {task['title']}"

# 重要规则

- ✅ 所有文件操作都在 {FRAMEWORK_DIR} 目录下
- ✅ 项目代码存放在 {FRAMEWORK_DIR}/projects 下
- ✅ 如果需要人工介入（如配置数据库、API Key），请明确说明
- ❌ 不要修改 {FRAMEWORK_DIR} 目录外的任何文件
- ❌ 不要删除任何已有文件，除非确实需要替换

# 输出要求

完成后请回复:
1. 任务完成状态
2. 主要完成的工作内容
3. 测试结果
4. Git commit hash

请开始执行任务 {task['id']}: {task['title']}
"""
    return prompt


def main():
    """主函数"""
    log("=" * 50)
    log("QClaw Agent Framework - Cron 任务检查器")
    log("=" * 50)
    
    # 检查是否有待处理任务
    task = get_next_pending_task()
    
    if task is None:
        log("✅ 没有待处理任务，跳过本次执行")
        return 0
    
    log(f"📋 发现待处理任务: [{task['id']}] {task['title']}")
    log(f"📝 {task['description']}")
    
    # 构建提示词
    prompt = build_task_prompt(task)
    
    # 输出提示词（供 QClaw 使用）
    log("🤖 请使用以下提示词创建子代理:")
    print("\n" + "=" * 50)
    print("AGENT_TASK_PROMPT_START")
    print(prompt)
    print("AGENT_TASK_PROMPT_END")
    print("=" * 50 + "\n")
    
    log("⏳ 等待子代理完成任务...")
    log("(在实际运行中，这里会触发 sessions_spawn)")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
