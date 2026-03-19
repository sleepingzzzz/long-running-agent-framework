/**
 * QClaw Agent Framework - 核心循环脚本 (Phase 1 & 2 改进版)
 * 
 * 改进内容:
 * - Phase 1: 优先级排序、确认环节、明确任务选择
 * - Phase 2: 任务依赖、操作日志、批量操作支持
 */

const fs = require('fs');
const path = require('path');
const { 
    loadTasks, 
    saveTasks, 
    getNextExecutableTask, 
    checkDependencies,
    sortTasksByPriority,
    getAvailableTasks
} = require('./task-manager');

// Use environment variable or auto-detect
const FRAMEWORK_DIR = process.env.LRAF_WORKSPACE || 
    path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(FRAMEWORK_DIR, 'config.json');
const TASKS_FILE = path.join(FRAMEWORK_DIR, 'tasks.json');
const PROGRESS_FILE = path.join(FRAMEWORK_DIR, 'progress.txt');
const WORK_SPEC_FILE = path.join(FRAMEWORK_DIR, 'WORK_SPEC.md');
const LOGS_DIR = path.join(FRAMEWORK_DIR, 'logs');

// 确保日志目录存在
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// ==================== 日志记录 ====================

function log(message, type = 'info') {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️', task: '📋' };
    const icon = icons[type] || '•';
    const logLine = `[${timestamp}] ${icon} ${message}`;
    console.log(logLine);
    
    const logFile = path.join(LOGS_DIR, `agent_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.log`);
    fs.appendFileSync(logFile, logLine + '\n', 'utf-8');
}

// ==================== 配置加载 ====================

function loadConfig() {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
}

function loadWorkSpec() {
    return fs.readFileSync(WORK_SPEC_FILE, 'utf-8');
}

// ==================== 任务状态更新 ====================

function updateTaskStatus(tasks, taskId, status, notes = '') {
    const task = tasks.tasks.find(t => t.id === taskId);
    if (!task) return false;
    
    const oldStatus = task.status;
    task.status = status;
    
    if (status === 'completed') {
        task.completed_at = new Date().toISOString();
    }
    if (notes) {
        task.notes = notes;
    }
    
    // 更新统计
    tasks.completed = tasks.tasks.filter(t => t.status === 'completed').length;
    tasks.in_progress = tasks.tasks.filter(t => t.status === 'in_progress').length;
    tasks.pending = tasks.tasks.filter(t => t.status === 'pending').length;
    tasks.failed = tasks.tasks.filter(t => t.status === 'failed').length;
    tasks.interrupted = tasks.tasks.filter(t => t.status === 'interrupted').length;
    tasks.last_updated = new Date().toISOString();
    
    saveTasks(tasks);
    
    // 记录操作日志
    const operationLog = path.join(LOGS_DIR, 'operations.log');
    const logEntry = `[${new Date().toISOString()}] STATUS_CHANGE: task=${taskId}, from=${oldStatus}, to=${status}${notes ? ', notes=' + notes : ''}\n`;
    fs.appendFileSync(operationLog, logEntry, 'utf-8');
    
    return true;
}

// ==================== 显示任务列表 ====================

function displayTaskList(tasks) {
    console.log('\n' + '='.repeat(70));
    console.log(`📋 任务列表 - ${tasks.project}`);
    console.log(`🕐 最后更新: ${tasks.last_updated || 'N/A'}`);
    console.log('='.repeat(70));
    console.log(`总计: ${tasks.total_tasks} | ✅已完成: ${tasks.completed} | ▶️进行中: ${tasks.in_progress} | ⏳待处理: ${tasks.pending}`);
    console.log('-'.repeat(70) + '\n');
    
    // 显示所有任务（按优先级排序）
    const sortedTasks = sortTasksByPriority([...tasks.tasks]);
    
    sortedTasks.forEach(task => {
        const statusIcon = {
            'pending': '⏳',
            'in_progress': '▶️',
            'completed': '✅',
            'failed': '❌',
            'interrupted': '⏸️'
        }[task.status] || '❓';
        
        const priorityLabel = { 'high': '[高]', 'medium': '[中]', 'low': '[低]' }[task.priority] || '[中]';
        const depInfo = task.depends_on.length > 0 ? ` (依赖:${task.depends_on.join(',')})` : '';
        
        console.log(`${statusIcon} [${task.id}] ${task.title} ${priorityLabel}${depInfo}`);
    });
    
    // 显示可执行的任务
    const available = getAvailableTasks(tasks);
    if (available.length > 0) {
        console.log('\n' + '-'.repeat(70));
        console.log(`🚀 可立即执行的任务 (${available.length}个，按优先级排序):`);
        sortTasksByPriority(available).forEach((t, i) => {
            const ready = t.status === 'pending' ? '✅' : '⏳';
            console.log(`   ${i+1}. ${ready} [${t.id}] ${t.title} [${t.priority}]`);
        });
    }
    
    console.log('\n' + '='.repeat(70) + '\n');
}

// ==================== 显示任务详情 ====================

function displayTaskDetail(task, tasks) {
    const depCheck = checkDependencies(tasks, task.id);
    
    console.log('\n' + '='.repeat(70));
    console.log(`📋 任务详情 [${task.id}]`);
    console.log('='.repeat(70));
    console.log(`标题: ${task.title}`);
    console.log(`状态: ${task.status}`);
    console.log(`优先级: ${task.priority}`);
    console.log(`预计耗时: ${task.estimated_hours}小时`);
    console.log(`可开始: ${depCheck.canStart ? '✅ 是' : '❌ 否 - ' + depCheck.reason}`);
    console.log(`\n描述:\n${task.description}`);
    
    if (task.depends_on.length > 0) {
        console.log(`\n依赖任务:`);
        task.depends_on.forEach(depId => {
            const dep = tasks.tasks.find(t => t.id === depId);
            const depStatus = dep ? dep.status : '未知';
            const statusIcon = { 'completed': '✅', 'pending': '⏳', 'in_progress': '▶️' }[depStatus] || '❓';
            console.log(`  ${statusIcon} [${depId}] ${dep ? dep.title : '未知任务'} (${depStatus})`);
        });
    }
    
    if (task.notes) {
        console.log(`\n备注: ${task.notes}`);
    }
    
    if (task.completed_at) {
        console.log(`\n完成时间: ${task.completed_at}`);
    }
    
    console.log('='.repeat(70) + '\n');
}

// ==================== 构建Agent提示词 ====================

function buildAgentPrompt(task, workSpec, config) {
    return `你是 QClaw Agent Framework 中的 AI 开发工程师。

# 工作规范
${workSpec}

# 当前任务

任务ID: ${task.id}
任务标题: ${task.title}
任务描述: ${task.description}
优先级: ${task.priority}
预计耗时: ${task.estimated_hours}小时

# 项目信息

项目名称: ${config.project_name}
项目描述: ${config.project_description}
项目路径: ${config.project_path}

# 你的工作

1. 首先读取 ${TASKS_FILE}，将此任务标记为 "in_progress"
2. 按照 WORK_SPEC.md 中的六步工作流程完成任务
3. 完成后更新 ${TASKS_FILE} 标记为 "completed"
4. 在 ${PROGRESS_FILE} 中记录工作日志
5. 执行 Git Commit

# 重要提示

- 所有文件操作都在 ${FRAMEWORK_DIR} 目录下
- 项目代码存放在 ${path.join(FRAMEWORK_DIR, 'projects')} 下
- 如果遇到需要人工介入的情况，请明确说明
- 完成后回复 "任务完成" 并简要总结

请开始执行任务 ${task.id}: ${task.title}
`;
}

// ==================== 主循环 ====================

function runInteractiveCycle(targetTaskId = null) {
    log('='.repeat(70), 'info');
    log('开始新的工作循环', 'info');
    log('='.repeat(70), 'info');
    
    const config = loadConfig();
    const tasks = loadTasks();
    const workSpec = loadWorkSpec();
    
    // 显示当前任务状态
    displayTaskList(tasks);
    
    // 确定要执行的任务
    let task = null;
    
    if (targetTaskId) {
        // 用户指定了任务ID
        task = tasks.tasks.find(t => t.id === targetTaskId);
        if (!task) {
            log(`❌ 未找到任务 ID: ${targetTaskId}`, 'error');
            return false;
        }
        
        // 检查依赖
        const depCheck = checkDependencies(tasks, task.id);
        if (!depCheck.canStart) {
            log(`⚠️ 任务 [${task.id}] 依赖未满足: ${depCheck.reason}`, 'warning');
            log('请先完成依赖任务，或选择其他任务。', 'info');
            return false;
        }
        
        log(`📋 用户指定任务: [${task.id}] ${task.title}`, 'task');
    } else {
        // 自动选择下一个可执行任务
        task = getNextExecutableTask(tasks);
        
        if (!task) {
            log('✅ 没有可执行的任务！', 'success');
            
            // 检查是否有未满足依赖的任务
            const pendingTasks = tasks.tasks.filter(t => t.status === 'pending');
            if (pendingTasks.length > 0) {
                log(`\n⏳ 有 ${pendingTasks.length} 个待处理任务因依赖未满足而无法开始:`, 'warning');
                pendingTasks.forEach(t => {
                    const depCheck = checkDependencies(tasks, t.id);
                    console.log(`   - [${t.id}] ${t.title}: ${depCheck.reason}`);
                });
            }
            return false;
        }
        
        log(`📋 推荐任务: [${task.id}] ${task.title}`, 'task');
    }
    
    // 显示任务详情
    displayTaskDetail(task, tasks);
    
    // 标记为进行中
    updateTaskStatus(tasks, task.id, 'in_progress');
    log(`🔄 任务状态已更新为: in_progress`, 'info');
    
    // 构建提示词
    const prompt = buildAgentPrompt(task, workSpec, config);
    
    // 输出提示词（供QClaw使用）
    console.log('\n' + '='.repeat(70));
    console.log('AGENT_PROMPT_START');
    console.log(prompt);
    console.log('AGENT_PROMPT_END');
    console.log('='.repeat(70) + '\n');
    
    log('⏳ 等待AI完成任务...', 'info');
    log('提示: 子代理完成后，请告诉我"继续"或"执行下一个任务"', 'info');
    
    return true;
}

function showStatus() {
    const tasks = loadTasks();
    displayTaskList(tasks);
}

function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'status':
            showStatus();
            break;
            
        case 'run':
            const targetId = args[1] ? parseInt(args[1]) : null;
            runInteractiveCycle(targetId);
            break;
            
        default:
            log('🚀 QClaw Agent Framework - 改进版', 'info');
            log(`📁 工作目录: ${FRAMEWORK_DIR}`, 'info');
            
            // 检查环境
            if (!fs.existsSync(CONFIG_FILE)) {
                log('❌ 错误: 配置文件不存在', 'error');
                process.exit(1);
            }
            
            if (!fs.existsSync(TASKS_FILE)) {
                log('❌ 错误: 任务文件不存在', 'error');
                process.exit(1);
            }
            
            log('✅ 环境检查通过', 'success');
            
            // 显示使用说明
            console.log(`
使用方法:
  node scripts/agent-loop.js status     查看任务状态
  node scripts/agent-loop.js run        运行推荐任务
  node scripts/agent-loop.js run <id>   运行指定任务

或者直接对话:
  "查看任务列表"  → 显示所有任务
  "执行下一个任务" → 运行推荐任务
  "执行任务5"     → 运行指定任务
            `);
            
            // 默认显示状态
            showStatus();
    }
}

// 导出供其他脚本使用
module.exports = {
    runInteractiveCycle,
    showStatus,
    updateTaskStatus,
    displayTaskList
};

// 如果是直接运行
if (require.main === module) {
    main();
}
