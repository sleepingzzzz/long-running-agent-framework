# Long Running Agent Framework - 无限运行方案

## 概述

由于 QClaw 环境与 Cloud Code 不同，我们需要采用不同的方式实现"无限运行"。

## 方案对比

| 方案 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| **Cron 定时任务** | 使用 QClaw 的 cron 功能定期触发 | 原生支持、稳定可靠 | 最小间隔1分钟 |
| **Heartbeat 检测** | 利用心跳机制检查并触发 | 实时性好 | 需要保持会话活跃 |
| **Subagent 链式调用** | 子代理完成后触发下一个 | 连续性好 | 实现复杂 |

## 推荐方案：Cron + Subagent 组合

### 第一步：设置 Cron 定时任务

使用 QClaw 的 cron 功能，每分钟检查一次是否有待处理任务：

```bash
# 添加定时任务（通过 qclaw-openclaw skill）
<skill_dir>\scripts\openclaw-win.cmd cron add \
  --name "agent-framework-runner" \
  --schedule "* * * * *" \
  --command "检查并执行下一个开发任务"
```

### 第二步：创建任务执行器

创建 `scripts/cron_task_runner.py`：

```python
"""
Cron 调度的任务执行器
每次运行时检查是否有待处理任务，有则创建子代理执行
"""

import json
from pathlib import Path

FRAMEWORK_DIR = Path("E:/code/qclaw-agent-framework")
TASKS_FILE = FRAMEWORK_DIR / "tasks.json"

def get_next_task():
    with open(TASKS_FILE, "r", encoding="utf-8") as f:
        tasks = json.load(f)
    
    for task in tasks["tasks"]:
        if task["status"] == "pending":
            return task
    return None

def main():
    task = get_next_task()
    if task is None:
        print("没有待处理任务")
        return
    
    print(f"发现任务: [{task['id']}] {task['title']}")
    print("请使用 sessions_spawn 创建子代理执行此任务")
    # 这里会触发 QClaw 创建子代理

if __name__ == "__main__":
    main()
```

### 第三步：在 QClaw 中配置

1. 打开 QClaw 设置
2. 进入 Cron 定时任务配置
3. 添加新任务：
   - 名称: `agent-framework-runner`
   - 触发器: `* * * * *` (每分钟)
   - 动作: 执行 `scripts/cron_task_runner.py`

## 手动触发方式

如果你想手动控制，可以使用以下方式：

### 方式1：直接命令

在 QClaw 中发送消息：
```
执行下一个开发任务
```

### 方式2：批量执行

```
连续执行所有待处理任务
```

### 方式3：指定任务

```
执行任务 5
```

## 子代理创建模板

当需要创建子代理执行任务时，使用以下模板：

```python
sessions_spawn(
    runtime="subagent",
    mode="run",
    task="""
你是 Long Running Agent Framework 的 AI 开发工程师。

请完成任务: {task_title}
任务描述: {task_description}

工作规范:
1. 读取 E:\code\long-running-agent-framework\WORK_SPEC.md 了解工作流程
2. 读取 tasks.json 更新任务状态为 in_progress
3. 在 E:\code\long-running-agent-framework\projects 目录下开发
4. 完成后更新 tasks.json 状态为 completed
5. 在 progress.txt 记录工作日志
6. 执行 Git Commit

注意:
- 所有文件操作都在 E:\code\long-running-agent-framework 目录下
- 不要修改此目录外的任何文件
- 如果需要人工协助，请明确说明
""",
    label=f"agent-task-{task_id}",
    timeoutSeconds=1800  # 30分钟超时
)
```

## 监控和日志

### 查看运行状态

```bash
# 查看任务状态
python scripts/status.py

# 查看日志
type logs\agent_YYYYMMDD.log

# 查看进度
type progress.txt
```

### 任务统计

```python
import json

with open("tasks.json", "r", encoding="utf-8") as f:
    tasks = json.load(f)

completed = sum(1 for t in tasks["tasks"] if t["status"] == "completed")
pending = sum(1 for t in tasks["tasks"] if t["status"] == "pending")
in_progress = sum(1 for t in tasks["tasks"] if t["status"] == "in_progress")

print(f"进度: {completed}/{tasks['total_tasks']} ({completed/tasks['total_tasks']*100:.1f}%)")
print(f"待处理: {pending}")
print(f"进行中: {in_progress}")
```

## 安全注意事项

1. **文件隔离**: 所有操作限制在 `E:\code\long-running-agent-framework` 目录
2. **Git 备份**: 每个任务完成后自动提交，可随时回滚
3. **超时保护**: 子代理设置30分钟超时，防止无限运行
4. **人工介入**: 遇到外部服务配置时主动请求帮助

## 与视频中的系统对比

| 功能 | 视频 (Cloud Code) | 本方案 (QClaw) |
|------|-------------------|----------------|
| 触发机制 | while True 循环 | Cron 定时任务 |
| 执行单元 | Cloud Code 会话 | sessions_spawn 子代理 |
| 上下文管理 | 自动清空 | 每次子代理独立 |
| 浏览器测试 | MCP Browser | QClaw browser 工具 |
| 人工介入 | 界面交互 | 消息通知 |
| 文件隔离 | 需手动管理 | 专用目录隔离 |

## 下一步

1. 根据你的项目需求修改 `tasks.json`
2. 配置 QClaw 的 cron 定时任务
3. 运行 `run.bat` 测试单个任务
4. 启动无限运行模式

---

**注意**: 由于 QClaw 环境与 Cloud Code 架构不同，某些功能可能需要调整。建议先手动测试几个任务，确保流程正确后再启用自动运行。
