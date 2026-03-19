#!/usr/bin/env python3
"""
QClaw Agent Framework - 核心循环脚本

这个脚本实现了AI开发代理的无限循环工作模式：
1. 读取任务列表
2. 领取待处理任务
3. 调用AI完成开发
4. 更新进度和状态
5. 重复直到所有任务完成

适配QClaw环境，使用sessions_spawn创建子代理会话。
"""

import json
import os
import sys
import time
import subprocess
from datetime import datetime
from pathlib import Path

# 配置
# Use environment variable or auto-detect
import os
FRAMEWORK_DIR = Path(os.environ.get("LRAF_WORKSPACE", "E:/code/long-running-agent-framework"))
CONFIG_FILE = FRAMEWORK_DIR / "config.json"
TASKS_FILE = FRAMEWORK_DIR / "tasks.json"
PROGRESS_FILE = FRAMEWORK_DIR / "progress.txt"
WORK_SPEC_FILE = FRAMEWORK_DIR / "WORK_SPEC.md"
LOGS_DIR = FRAMEWORK_DIR / "logs"

# 确保日志目录存在
LOGS_DIR.mkdir(exist_ok=True)


def log_message(message: str):
    """记录日志到文件和控制台"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_line = f"[{timestamp}] {message}"
    print(log_line)
    
    log_file = LOGS_DIR / f"agent_{datetime.now().strftime('%Y%m%d')}.log"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(log_line + "\n")


def load_tasks() -> dict:
    """加载任务列表"""
    with open(TASKS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_tasks(tasks: dict):
    """保存任务列表"""
    with open(TASKS_FILE, "w", encoding="utf-8") as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)


def load_config() -> dict:
    """加载配置"""
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def load_work_spec() -> str:
    """加载工作规范文档"""
    with open(WORK_SPEC_FILE, "r", encoding="utf-8") as f:
        return f.read()


def get_next_pending_task(tasks: dict) -> dict | None:
    """获取下一个待处理的任务"""
    for task in tasks["tasks"]:
        if task["status"] == "pending":
            return task
    return None


def update_task_status(tasks: dict, task_id: int, status: str, notes: str = ""):
    """更新任务状态"""
    for task in tasks["tasks"]:
        if task["id"] == task_id:
            task["status"] = status
            if status == "completed":
                task["completed_at"] = datetime.now().isoformat()
            if notes:
                task["notes"] = notes
            break
    
    # 更新统计
    tasks["completed"] = sum(1 for t in tasks["tasks"] if t["status"] == "completed")
    tasks["in_progress"] = sum(1 for t in tasks["tasks"] if t["status"] == "in_progress")
    tasks["pending"] = sum(1 for t in tasks["tasks"] if t["status"] == "pending")
    
    save_tasks(tasks)


def append_progress(task_id: int, title: str, content: str, test_result: str = ""):
    """追加进度日志"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    progress_entry = f"""
[{timestamp}] [Task {task_id}] 已完成
任务: {title}
{content}

测试结果: {test_result}
---
"""
    with open(PROGRESS_FILE, "a", encoding="utf-8") as f:
        f.write(progress_entry)


def build_agent_prompt(task: dict, work_spec: str, config: dict) -> str:
    """构建发送给AI代理的提示词"""
    prompt = f"""你是 QClaw Agent Framework 中的 AI 开发工程师。

# 工作规范
{work_spec}

# 当前任务

任务ID: {task['id']}
任务标题: {task['title']}
任务描述: {task['description']}
优先级: {task['priority']}
预计耗时: {task['estimated_hours']}小时

# 项目信息

项目名称: {config['project_name']}
项目描述: {config['project_description']}
项目路径: {config['project_path']}

# 你的工作

1. 首先读取 tasks.json，将此任务标记为 "in_progress"
2. 按照 WORK_SPEC.md 中的六步工作流程完成任务
3. 完成后更新 tasks.json 标记为 "completed"
4. 在 progress.txt 中记录工作日志
5. 执行 Git Commit

# 重要提示

- 所有文件操作都在 {FRAMEWORK_DIR} 目录下
- 项目代码存放在 {FRAMEWORK_DIR}/projects 下
- 如果遇到需要人工介入的情况，请明确说明
- 完成后回复 "任务完成" 并简要总结

请开始执行任务 {task['id']}: {task['title']}
"""
    return prompt


def spawn_agent_task(prompt: str) -> bool:
    """
    使用 QClaw 的 sessions_spawn 创建子代理执行任务
    
    注意：这个函数需要在 QClaw 环境中通过 message 工具调用
    """
    log_message("准备创建子代理会话...")
    log_message(f"提示词长度: {len(prompt)} 字符")
    
    # 在实际环境中，这里会通过 QClaw 的 API 调用 sessions_spawn
    # 由于这是独立脚本，我们记录需要执行的操作
    log_message("请使用以下命令在 QClaw 中执行:")
    log_message("-" * 50)
    print(f"""
sessions_spawn(
    runtime="subagent",
    mode="run",
    task="""{prompt}""",
    label=f"agent-task-{task_id}",
    timeoutSeconds=1800
)
""")
    log_message("-" * 50)
    
    return True


def run_single_cycle():
    """运行单个工作循环"""
    log_message("=" * 60)
    log_message("开始新的工作循环")
    log_message("=" * 60)
    
    # 加载配置和任务
    config = load_config()
    tasks = load_tasks()
    work_spec = load_work_spec()
    
    # 检查是否有待处理任务
    task = get_next_pending_task(tasks)
    
    if task is None:
        log_message("✅ 所有任务已完成！")
        return False
    
    log_message(f"📋 领取任务: [{task['id']}] {task['title']}")
    log_message(f"📝 任务描述: {task['description']}")
    
    # 标记为进行中
    update_task_status(tasks, task["id"], "in_progress")
    log_message(f"🔄 任务状态已更新为: in_progress")
    
    # 构建提示词
    prompt = build_agent_prompt(task, work_spec, config)
    
    # 在实际QClaw环境中，这里会调用sessions_spawn
    # 由于脚本独立运行，我们输出需要执行的指令
    log_message("🤖 请使用 QClaw 执行以下操作:")
    print("\n" + "=" * 60)
    print("AGENT_PROMPT_START")
    print(prompt)
    print("AGENT_PROMPT_END")
    print("=" * 60 + "\n")
    
    # 模拟等待AI完成（实际环境中由子代理完成）
    log_message("⏳ 等待AI完成任务...")
    log_message("(在实际运行中，这里会调用 sessions_spawn 创建子代理)")
    
    return True


def main():
    """主函数 - 无限循环"""
    log_message("🚀 QClaw Agent Framework 启动")
    log_message(f"📁 工作目录: {FRAMEWORK_DIR}")
    
    # 检查环境
    if not CONFIG_FILE.exists():
        log_message("❌ 错误: 配置文件不存在")
        sys.exit(1)
    
    if not TASKS_FILE.exists():
        log_message("❌ 错误: 任务文件不存在")
        sys.exit(1)
    
    log_message("✅ 环境检查通过")
    
    # 加载初始状态
    tasks = load_tasks()
    log_message(f"📊 任务统计: 总共 {tasks['total_tasks']}, "
                f"已完成 {tasks['completed']}, "
                f"进行中 {tasks['in_progress']}, "
                f"待处理 {tasks['pending']}")
    
    # 主循环
    cycle_count = 0
    while True:
        cycle_count += 1
        log_message(f"\n🔄 第 {cycle_count} 轮循环")
        
        try:
            should_continue = run_single_cycle()
            
            if not should_continue:
                log_message("🏁 工作完成，退出循环")
                break
            
            # 在实际环境中，这里会等待子代理完成
            # 然后继续下一轮
            log_message("⏳ 本轮结束，准备下一轮...")
            log_message("(按 Ctrl+C 停止)")
            
            # 演示模式：只运行一次
            log_message("\n⚠️ 演示模式: 只运行一轮")
            log_message("在实际使用中，这里会循环直到所有任务完成")
            break
            
        except KeyboardInterrupt:
            log_message("\n🛑 收到中断信号，停止工作")
            break
        except Exception as e:
            log_message(f"❌ 错误: {e}")
            time.sleep(5)  # 出错后等待5秒继续
    
    log_message("👋 Agent Framework 已停止")


if __name__ == "__main__":
    main()
