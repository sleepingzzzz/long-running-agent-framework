<div align="center">

<img src="https://raw.githubusercontent.com/sleepingzzzz/long-running-agent-framework/main/assets/logo.png" alt="Long Running Agent Framework" width="200"/>

# 🤖 Long Running Agent Framework

**Transform AI agents into autonomous software engineers**

[![GitHub stars](https://img.shields.io/github/stars/sleepingzzzz/long-running-agent-framework?style=social)](https://github.com/sleepingzzzz/long-running-agent-framework/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sleepingzzzz/long-running-agent-framework?style=social)](https://github.com/sleepingzzzz/long-running-agent-framework/network)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python)](https://python.org/)

[📖 Documentation](https://github.com/sleepingzzzz/long-running-agent-framework/wiki) • 
[🚀 Quick Start](#quick-start) • 
[💡 Examples](EXAMPLES.md) • 
[🤝 Contributing](CONTRIBUTING.md)

</div>

---

## ✨ What is this?

Long Running Agent Framework (LRAF) is a **production-ready** task orchestration system that enables AI agents to autonomously execute complex software development projects.

> 💡 Inspired by [Anthropic's Building Effective Agents](https://www.anthropic.com/research/building-effective-agents), LRAF bridges the gap between AI capabilities and real-world software engineering workflows.

### 🎯 Perfect for

- 🏗️ **AI-Powered Development** - Let AI agents build your projects autonomously
- 📋 **Task Management** - Structured approach to complex development workflows  
- 🔄 **CI/CD Integration** - Automated testing and deployment pipelines
- 👥 **Team Collaboration** - Human-in-the-loop oversight and approval

---

## 🎬 Demo

```bash
# Start developing with a single command
$ node scripts/task-interactive.js next

🚀 Executing Task 1: Project Setup
   Priority: High | Estimated: 1 hour
   
   Creating project structure...
   ✅ Initialized Git repository
   ✅ Created package.json
   ✅ Installed dependencies
   
   Task completed! Commit: a1b2c3d
   
Next task: 2. Database Design
Continue? [Y/n]: 
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **Python** 3.8+
- **Git** 2.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/sleepingzzzz/long-running-agent-framework.git
cd long-running-agent-framework

# Set up environment (recommended)
# Windows:
setup-env.bat
# Linux/macOS:
source setup-env.sh

# Verify installation
node scripts/task-interactive.js list
```

### Your First Task

```bash
# View all tasks
node scripts/task-interactive.js list

# Execute the next recommended task
node scripts/task-interactive.js next

# Or execute a specific task
node scripts/task-interactive.js run 1
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📖 USAGE.md](USAGE.md) | Complete usage guide and CLI reference |
| [🏗️ ARCHITECTURE.md](ARCHITECTURE.md) | System design and component details |
| [💡 EXAMPLES.md](EXAMPLES.md) | Real-world usage examples |
| [🤝 CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [⚙️ Configuration](docs/CONFIGURATION.md) | Advanced configuration options |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                          │
│         (CLI / Interactive / AI Assistant)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Task Manager                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Loader     │  │   Updater    │  │   Reporter   │      │
│  │  (with lock) │  │ (atomic ops) │  │  (progress)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Task Store                                │
│              (JSON + Backup + Recovery)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   AI Agent                                   │
│              (Sub-agent Session)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Read Spec   │  │   Develop    │  │    Commit    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| 📝 **Task Management** | CRUD operations with full state tracking | ✅ Ready |
| 🔗 **Dependency System** | DAG-based task dependencies | ✅ Ready |
| 🔄 **State Machine** | Pending → In Progress → Completed/Failed | ✅ Ready |
| 📊 **Progress Tracking** | Real-time statistics and reporting | ✅ Ready |
| 🔒 **File Locking** | Prevents concurrent write corruption | ✅ Ready |
| 🛡️ **Error Recovery** | Automatic backup and recovery | ✅ Ready |
| 🌳 **Git Integration** | Automatic commits per task | ✅ Ready |

### Advanced Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🎯 **Priority Queue** | High/Medium/Low with auto-sorting | ✅ Ready |
| ⏸️ **Interrupt & Resume** | Pause and resume long-running tasks | ✅ Ready |
| 📦 **Batch Operations** | Update multiple tasks at once | ✅ Ready |
| 🔍 **Circular Detection** | Prevents dependency deadlocks | ✅ Ready |
| 📝 **Operation Logging** | Full audit trail | ✅ Ready |

---

## 💡 Use Cases

### 1. Web Application Development

```json
{
  "project": "E-commerce Platform",
  "tasks": [
    { "id": 1, "title": "Setup Project", "priority": "high", "depends_on": [] },
    { "id": 2, "title": "Database Schema", "priority": "high", "depends_on": [1] },
    { "id": 3, "title": "User Auth API", "priority": "high", "depends_on": [2] },
    { "id": 4, "title": "Product API", "priority": "high", "depends_on": [3] },
    { "id": 5, "title": "Frontend UI", "priority": "medium", "depends_on": [1] }
  ]
}
```

### 2. API Service Development

```bash
# Generate tasks from requirements
node scripts/task-generator.js generate \
  "Payment API" \
  "Process payments with Stripe" \
  "Need auth, validation, webhook handling"

# Execute all tasks
node scripts/task-interactive.js next
```

### 3. Data Pipeline

```json
{
  "project": "ETL Pipeline",
  "tasks": [
    { "id": 1, "title": "Source Connectors", "priority": "high" },
    { "id": 2, "title": "Data Validation", "priority": "high", "depends_on": [1] },
    { "id": 3, "title": "Transform Engine", "priority": "high", "depends_on": [2] },
    { "id": 4, "title": "Output Writers", "priority": "high", "depends_on": [3] }
  ]
}
```

---

## 🛠️ CLI Reference

### Task Execution

```bash
# List all tasks
node scripts/task-interactive.js list

# Execute next recommended task
node scripts/task-interactive.js next

# Execute specific task
node scripts/task-interactive.js run 5

# View task details
node scripts/task-interactive.js detail 5
```

### Task Management

```bash
# Add new task
node scripts/task-manager.js add "Title" "Description" \
  --priority high --hours 2 --depends 1,2

# Update status
node scripts/task-manager.js start 5
node scripts/task-manager.js complete 5 "Notes"
node scripts/task-manager.js fail 5 "Reason"

# View statistics
node scripts/task-manager.js stats
```

---

## 🎯 Roadmap

### Phase 1: Core (✅ Complete)
- [x] Task management system
- [x] Dependency resolution
- [x] State tracking
- [x] File locking
- [x] Error recovery

### Phase 2: Enhanced (🚧 In Progress)
- [ ] Web dashboard
- [ ] SQLite backend
- [ ] Plugin system
- [ ] Webhook notifications

### Phase 3: Advanced (📅 Planned)
- [ ] Multi-agent support
- [ ] Distributed execution
- [ ] AI task generation
- [ ] CI/CD integrations

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/long-running-agent-framework.git

# Create branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

---

## 📊 Project Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api/pin/?username=sleepingzzzz&repo=long-running-agent-framework&theme=default)

---

## 🙏 Acknowledgments

- Inspired by [Anthropic's Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
- Built for [QClaw](https://github.com/openclaw/openclaw) environment
- Logo design by [OpenAI DALL-E](https://openai.com/dall-e)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**[⬆ Back to Top](#-long-running-agent-framework)**

Made with ❤️ by [sleepingzzzz](https://github.com/sleepingzzzz)

⭐ Star us on GitHub — it motivates us a lot!

</div>
