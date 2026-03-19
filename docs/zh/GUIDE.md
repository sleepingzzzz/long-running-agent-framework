# 使用指南

长效运行智能体框架的完整使用指南。

## 目录

- [交互模式](#交互模式)
- [命令行界面](#命令行界面)
- [任务管理](#任务管理)
- [工作流示例](#工作流示例)

---

## 交互模式

使用框架的推荐方式是通过与 AI 助手的交互式对话。

### 查看任务

```
查看任务列表
```

显示所有任务及其状态、优先级和依赖关系。

### 执行任务

```
执行下一个任务
```

自动选择依赖满足的最高优先级任务。

```
执行任务5
```

执行特定 ID 的任务。

### 任务详情

```
任务5详情
```

查看特定任务的详细信息。

---

## 命令行界面

### 任务执行

```bash
# 列出所有任务
node scripts/task-interactive.js list

# 执行下一个推荐任务
node scripts/task-interactive.js next

# 执行特定任务
node scripts/task-interactive.js run 5

# 查看任务详情
node scripts/task-interactive.js detail 5
```

### 任务管理

```bash
# 添加新任务
node scripts/task-manager.js add "任务标题" "任务描述" \
  --priority high --hours 2 --depends 1,2

# 更新状态
node scripts/task-manager.js start 5
node scripts/task-manager.js complete 5 "完成备注"
node scripts/task-manager.js fail 5 "失败原因"

# 查看统计
node scripts/task-manager.js stats
```

### 批量操作

```bash
# 批量完成多个任务
node scripts/task-manager.js batch-status completed 3,4,5

# 批量添加依赖
node scripts/task-manager.js batch-depend 1 3,4,5
```

---

## 任务管理

### 创建任务

任务在 `tasks.json` 中定义：

```json
{
  "project": "项目名称",
  "tasks": [
    {
      "id": 1,
      "title": "任务标题",
      "description": "详细描述",
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

### 任务依赖

使用 `depends_on` 指定前置条件：

```json
{
  "id": 3,
  "title": "实现 API",
  "depends_on": [1, 2]
}
```

有依赖的任务只有在所有依赖完成后才能执行。

### 优先级级别

- **high**: 关键路径，优先执行
- **medium**: 重要但不阻塞
- **low**: 可选功能

---

## 工作流示例

### 示例 1: Web 开发项目

**步骤 1**: 创建初始任务
```bash
node scripts/task-manager.js add "项目初始化" "初始化 React 项目" --priority high --hours 1
node scripts/task-manager.js add "数据库设计" "创建 Schema" --priority high --hours 2 --depends 1
node scripts/task-manager.js add "构建 API" "实现 REST 端点" --priority high --hours 3 --depends 2
```

**步骤 2**: 执行任务
```
执行下一个任务
```

**步骤 3**: 监控进度
```
查看任务列表
```

### 示例 2: 添加新需求

**你**: 添加支付功能

**AI**: 创建带有适当依赖的任务

**你**: 执行下一个任务

### 示例 3: 处理阻塞

当任务失败时：
```
标记任务5为失败，原因：API密钥未配置
```

解决后：
```
恢复任务5
执行下一个任务
```

---

## 最佳实践

1. **保持任务小**: 每个任务 0.5-2 小时
2. **定义清晰的依赖**: 确保逻辑执行顺序
3. **及时更新状态**: 立即标记任务完成/失败
4. **写有意义的备注**: 记录完成详情
5. **定期提交**: 每个完成的任务都应该有 Git 提交

---

## 故障排除

### 任务无法开始

检查依赖：
```bash
node scripts/task-manager.js deps 5
```

### 重置任务状态

```bash
node scripts/task-manager.js reset
```

### 查看日志

```bash
cat logs/operations.log
cat logs/agent_YYYYMMDD.log
```
