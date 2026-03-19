# Architecture

System architecture and design of the Long Running Agent Framework.

## Overview

The framework consists of three main components:

1. **Task Store** (`tasks.json`): Persistent task definitions and state
2. **Execution Engine** (`scripts/`): Task selection and execution logic
3. **Agent Interface** (`WORK_SPEC.md`): AI agent work specification

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                          │
│  (CLI / Interactive / AI Assistant)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Task Manager                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Loader     │  │   Updater    │  │   Reporter   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Task Store                                │
│                    (tasks.json)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Tasks      │  │ Dependencies │  │   State      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Execution Loop                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Select     │  │   Execute    │  │   Update     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   AI Agent                                   │
│              (Sub-agent Session)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Read Spec  │  │   Develop    │  │   Commit     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Task Lifecycle

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Start  │───▶│  Select  │───▶│ Validate │───▶│ Execute  │
└─────────┘    └──────────┘    └──────────┘    └──────────┘
                                                      │
                       ┌──────────────────────────────┘
                       ▼
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Next   │◀───│  Report  │◀───│  Update  │◀───│ Complete │
└─────────┘    └──────────┘    └──────────┘    └──────────┘
```

## Data Flow

### 1. Task Selection

```javascript
// Get available tasks (pending + dependencies satisfied)
const available = tasks.filter(t => 
  t.status === 'pending' &&
  t.depends_on.every(depId => 
    tasks.find(d => d.id === depId).status === 'completed'
  )
);

// Sort by priority
const sorted = available.sort((a, b) => 
  priorityWeight[b.priority] - priorityWeight[a.priority]
);

// Select highest priority
const nextTask = sorted[0];
```

### 2. Task Execution

```javascript
// Update status to in_progress
updateTaskStatus(task.id, 'in_progress');

// Spawn sub-agent with task specification
spawnAgent({
  task: buildAgentPrompt(task),
  timeout: 1800 // 30 minutes
});

// Wait for completion
// Update status to completed/failed
updateTaskStatus(task.id, result.status);
```

### 3. State Persistence

All state changes are immediately persisted to `tasks.json`:

```json
{
  "project": "Name",
  "last_updated": "2024-01-01T00:00:00Z",
  "total_tasks": 10,
  "completed": 3,
  "in_progress": 1,
  "pending": 6,
  "tasks": [...]
}
```

## File Structure

### Core Files

| File | Purpose |
|------|---------|
| `tasks.json` | Task definitions and state |
| `config.json` | Framework configuration |
| `WORK_SPEC.md` | AI agent specification |
| `progress.txt` | Human-readable progress log |

### Scripts

| Script | Purpose |
|--------|---------|
| `task-interactive.js` | Interactive task execution |
| `task-manager.js` | Task CRUD operations |
| `agent-loop.js` | Core execution loop |
| `task-generator.js` | Task generation helper |

## Dependency Resolution

The framework uses a simple dependency graph:

```
Task A (depends_on: [])
  └── Task B (depends_on: [A])
        └── Task C (depends_on: [B])
              └── Task D (depends_on: [B, C])
```

Execution order: A → B → C → D

## State Machine

```
                    ┌─────────────┐
         ┌─────────│   pending   │◀────────┐
         │         └──────┬──────┘         │
         │                │ start          │ resume
         │                ▼                │
         │         ┌─────────────┐         │
         │    ┌───│ in_progress │───┐     │
         │    │    └─────────────┘   │     │
         │    │           │          │     │
   fail  │    │           │ complete │     │
         │    │           ▼          │     │
         │    │    ┌─────────────┐   │     │
         │    └───▶│  completed  │   │     │
         │         └─────────────┘   │     │
         │                           │     │
         │    ┌──────────────────────┘     │
         │    │   interrupt                │
         │    ▼                            │
         │  ┌─────────────┐                │
         └─▶│ interrupted │────────────────┘
            └─────────────┘
```

## Extension Points

### Custom Task Types

Add custom fields to tasks:

```json
{
  "id": 1,
  "title": "Custom Task",
  "custom_field": "value"
}
```

### Custom Scripts

Create new scripts in `scripts/` directory:

```javascript
const { loadTasks, saveTasks } = require('./task-manager');

// Your custom logic
```

### Hooks

Planned for future versions:
- `pre-execute`: Run before task execution
- `post-execute`: Run after task completion
- `on-fail`: Handle task failures

## Performance Considerations

- **File I/O**: All state changes write to disk immediately
- **Memory**: Task list loaded once per operation
- **Concurrency**: Single-threaded execution per framework instance

## Security

- File operations restricted to framework directory
- No network access in core scripts
- Git commits require proper configuration
