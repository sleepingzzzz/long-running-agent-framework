#!/usr/bin/env python3
"""
状态查看工具
快速查看框架运行状态和任务进度
"""

import json
from pathlib import Path
from datetime import datetime

FRAMEWORK_DIR = Path("E:/code/qclaw-agent-framework")
TASKS_FILE = FRAMEWORK_DIR / "tasks.json"
PROGRESS_FILE = FRAMEWORK_DIR / "progress.txt"
CONFIG_FILE = FRAMEWORK_DIR / "config.json"


def print_header(text: str):
    """打印标题"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)


def print_status():
    """打印框架状态"""
    print_header("QClaw Agent Framework 状态")
    
    # 加载配置
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        config = json.load(f)
    
    print(f"框架版本: {config['version']}")
    print(f"项目名称: {config['project_name']}")
    print(f"项目描述: {config['project_description']}")
    print(f"工作目录: {config['paths']['workspace']}")


def print_tasks():
    """打印任务状态"""
    print_header("任务进度")
    
    with open(TASKS_FILE, "r", encoding="utf-8") as f:
        tasks = json.load(f)
    
    total = tasks['total_tasks']
    completed = tasks['completed']
    pending = tasks['pending']
    in_progress = tasks['in_progress']
    
    progress_pct = (completed / total * 100) if total > 0 else 0
    
    print(f"总任务数: {total}")
    print(f"已完成:   {completed} ({progress_pct:.1f}%)")
    print(f"进行中:   {in_progress}")
    print(f"待处理:   {pending}")
    
    # 进度条
    bar_width = 40
    filled = int(bar_width * completed / total) if total > 0 else 0
    bar = "█" * filled + "░" * (bar_width - filled)
    print(f"\n进度: [{bar}] {progress_pct:.1f}%")
    
    # 显示最近完成的任务
    if completed > 0:
        print("\n最近完成的任务:")
        completed_tasks = [t for t in tasks['tasks'] if t['status'] == 'completed']
        completed_tasks.sort(key=lambda x: x.get('completed_at', ''), reverse=True)
        for task in completed_tasks[:3]:
            print(f"  ✓ [{task['id']}] {task['title']}")
    
    # 显示进行中的任务
    if in_progress > 0:
        print("\n进行中的任务:")
        for task in tasks['tasks']:
            if task['status'] == 'in_progress':
                print(f"  ▶ [{task['id']}] {task['title']}")
    
    # 显示下一个待处理任务
    if pending > 0:
        print("\n下一个待处理任务:")
        for task in tasks['tasks']:
            if task['status'] == 'pending':
                print(f"  ○ [{task['id']}] {task['title']}")
                print(f"    {task['description'][:60]}...")
                break


def print_progress():
    """打印最近的工作日志"""
    print_header("最近工作日志")
    
    if not PROGRESS_FILE.exists():
        print("暂无工作日志")
        return
    
    content = PROGRESS_FILE.read_text(encoding="utf-8")
    lines = content.strip().split("\n")
    
    # 找到最近的日志条目（以 --- 分隔）
    entries = []
    current_entry = []
    
    for line in lines:
        if line.strip() == "---":
            if current_entry:
                entries.append("\n".join(current_entry))
                current_entry = []
        else:
            current_entry.append(line)
    
    if current_entry:
        entries.append("\n".join(current_entry))
    
    # 显示最近3条
    if entries:
        for entry in entries[-3:]:
            print(entry)
            print("-" * 40)
    else:
        print("暂无工作日志")


def print_next_action():
    """打印建议的下一步操作"""
    print_header("建议操作")
    
    with open(TASKS_FILE, "r", encoding="utf-8") as f:
        tasks = json.load(f)
    
    pending = tasks['pending']
    in_progress = tasks['in_progress']
    
    if in_progress > 0:
        print("当前有任务正在进行中，请等待完成或检查状态")
        print("\n操作命令:")
        print("  1. 查看详细日志: type progress.txt")
        print("  2. 强制标记完成: 编辑 tasks.json 修改状态")
    elif pending > 0:
        print("有待处理任务，可以开始执行")
        print("\n操作命令:")
        print("  1. 执行单个任务: python scripts/agent_loop.py")
        print("  2. 启动定时任务: 配置 QClaw Cron (见 INFINITE_RUN.md)")
        print("  3. 手动触发: 在 QClaw 中发送 '执行下一个开发任务'")
    else:
        print("🎉 所有任务已完成！")


def main():
    """主函数"""
    print_status()
    print_tasks()
    print_progress()
    print_next_action()
    
    print("\n" + "=" * 60)
    print("使用 'python scripts/status.py' 随时查看状态")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
