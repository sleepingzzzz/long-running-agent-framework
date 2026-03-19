# Usage Guide

Complete guide for using the Long Running Agent Framework.

## Table of Contents

- [Interactive Mode](#interactive-mode)
- [Command Line Interface](#command-line-interface)
- [Task Management](#task-management)
- [Workflow Examples](#workflow-examples)

---

## Interactive Mode

The recommended way to use the framework is through interactive conversations with your AI assistant.

### View Tasks

```
查看任务列表
```

Displays all tasks with their status, priority, and dependencies.

### Execute Tasks

```
执行下一个任务
```

Automatically selects the highest priority task with satisfied dependencies.

```
执行任务5
```

Execute a specific task by ID.

### Task Details

```
任务5详情
```

View detailed information about a specific task.

---

## Command Line Interface

### Task Execution

```bash
# List all tasks
node scripts/task-interactive.js list

# Execute recommended next task
node scripts/task-interactive.js next

# Execute specific task
node scripts/task-interactive.js run 5

# View task details
node scripts/task-interactive.js detail 5
```

### Task Management

```bash
# Add new task
node scripts/task-manager.js add "Title" "Description" --priority high --hours 2

# Update task status
node scripts/task-manager.js start 5
node scripts/task-manager.js complete 5 "Completion notes"
node scripts/task-manager.js fail 5 "Failure reason"
node scripts/task-manager.js interrupt 5 "Interruption reason"
node scripts/task-manager.js resume 5

# View statistics
node scripts/task-manager.js stats
```

### Batch Operations

```bash
# Complete multiple tasks
node scripts/task-manager.js batch-status completed 3,4,5

# Add dependency to multiple tasks
node scripts/task-manager.js batch-depend 1 3,4,5
```

---

## Task Management

### Creating Tasks

Tasks are defined in `tasks.json`:

```json
{
  "project": "Project Name",
  "tasks": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Detailed description",
      "status": "pending",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [],
      "created_at": "2024-01-01",
      "completed_at": null,
      "notes": ""
    }
  ]
}
```

### Task Dependencies

Use `depends_on` to specify prerequisites:

```json
{
  "id": 3,
  "title": "Implement API",
  "depends_on": [1, 2]
}
```

Tasks with dependencies will only be executable after all dependencies are completed.

### Priority Levels

- **high**: Critical path, execute first
- **medium**: Important but not blocking
- **low**: Optional features

---

## Workflow Examples

### Example 1: Web Development Project

**Step 1**: Create initial tasks
```bash
node scripts/task-manager.js add "Setup Project" "Initialize React project" --priority high --hours 1
node scripts/task-manager.js add "Design Database" "Create schema" --priority high --hours 2 --depends 1
node scripts/task-manager.js add "Build API" "Implement REST endpoints" --priority high --hours 3 --depends 2
```

**Step 2**: Execute tasks
```
执行下一个任务
```

**Step 3**: Monitor progress
```
查看任务列表
```

### Example 2: Adding New Requirements

**You**: Add a payment feature

**AI**: Creates task with appropriate dependencies

**You**: Execute next task

### Example 3: Handling Blockers

When a task fails:
```
标记任务5为失败，原因：API密钥未配置
```

After resolving:
```
恢复任务5
执行下一个任务
```

---

## Best Practices

1. **Keep tasks small**: 0.5-2 hours per task
2. **Define clear dependencies**: Ensure logical execution order
3. **Update status promptly**: Mark tasks as complete/failed immediately
4. **Write meaningful notes**: Document completion details
5. **Commit regularly**: Each completed task should have a Git commit

---

## Troubleshooting

### Task Won't Start

Check dependencies:
```bash
node scripts/task-manager.js deps 5
```

### Reset Task Status

```bash
node scripts/task-manager.js reset
```

### View Logs

```bash
cat logs/operations.log
cat logs/agent_YYYYMMDD.log
```
