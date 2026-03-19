# Contributing to Long Running Agent Framework

First off, thank you for considering contributing to Long Running Agent Framework! It's people like you that make this tool better for everyone.

## 🚀 Quick Links

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)

---

## Code of Conduct

This project and everyone participating in it is governed by our commitment to:

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints

## Getting Started

### Prerequisites

- Node.js 18+ or Python 3.8+
- Git 2.0+
- A GitHub account

### Setting Up Development Environment

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/long-running-agent-framework.git
cd long-running-agent-framework

# 3. Set up environment
# Windows:
setup-env.bat
# Linux/macOS:
source setup-env.sh

# 4. Verify setup
node scripts/task-interactive.js list
```

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating a bug report, please check if the issue already exists.

When reporting bugs, include:

- **Clear title** - Summarize the problem
- **Steps to reproduce** - Minimal steps to trigger the bug
- **Expected behavior** - What you expected to happen
- **Actual behavior** - What actually happened
- **Environment** - OS, Node.js version, etc.
- **Screenshots** - If applicable

Example:
```
Title: Task status not updating after completion

Steps:
1. Run `node scripts/task-interactive.js run 1`
2. Complete the task
3. Check status with `node scripts/task-interactive.js list`

Expected: Task 1 shows as completed
Actual: Task 1 still shows as in_progress

Environment: Windows 11, Node.js 18.12.0
```

### 💡 Suggesting Enhancements

Enhancement suggestions are welcome! Include:

- **Use case** - Why is this needed?
- **Proposed solution** - How should it work?
- **Alternatives** - What else did you consider?
- **Additional context** - Mockups, examples, etc.

### 📝 Improving Documentation

Documentation improvements are always welcome:

- Fix typos
- Clarify confusing sections
- Add examples
- Translate to other languages

### 🔧 Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`
   ```bash
   git checkout -b feature/my-feature
   # or
   git checkout -b fix/my-bugfix
   ```
3. **Make your changes**
4. **Test your changes**
5. **Commit** with a clear message
6. **Push** to your fork
7. **Create a Pull Request**

---

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

### Before Submitting

```bash
# Test your changes
node scripts/task-manager.js list
node scripts/task-interactive.js next

# Check for syntax errors
node --check scripts/*.js

# Verify no hardcoded paths
grep -r "qclaw-agent-framework" scripts/ || echo "✅ No hardcoded paths"
```

### Code Review Process

1. All PRs require at least one review
2. CI checks must pass
3. Documentation must be updated if needed
4. Tests should be added for new features

---

## Style Guidelines

### JavaScript

```javascript
// Use const/let, not var
const fs = require('fs');

// Use async/await for async operations
async function loadTasks() {
    try {
        const data = await fs.promises.readFile('tasks.json');
        return JSON.parse(data);
    } catch (err) {
        handleError(err);
    }
}

// Use meaningful variable names
const taskManager = new TaskManager();

// Add JSDoc comments for functions
/**
 * Load tasks from file
 * @returns {Promise<Object>} Tasks object
 * @throws {TaskManagerError} If file not found or invalid
 */
async function loadTasks() {
    // ...
}
```

### Python

```python
# Use type hints
def add_task(title: str, description: str) -> int:
    """Add a new task.
    
    Args:
        title: Task title
        description: Task description
        
    Returns:
        New task ID
    """
    # ...
```

### Documentation

- Use clear, concise language
- Include code examples
- Keep line length under 80 characters
- Use proper Markdown formatting

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

Examples:
```
feat(task-manager): add batch operations

Add ability to update multiple tasks at once.
Includes validation and error handling.

Closes #123
```

```
fix(file-lock): handle stale locks

Detect and remove stale lock files from crashed processes.
Prevents infinite waiting on dead locks.

Fixes #456
```

---

## Testing

### Manual Testing

```bash
# Test task creation
node scripts/task-manager.js add "Test Task" "Test description" --priority high

# Test task execution
node scripts/task-interactive.js next

# Test error handling
# (Temporarily corrupt tasks.json and verify recovery)
```

### Test Checklist

- [ ] Task CRUD operations work
- [ ] Dependencies resolve correctly
- [ ] File locking prevents corruption
- [ ] Error recovery works
- [ ] CLI commands execute without errors
- [ ] Documentation is accurate

---

## Recognition

Contributors will be:

- Listed in the README
- Mentioned in release notes
- Added to the contributors graph

---

## Questions?

- Open an [issue](https://github.com/sleepingzzzz/long-running-agent-framework/issues)
- Start a [discussion](https://github.com/sleepingzzzz/long-running-agent-framework/discussions)

Thank you for contributing! 🎉
