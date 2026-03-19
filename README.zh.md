<div align="center">

<img src="https://raw.githubusercontent.com/sleepingzzzz/long-running-agent-framework/main/assets/logo.png" alt="Long Running Agent Framework" width="200"/>

# 🤖 长效运行智能体框架

**将 AI 智能体转化为自主软件工程师**

[![GitHub stars](https://img.shields.io/github/stars/sleepingzzzz/long-running-agent-framework?style=social)](https://github.com/sleepingzzzz/long-running-agent-framework/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sleepingzzzz/long-running-agent-framework?style=social)](https://github.com/sleepingzzzz/long-running-agent-framework/network)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python)](https://python.org/)

**[English](README.md) | 中文**

[📖 文档](docs/zh/GUIDE.md) • 
[🚀 快速开始](#快速开始) • 
[💡 示例](docs/zh/EXAMPLES.md) • 
[🤝 贡献](CONTRIBUTING.md)

</div>

---

## ✨ 这是什么？

长效运行智能体框架（LRAF）是一个**生产级**任务编排系统，使 AI 智能体能够自主执行复杂的软件开发项目。

> 💡 灵感来自 [Anthropic 的《构建高效智能体》](https://www.anthropic.com/research/building-effective-agents)，LRAF 架起了 AI 能力与真实软件工程工作流之间的桥梁。

### 🎯 适用场景

- 🏗️ **AI 驱动开发** - 让 AI 智能体自主构建项目
- 📋 **任务管理** - 复杂开发工作流的结构化方法
- 🔄 **CI/CD 集成** - 自动化测试和部署流水线
- 👥 **团队协作** - 人工监督与审批

---

## 🎬 演示

```bash
# 使用单个命令开始开发
$ node scripts/task-interactive.js next

🚀 执行任务 1: 项目初始化
   优先级: 高 | 预计: 1 小时
   
   创建项目结构中...
   ✅ 初始化 Git 仓库
   ✅ 创建 package.json
   ✅ 安装依赖
   
   任务完成！提交: a1b2c3d
   
下一个任务: 2. 数据库设计
继续? [Y/n]: 
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** 18+ 或 **Python** 3.8+
- **Git** 2.0+

### 安装

```bash
# 克隆仓库
git clone https://github.com/sleepingzzzz/long-running-agent-framework.git
cd long-running-agent-framework

# 设置环境（推荐）
# Windows:
setup-env.bat
# Linux/macOS:
source setup-env.sh

# 验证安装
node scripts/task-interactive.js list
```

### 第一个任务

```bash
# 查看所有任务
node scripts/task-interactive.js list

# 执行下一个推荐任务
node scripts/task-interactive.js next

# 或执行特定任务
node scripts/task-interactive.js run 1
```

---

## 📚 文档

| 文档 | 描述 |
|------|------|
| [📖 使用指南](docs/zh/GUIDE.md) | 完整使用指南和 CLI 参考 |
| [🏗️ 架构说明](docs/zh/ARCHITECTURE.md) | 系统设计和组件详情 |
| [💡 示例](docs/zh/EXAMPLES.md) | 真实使用示例 |
| [🤝 贡献指南](CONTRIBUTING.md) | 贡献指南 |
| [⚙️ 配置](docs/zh/CONFIGURATION.md) | 高级配置选项 |

---

## 🏗️ 架构

```
┌─────────────────────────────────────────────────────────────┐
│                      用户界面                                │
│         (命令行 / 交互式 / AI 助手)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   任务管理器                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   加载器     │  │   更新器     │  │   报告器     │      │
│  │  (带锁)      │  │  (原子操作)  │  │  (进度)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    任务存储                                  │
│              (JSON + 备份 + 恢复)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   AI 智能体                                  │
│              (子代理会话)                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  读取规范    │  │   开发       │  │    提交      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ 特性

### 核心特性

| 特性 | 描述 | 状态 |
|------|------|--------|
| 📝 **任务管理** | 支持依赖关系的 CRUD 操作 | ✅ 就绪 |
| 🔗 **依赖系统** | 基于 DAG 的任务依赖 | ✅ 就绪 |
| 🔄 **状态机** | 待处理 → 进行中 → 完成/失败 | ✅ 就绪 |
| 📊 **进度跟踪** | 实时统计和报告 | ✅ 就绪 |
| 🔒 **文件锁** | 防止并发写入损坏 | ✅ 就绪 |
| 🛡️ **错误恢复** | 自动备份和恢复 | ✅ 就绪 |
| 🌳 **Git 集成** | 每个任务自动提交 | ✅ 就绪 |

### 高级特性

| 特性 | 描述 | 状态 |
|------|------|--------|
| 🎯 **优先级队列** | 高/中/低自动排序 | ✅ 就绪 |
| ⏸️ **中断与恢复** | 暂停和恢复长时间运行任务 | ✅ 就绪 |
| 📦 **批量操作** | 一次更新多个任务 | ✅ 就绪 |
| 🔍 **循环检测** | 防止依赖死锁 | ✅ 就绪 |
| 📝 **操作日志** | 完整审计跟踪 | ✅ 就绪 |

---

## 💡 使用场景

### 1. Web 应用开发

```json
{
  "project": "电商平台",
  "tasks": [
    { "id": 1, "title": "项目初始化", "priority": "high", "depends_on": [] },
    { "id": 2, "title": "数据库设计", "priority": "high", "depends_on": [1] },
    { "id": 3, "title": "用户认证 API", "priority": "high", "depends_on": [2] },
    { "id": 4, "title": "商品 API", "priority": "high", "depends_on": [3] },
    { "id": 5, "title": "前端界面", "priority": "medium", "depends_on": [1] }
  ]
}
```

### 2. API 服务开发

```bash
# 从需求生成任务
node scripts/task-generator.js generate \
  "支付 API" \
  "使用 Stripe 处理支付" \
  "需要认证、验证、webhook 处理"

# 执行所有任务
node scripts/task-interactive.js next
```

### 3. 数据管道

```json
{
  "project": "ETL 管道",
  "tasks": [
    { "id": 1, "title": "源连接器", "priority": "high" },
    { "id": 2, "title": "数据验证", "priority": "high", "depends_on": [1] },
    { "id": 3, "title": "转换引擎", "priority": "high", "depends_on": [2] },
    { "id": 4, "title": "输出写入器", "priority": "high", "depends_on": [3] }
  ]
}
```

---

## 🛠️ CLI 参考

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
node scripts/task-manager.js add "标题" "描述" \
  --priority high --hours 2 --depends 1,2

# 更新状态
node scripts/task-manager.js start 5
node scripts/task-manager.js complete 5 "备注"
node scripts/task-manager.js fail 5 "原因"

# 查看统计
node scripts/task-manager.js stats
```

---

## 🎯 路线图

### 第一阶段：核心 (✅ 完成)
- [x] 任务管理系统
- [x] 依赖解析
- [x] 状态跟踪
- [x] 文件锁
- [x] 错误恢复

### 第二阶段：增强 (🚧 进行中)
- [ ] Web 仪表板
- [ ] SQLite 后端
- [ ] 插件系统
- [ ] Webhook 通知

### 第三阶段：高级 (📅 计划)
- [ ] 多智能体支持
- [ ] 分布式执行
- [ ] AI 任务生成
- [ ] CI/CD 集成

---

## 🤝 贡献

我们欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解指南。

### 贡献者快速开始

```bash
# Fork 并克隆
git clone https://github.com/YOUR_USERNAME/long-running-agent-framework.git

# 创建分支
git checkout -b feature/amazing-feature

# 修改并提交
git commit -m "添加惊人特性"

# 推送并创建 PR
git push origin feature/amazing-feature
```

---

## 📊 项目统计

![GitHub Stats](https://github-readme-stats.vercel.app/api/pin/?username=sleepingzzzz&repo=long-running-agent-framework&theme=default)

---

## 🙏 致谢

- 灵感来自 [Anthropic 的《构建高效智能体》](https://www.anthropic.com/research/building-effective-agents)
- 为 [QClaw](https://github.com/openclaw/openclaw) 环境构建
- Logo 设计由 [OpenAI DALL-E](https://openai.com/dall-e)

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

<div align="center">

**[⬆ 返回顶部](#-长效运行智能体框架)**

由 [sleepingzzzz](https://github.com/sleepingzzzz) 用 ❤️ 制作

⭐ 在 GitHub 上给我们 Star —— 这对我们意义重大！

</div>
