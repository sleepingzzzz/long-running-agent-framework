/**
 * QClaw Agent Framework - 交互式任务执行助手
 * 
 * 用于在 QClaw 对话中执行任务的辅助脚本
 * 支持：查看状态、执行任务、确认环节
 */

const { 
    loadTasks, 
    saveTasks, 
    getNextExecutableTask, 
    getAvailableTasks,
    checkDependencies,
    sortTasksByPriority
} = require('./task-manager');

const fs = require('fs');
const path = require('path');

// Use environment variable or auto-detect
const FRAMEWORK_DIR = process.env.LRAF_WORKSPACE || 
    path.resolve(__dirname, '..');
const TASKS_FILE = path.join(FRAMEWORK_DIR, 'tasks.json');
const WORK_SPEC_FILE = path.join(FRAMEWORK_DIR, 'WORK_SPEC.md');
const CONFIG_FILE = path.join(FRAMEWORK_DIR, 'config.json');

// ==================== 格式化输出 ====================

function formatTaskList(tasks) {
    const lines = [];
    lines.push('='.repeat(60));
    lines.push(`📋 任务列表 - ${tasks.project}`);
    lines.push(`🕐 最后更新: ${tasks.last_updated || 'N/A'}`);
    lines.push('='.repeat(60));
    lines.push(`总计: ${tasks.total_tasks} | ✅已完成: ${tasks.completed} | ▶️进行中: ${tasks.in_progress} | ⏳待处理: ${tasks.pending}`);
    lines.push('-'.repeat(60));
    
    // 按状态分组显示
    const byStatus = {
        'in_progress': [],
        'pending': [],
        'completed': [],
        'failed': [],
        'interrupted': []
    };
    
    tasks.tasks.forEach(t => {
        if (byStatus[t.status]) {
            byStatus[t.status].push(t);
        }
    });
    
    // 进行中
    if (byStatus.in_progress.length > 0) {
        lines.push('\n▶️ 进行中:');
        byStatus.in_progress.forEach(t => {
            lines.push(`   [${t.id}] ${t.title} [${t.priority}]`);
        });
    }
    
    // 待处理（按优先级排序）
    if (byStatus.pending.length > 0) {
        lines.push('\n⏳ 待处理:');
        const available = getAvailableTasks(tasks);
        const availableIds = new Set(available.map(t => t.id));
        
        sortTasksByPriority(byStatus.pending).forEach(t => {
            const ready = availableIds.has(t.id) ? '✅' : '🔒';
            const depInfo = t.depends_on.length > 0 ? `(依赖:${t.depends_on.join(',')})` : '';
            lines.push(`   ${ready} [${t.id}] ${t.title} [${t.priority}] ${depInfo}`);
        });
    }
    
    // 已完成
    if (byStatus.completed.length > 0) {
        lines.push('\n✅ 已完成:');
        byStatus.completed.slice(-5).forEach(t => {  // 只显示最近5个
            lines.push(`   [${t.id}] ${t.title}`);
        });
    }
    
    lines.push('\n' + '='.repeat(60));
    
    // 推荐下一步
    const next = getNextExecutableTask(tasks);
    if (next) {
        lines.push(`\n🚀 推荐执行: [${next.id}] ${next.title} [${next.priority}]`);
    } else if (byStatus.pending.length > 0) {
        lines.push(`\n⏸️ 有 ${byStatus.pending.length} 个任务因依赖未满足而等待中`);
    } else {
        lines.push(`\n🎉 所有任务已完成！`);
    }
    
    return lines.join('\n');
}

function formatTaskDetail(taskId) {
    const tasks = loadTasks();
    const task = tasks.tasks.find(t => t.id === taskId);
    
    if (!task) {
        return `❌ 未找到任务 ID: ${taskId}`;
    }
    
    const depCheck = checkDependencies(tasks, taskId);
    const lines = [];
    
    lines.push('='.repeat(60));
    lines.push(`📋 任务详情 [${task.id}]`);
    lines.push('='.repeat(60));
    lines.push(`标题: ${task.title}`);
    lines.push(`状态: ${task.status}`);
    lines.push(`优先级: ${task.priority}`);
    lines.push(`预计耗时: ${task.estimated_hours}小时`);
    lines.push(`可开始: ${depCheck.canStart ? '✅ 是' : '❌ 否'}`);
    if (!depCheck.canStart) {
        lines.push(`原因: ${depCheck.reason}`);
    }
    lines.push('');
    lines.push(`描述:`);
    lines.push(task.description);
    
    if (task.depends_on.length > 0) {
        lines.push('');
        lines.push('依赖任务:');
        task.depends_on.forEach(depId => {
            const dep = tasks.tasks.find(t => t.id === depId);
            const depStatus = dep ? dep.status : '未知';
            const icon = depStatus === 'completed' ? '✅' : depStatus === 'in_progress' ? '▶️' : '⏳';
            lines.push(`  ${icon} [${depId}] ${dep ? dep.title : '未知任务'} (${depStatus})`);
        });
    }
    
    if (task.notes) {
        lines.push('');
        lines.push(`备注: ${task.notes}`);
    }
    
    if (task.completed_at) {
        lines.push('');
        lines.push(`完成时间: ${task.completed_at}`);
    }
    
    lines.push('='.repeat(60));
    
    return lines.join('\n');
}

function formatExecutionPrompt(taskId) {
    const tasks = loadTasks();
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    const workSpec = fs.readFileSync(WORK_SPEC_FILE, 'utf-8');
    
    let task;
    
    if (taskId) {
        task = tasks.tasks.find(t => t.id === taskId);
        if (!task) {
            return { success: false, message: `❌ 未找到任务 ID: ${taskId}` };
        }
    } else {
        task = getNextExecutableTask(tasks);
        if (!task) {
            return { success: false, message: '❌ 没有可执行的任务（可能都已完成或有依赖未满足）' };
        }
    }
    
    // 检查依赖
    const depCheck = checkDependencies(tasks, task.id);
    if (!depCheck.canStart) {
        return { 
            success: false, 
            message: `⚠️ 任务 [${task.id}] 依赖未满足:\n${depCheck.reason}\n\n请先完成依赖任务。` 
        };
    }
    
    // 构建提示词
    const prompt = `你是 QClaw Agent Framework 中的 AI 开发工程师。

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
4. 在 progress.txt 中记录工作日志
5. 执行 Git Commit

# 重要提示

- 所有文件操作都在 ${FRAMEWORK_DIR} 目录下
- 项目代码存放在 ${path.join(FRAMEWORK_DIR, 'projects')} 下
- 如果遇到需要人工介入的情况，请明确说明
- 完成后回复 "任务完成" 并简要总结

请开始执行任务 ${task.id}: ${task.title}
`;

    return {
        success: true,
        task: task,
        prompt: prompt,
        message: `📋 准备执行任务 [${task.id}]: ${task.title}\n优先级: ${task.priority} | 预计: ${task.estimated_hours}小时\n\n${task.description}`
    };
}

// ==================== 命令处理 ====================

function handleCommand(command, args = []) {
    switch (command) {
        case 'list':
        case 'status':
            return { type: 'display', content: formatTaskList(loadTasks()) };
            
        case 'detail':
            if (!args[0]) {
                return { type: 'error', content: '用法: detail <任务ID>' };
            }
            return { type: 'display', content: formatTaskDetail(parseInt(args[0])) };
            
        case 'run':
        case 'execute':
            const taskId = args[0] ? parseInt(args[0]) : null;
            const result = formatExecutionPrompt(taskId);
            if (result.success) {
                return { 
                    type: 'prompt', 
                    content: result.message,
                    prompt: result.prompt,
                    task: result.task
                };
            } else {
                return { type: 'error', content: result.message };
            }
            
        case 'next':
            const nextResult = formatExecutionPrompt(null);
            if (nextResult.success) {
                return { 
                    type: 'prompt', 
                    content: nextResult.message,
                    prompt: nextResult.prompt,
                    task: nextResult.task
                };
            } else {
                return { type: 'error', content: nextResult.message };
            }
            
        default:
            return { 
                type: 'help', 
                content: `可用命令:
  list / status     - 查看任务列表
  detail <id>       - 查看任务详情
  run [id]          - 执行指定任务（或推荐任务）
  next              - 执行推荐任务

对话指令:
  "查看任务列表"
  "执行任务5"
  "执行下一个任务"
  "任务5详情"` 
            };
    }
}

// ==================== 主函数 ====================

function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';
    const cmdArgs = args.slice(1);
    
    const result = handleCommand(command, cmdArgs);
    
    switch (result.type) {
        case 'display':
        case 'help':
            console.log(result.content);
            break;
            
        case 'error':
            console.error(result.content);
            process.exit(1);
            break;
            
        case 'prompt':
            console.log(result.content);
            console.log('\n' + '='.repeat(60));
            console.log('AGENT_PROMPT_START');
            console.log(result.prompt);
            console.log('AGENT_PROMPT_END');
            console.log('='.repeat(60));
            break;
    }
}

// 导出供其他脚本使用
module.exports = {
    formatTaskList,
    formatTaskDetail,
    formatExecutionPrompt,
    handleCommand
};

// 如果是直接运行
if (require.main === module) {
    main();
}
