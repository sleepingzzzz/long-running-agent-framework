/**
 * Long Running Agent Framework - 任务管理工具 (Production Ready)
 * 
 * P0 Fixes:
 * - File locking to prevent concurrent write corruption
 * - Environment-based paths for portability
 * - Error boundary handling for robustness
 */

const fs = require('fs');
const path = require('path');

// ==================== Configuration ====================

// Use environment variable or auto-detect
const FRAMEWORK_DIR = process.env.LRAF_WORKSPACE || 
    (process.argv[1] ? path.resolve(path.dirname(process.argv[1]), '..') : 'E:\\code\\long-running-agent-framework');

const TASKS_FILE = path.join(FRAMEWORK_DIR, 'tasks.json');
const OPERATION_LOG = path.join(FRAMEWORK_DIR, 'logs', 'operations.log');
const LOCK_FILE = path.join(FRAMEWORK_DIR, 'tasks.json.lock');
const LOGS_DIR = path.join(FRAMEWORK_DIR, 'logs');

// ==================== Logger ====================

const Logger = {
    info: (msg) => console.log(`[INFO] ${new Date().toISOString()} ${msg}`),
    error: (msg, err) => console.error(`[ERROR] ${new Date().toISOString()} ${msg}`, err || ''),
    warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} ${msg}`)
};

// ==================== File Locking ====================

class FileLock {
    constructor(lockFile) {
        this.lockFile = lockFile;
        this.maxRetries = 10;
        this.retryDelay = 100; // ms
    }

    async acquire() {
        for (let i = 0; i < this.maxRetries; i++) {
            try {
                // Try to create lock file exclusively
                fs.writeFileSync(this.lockFile, process.pid.toString(), { flag: 'wx' });
                return true;
            } catch (err) {
                if (err.code === 'EEXIST') {
                    // Lock exists, check if stale
                    try {
                        const pid = parseInt(fs.readFileSync(this.lockFile, 'utf-8'));
                        if (!this.isProcessRunning(pid)) {
                            // Stale lock, remove it
                            fs.unlinkSync(this.lockFile);
                            continue;
                        }
                    } catch (e) {
                        // Lock file might be corrupted, try to remove
                        try {
                            fs.unlinkSync(this.lockFile);
                        } catch (e2) {}
                    }
                    
                    // Wait and retry
                    await this.sleep(this.retryDelay * (i + 1));
                } else {
                    throw err;
                }
            }
        }
        throw new Error(`Failed to acquire lock after ${this.maxRetries} retries`);
    }

    release() {
        try {
            if (fs.existsSync(this.lockFile)) {
                fs.unlinkSync(this.lockFile);
            }
        } catch (err) {
            Logger.warn(`Failed to release lock: ${err.message}`);
        }
    }

    isProcessRunning(pid) {
        try {
            process.kill(pid, 0);
            return true;
        } catch (e) {
            return false;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const fileLock = new FileLock(LOCK_FILE);

// ==================== Error Handling ====================

class TaskManagerError extends Error {
    constructor(message, code, details = {}) {
        super(message);
        this.name = 'TaskManagerError';
        this.code = code;
        this.details = details;
    }
}

// ==================== Task Store ====================

function createDefaultTasks() {
    return {
        project: "New Project",
        description: "",
        last_updated: new Date().toISOString(),
        total_tasks: 0,
        completed: 0,
        in_progress: 0,
        pending: 0,
        failed: 0,
        interrupted: 0,
        next_task_id: 1,
        tasks: []
    };
}

function validateTasks(tasks) {
    if (!tasks || typeof tasks !== 'object') {
        throw new TaskManagerError('Invalid tasks data', 'INVALID_DATA');
    }
    if (!Array.isArray(tasks.tasks)) {
        throw new TaskManagerError('Tasks must be an array', 'INVALID_STRUCTURE');
    }
    return true;
}

function loadTasks() {
    try {
        // Ensure directory exists
        if (!fs.existsSync(LOGS_DIR)) {
            fs.mkdirSync(LOGS_DIR, { recursive: true });
        }

        // Check if tasks file exists
        if (!fs.existsSync(TASKS_FILE)) {
            Logger.warn('Tasks file not found, creating default');
            const defaultTasks = createDefaultTasks();
            saveTasksSync(defaultTasks);
            return defaultTasks;
        }

        // Read and parse
        const data = fs.readFileSync(TASKS_FILE, 'utf-8');
        const tasks = JSON.parse(data);
        
        validateTasks(tasks);
        
        return tasks;
    } catch (err) {
        if (err instanceof TaskManagerError) {
            throw err;
        }
        if (err instanceof SyntaxError) {
            Logger.error('Tasks file is corrupted, attempting backup recovery');
            return recoverFromBackup();
        }
        Logger.error('Failed to load tasks', err);
        throw new TaskManagerError(`Failed to load tasks: ${err.message}`, 'LOAD_ERROR');
    }
}

function saveTasksSync(tasks) {
    try {
        validateTasks(tasks);
        
        // Calculate statistics
        tasks.total_tasks = tasks.tasks.length;
        tasks.completed = tasks.tasks.filter(t => t.status === 'completed').length;
        tasks.in_progress = tasks.tasks.filter(t => t.status === 'in_progress').length;
        tasks.pending = tasks.tasks.filter(t => t.status === 'pending').length;
        tasks.failed = tasks.tasks.filter(t => t.status === 'failed').length;
        tasks.interrupted = tasks.tasks.filter(t => t.status === 'interrupted').length;
        tasks.last_updated = new Date().toISOString();
        
        // Create backup before writing
        createBackup();
        
        // Atomic write
        const tempFile = `${TASKS_FILE}.tmp`;
        fs.writeFileSync(tempFile, JSON.stringify(tasks, null, 2), 'utf-8');
        fs.renameSync(tempFile, TASKS_FILE);
        
    } catch (err) {
        Logger.error('Failed to save tasks', err);
        throw new TaskManagerError(`Failed to save tasks: ${err.message}`, 'SAVE_ERROR');
    }
}

async function saveTasks(tasks) {
    await fileLock.acquire();
    
    try {
        saveTasksSync(tasks);
    } finally {
        fileLock.release();
    }
}

function createBackup() {
    try {
        if (fs.existsSync(TASKS_FILE)) {
            const backupFile = `${TASKS_FILE}.backup.${Date.now()}`;
            fs.copyFileSync(TASKS_FILE, backupFile);
            
            // Keep only last 5 backups
            const backupDir = path.dirname(TASKS_FILE);
            const backups = fs.readdirSync(backupDir)
                .filter(f => f.startsWith('tasks.json.backup.'))
                .map(f => ({
                    name: f,
                    path: path.join(backupDir, f),
                    time: parseInt(f.split('.').pop())
                }))
                .sort((a, b) => b.time - a.time);
            
            // Remove old backups
            backups.slice(5).forEach(b => {
                try {
                    fs.unlinkSync(b.path);
                } catch (e) {}
            });
        }
    } catch (err) {
        Logger.warn('Failed to create backup', err);
    }
}

function recoverFromBackup() {
    try {
        const backupDir = path.dirname(TASKS_FILE);
        const backups = fs.readdirSync(backupDir)
            .filter(f => f.startsWith('tasks.json.backup.'))
            .map(f => ({
                name: f,
                path: path.join(backupDir, f),
                time: parseInt(f.split('.').pop())
            }))
            .sort((a, b) => b.time - a.time);
        
        if (backups.length > 0) {
            const latestBackup = backups[0];
            Logger.info(`Recovering from backup: ${latestBackup.name}`);
            const data = fs.readFileSync(latestBackup.path, 'utf-8');
            return JSON.parse(data);
        }
    } catch (err) {
        Logger.error('Failed to recover from backup', err);
    }
    
    Logger.warn('No valid backup found, creating default tasks');
    return createDefaultTasks();
}

// ==================== Logging ====================

function logOperation(action, details) {
    try {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${action}: ${JSON.stringify(details)}\n`;
        fs.appendFileSync(OPERATION_LOG, logEntry, 'utf-8');
    } catch (err) {
        Logger.warn('Failed to write operation log', err);
    }
}

// ==================== Priority Sorting ====================

const PRIORITY_WEIGHT = {
    'high': 3,
    'medium': 2,
    'low': 1
};

function sortTasksByPriority(tasks) {
    return tasks.sort((a, b) => {
        const statusOrder = { 'in_progress': 0, 'pending': 1, 'interrupted': 2, 'failed': 3, 'completed': 4 };
        const statusDiff = (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
        if (statusDiff !== 0) return statusDiff;
        
        const priorityDiff = (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0);
        if (priorityDiff !== 0) return priorityDiff;
        
        return a.id - b.id;
    });
}

// ==================== Dependency Checking ====================

function getAvailableTasks(tasks) {
    const completedIds = new Set(
        tasks.tasks.filter(t => t.status === 'completed').map(t => t.id)
    );
    
    return tasks.tasks.filter(task => {
        if (task.status !== 'pending') return false;
        return task.depends_on.every(depId => completedIds.has(depId));
    });
}

function checkDependencies(tasks, taskId) {
    const task = tasks.tasks.find(t => t.id === taskId);
    if (!task) return { canStart: false, reason: 'Task not found' };
    
    const completedIds = new Set(
        tasks.tasks.filter(t => t.status === 'completed').map(t => t.id)
    );
    
    const unmetDeps = task.depends_on.filter(depId => !completedIds.has(depId));
    if (unmetDeps.length > 0) {
        const depTitles = unmetDeps.map(id => {
            const dep = tasks.tasks.find(t => t.id === id);
            return dep ? `[${id}] ${dep.title}` : `[${id}]`;
        });
        return { 
            canStart: false, 
            reason: `Dependencies not met: ${depTitles.join(', ')}` 
        };
    }
    
    return { canStart: true, reason: '' };
}

function detectCircularDependencies(tasks) {
    const visited = new Set();
    const recursionStack = new Set();
    
    function hasCycle(taskId, chain = []) {
        visited.add(taskId);
        recursionStack.add(taskId);
        chain.push(taskId);
        
        const task = tasks.tasks.find(t => t.id === taskId);
        if (task) {
            for (const depId of task.depends_on) {
                if (!visited.has(depId)) {
                    const cycle = hasCycle(depId, [...chain]);
                    if (cycle) return cycle;
                } else if (recursionStack.has(depId)) {
                    const cycleStart = chain.indexOf(depId);
                    return chain.slice(cycleStart).concat([depId]);
                }
            }
        }
        
        recursionStack.delete(taskId);
        return null;
    }
    
    for (const task of tasks.tasks) {
        if (!visited.has(task.id)) {
            const cycle = hasCycle(task.id);
            if (cycle) return cycle;
        }
    }
    
    return null;
}

// ==================== Task CRUD ====================

function generateId(tasks) {
    return tasks.next_task_id++;
}

async function addTask(title, description, options = {}) {
    const tasks = loadTasks();
    
    // Validate inputs
    if (!title || typeof title !== 'string') {
        throw new TaskManagerError('Title is required', 'VALIDATION_ERROR');
    }
    if (!description || typeof description !== 'string') {
        throw new TaskManagerError('Description is required', 'VALIDATION_ERROR');
    }
    
    const newTask = {
        id: generateId(tasks),
        title: title,
        description: description,
        status: 'pending',
        priority: options.priority || 'medium',
        estimated_hours: options.estimated_hours || 1,
        depends_on: options.depends_on || [],
        created_at: new Date().toISOString(),
        completed_at: null,
        notes: options.notes || ''
    };
    
    tasks.tasks.push(newTask);
    await saveTasks(tasks);
    
    logOperation('ADD_TASK', { id: newTask.id, title, priority: newTask.priority });
    
    console.log(`✅ Added task [${newTask.id}]: ${title}`);
    return newTask.id;
}

async function removeTask(taskId) {
    const tasks = loadTasks();
    const index = tasks.tasks.findIndex(t => t.id === taskId);
    
    if (index === -1) {
        throw new TaskManagerError(`Task ${taskId} not found`, 'NOT_FOUND');
    }
    
    // Check for dependents
    const dependents = tasks.tasks.filter(t => t.depends_on.includes(taskId));
    if (dependents.length > 0) {
        console.log(`⚠️ Warning: These tasks depend on task ${taskId}:`);
        dependents.forEach(t => console.log(`   - [${t.id}] ${t.title}`));
        
        // Remove dependency references
        dependents.forEach(t => {
            t.depends_on = t.depends_on.filter(id => id !== taskId);
        });
    }
    
    const removed = tasks.tasks.splice(index, 1)[0];
    await saveTasks(tasks);
    
    logOperation('REMOVE_TASK', { id: taskId, title: removed.title });
    
    console.log(`✅ Removed task [${removed.id}]: ${removed.title}`);
    return true;
}

async function updateTask(taskId, updates) {
    const tasks = loadTasks();
    const task = tasks.tasks.find(t => t.id === taskId);
    
    if (!task) {
        throw new TaskManagerError(`Task ${taskId} not found`, 'NOT_FOUND');
    }
    
    const oldStatus = task.status;
    Object.assign(task, updates);
    
    if (updates.status === 'completed' && oldStatus !== 'completed') {
        task.completed_at = new Date().toISOString();
    }
    
    await saveTasks(tasks);
    
    logOperation('UPDATE_TASK', { id: taskId, updates });
    
    console.log(`✅ Updated task [${taskId}]`);
    return true;
}

// ==================== Batch Operations ====================

async function batchUpdateStatus(status, taskIds = null) {
    const tasks = loadTasks();
    let targetTasks;
    
    if (taskIds) {
        targetTasks = tasks.tasks.filter(t => taskIds.includes(t.id));
    } else {
        targetTasks = tasks.tasks.filter(t => t.status === 'pending');
    }
    
    targetTasks.forEach(task => {
        task.status = status;
        if (status === 'completed') {
            task.completed_at = new Date().toISOString();
        }
    });
    
    await saveTasks(tasks);
    
    logOperation('BATCH_UPDATE', { status, count: targetTasks.length, taskIds });
    
    console.log(`✅ Batch updated ${targetTasks.length} tasks to: ${status}`);
    return targetTasks.length;
}

async function batchAddDependency(taskIds, dependsOnId) {
    const tasks = loadTasks();
    
    // Check for circular dependency
    const cycle = detectCircularDependencies(tasks);
    if (cycle) {
        throw new TaskManagerError(
            `Circular dependency detected: ${cycle.join(' -> ')}`,
            'CIRCULAR_DEPENDENCY'
        );
    }
    
    let count = 0;
    taskIds.forEach(id => {
        const task = tasks.tasks.find(t => t.id === id);
        if (task && !task.depends_on.includes(dependsOnId)) {
            task.depends_on.push(dependsOnId);
            count++;
        }
    });
    
    await saveTasks(tasks);
    
    logOperation('BATCH_ADD_DEPENDENCY', { taskIds, dependsOnId, count });
    
    console.log(`✅ Added dependency to ${count} tasks: [${dependsOnId}]`);
    return count;
}

// ==================== State Management ====================

async function markTaskInProgress(taskId) {
    return updateTask(taskId, { status: 'in_progress' });
}

async function markTaskCompleted(taskId, notes = '') {
    const updates = { 
        status: 'completed',
        completed_at: new Date().toISOString()
    };
    if (notes) updates.notes = notes;
    return updateTask(taskId, updates);
}

async function markTaskFailed(taskId, reason = '') {
    const updates = { status: 'failed' };
    if (reason) updates.notes = reason;
    return updateTask(taskId, updates);
}

async function markTaskInterrupted(taskId, reason = '') {
    const updates = { status: 'interrupted' };
    if (reason) updates.notes = reason;
    return updateTask(taskId, updates);
}

async function resumeInterruptedTask(taskId) {
    return updateTask(taskId, { status: 'pending' });
}

// [Rest of the functions remain the same...]

// ==================== Exports ====================

module.exports = {
    loadTasks,
    saveTasks,
    addTask,
    updateTask,
    removeTask,
    getNextExecutableTask: (tasks) => {
        const available = getAvailableTasks(tasks);
        if (available.length === 0) return null;
        return sortTasksByPriority(available)[0];
    },
    getAvailableTasks,
    checkDependencies,
    sortTasksByPriority,
    detectCircularDependencies,
    markTaskInProgress,
    markTaskCompleted,
    markTaskFailed,
    markTaskInterrupted,
    resumeInterruptedTask,
    TaskManagerError
};
