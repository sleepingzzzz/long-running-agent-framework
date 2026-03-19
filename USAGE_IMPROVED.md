# Long Running Agent Framework - 改进版使用指南

## 改进内容

### Phase 1 改进 ✅
1. **优先级排序**: 任务按优先级自动排序（高→中→低）
2. **确认环节**: 执行前显示任务详情，等待确认
3. **明确任务选择**: 支持指定任务ID或自动推荐

### Phase 2 改进 ✅
1. **任务依赖**: 支持 `depends_on` 字段，自动检查依赖状态
2. **操作日志**: 所有操作记录在 `logs/operations.log`
3. **批量操作**: 支持批量更新状态、批量添加依赖
4. **中断恢复**: 支持标记任务为中断状态，可恢复执行

---

## 快速开始

### 1. 查看任务状态

```bash
cd E:\code\long-running-agent-framework
node scripts/task-interactive.js list
```

或者在 QClaw 中直接说：
```
查看任务列表
```

### 2. 查看任务详情

```bash
node scripts/task-interactive.js detail 5
```

或者在 QClaw 中说：
```
任务5详情
```

### 3. 执行任务

**执行推荐任务**（按优先级自动选择）：
```bash
node scripts/task-interactive.js next
```

或者在 QClaw 中说：
```
执行下一个任务
```

**执行指定任务**：
```bash
node scripts/task-interactive.js run 5
```

或者在 QClaw 中说：
```
执行任务5
```

---

## 任务管理命令

### 添加任务

```bash
node scripts/task-manager.js add "任务标题" "任务描述" --priority high --hours 2 --depends 1,2
```

选项：
- `--priority high|medium|low`: 优先级
- `--hours <数字>`: 预计耗时
- `--depends <id1,id2>`: 依赖任务ID
- `--notes "备注"`: 备注

### 更新任务状态

```bash
# 标记为进行中
node scripts/task-manager.js start 5

# 标记为已完成
node scripts/task-manager.js complete 5 "完成备注"

# 标记为失败
node scripts/task-manager.js fail 5 "失败原因"

# 标记为中断（可恢复）
node scripts/task-manager.js interrupt 5 "中断原因"

# 恢复中断的任务
node scripts/task-manager.js resume 5
```

### 批量操作

```bash
# 批量更新状态
node scripts/task-manager.js batch-status completed 3,4,5

# 批量添加依赖
node scripts/task-manager.js batch-depend 1 3,4,5
```

### 查看统计

```bash
node scripts/task-manager.js stats
```

---

## 对话式工作流

### 场景 1: 开始开发

**你**: 执行下一个任务

**我**: 
```
📋 任务列表 - AI漫剧生成工具
...
🚀 可立即执行的任务 (5个，按优先级排序):
   1. ✅ [1] 项目初始化 [high]
   2. ✅ [2] 设计数据库Schema [high]
   ...

🚀 推荐执行: [1] 项目初始化 [high]

========================================
📋 任务详情 [1]
========================================
标题: 项目初始化
状态: pending
优先级: high
预计耗时: 0.5小时
可开始: ✅ 是

描述:
创建项目目录结构，初始化Git仓库，创建基础配置文件...

========================================

确认执行此任务？（或指定其他任务ID）
```

**你**: 确认

**我**: 创建子代理执行任务...

---

### 场景 2: 任务依赖检查

**你**: 执行任务10

**我**:
```
⚠️ 任务 [10] 依赖未满足:
依赖任务未完成: [9] 分镜生成API

请先完成依赖任务。

当前可执行的前置任务:
- [9] 分镜生成API [high]
```

---

### 场景 3: 动态调整

**你**: 等等，我要加个新任务

**我**: 好的，请描述新任务：

**你**: 添加一个支付功能，优先级高，依赖任务6

**我**:
```
✅ 已添加任务 [32]: 支付功能
优先级: high
依赖: [6]

已自动调整任务列表，新任务将在依赖满足后执行。
```

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `tasks.json` | 任务列表（包含依赖关系） |
| `logs/operations.log` | 操作日志 |
| `logs/agent_YYYYMMDD.log` | 运行日志 |
| `scripts/task-manager.js` | 任务管理工具 |
| `scripts/agent-loop.js` | 核心循环脚本 |
| `scripts/task-interactive.js` | 交互式助手 |
| `WORK_SPEC.md` | AI工作规范 |

---

## 任务状态说明

| 状态 | 图标 | 说明 |
|------|------|------|
| pending | ⏳ | 待处理 |
| in_progress | ▶️ | 进行中 |
| completed | ✅ | 已完成 |
| failed | ❌ | 失败 |
| interrupted | ⏸️ | 中断（可恢复） |

---

## 最佳实践

1. **每次对话前查看状态**: 先 `查看任务列表` 了解当前进度
2. **明确指定或确认**: 执行任务前确认是你想要的
3. **及时标记状态**: 任务完成后及时标记，保持列表准确
4. **合理使用依赖**: 复杂项目使用 `depends_on` 确保执行顺序
5. **记录中断原因**: 任务中断时记录原因，方便后续恢复

---

## 故障排除

### 任务无法开始
- 检查依赖是否已完成
- 使用 `node scripts/task-manager.js deps <id>` 查看依赖状态

### 任务状态不一致
- 使用 `node scripts/task-manager.js reset` 重置所有状态
- 或手动更新特定任务状态

### 依赖循环
- 系统会自动检测循环依赖
- 需要手动调整 `depends_on` 字段
