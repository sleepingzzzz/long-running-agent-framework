/**
 * QClaw Agent Framework - 自动化任务生成（简化版）
 * 一键生成任务列表
 */

const fs = require('fs');
const path = require('path');

const FRAMEWORK_DIR = 'E:\\code\\qclaw-agent-framework';
const TASKS_FILE = path.join(FRAMEWORK_DIR, 'tasks.json');

// 保存生成的任务
function saveTasks(projectName, description, tasks) {
    const taskData = {
        project: projectName,
        description: description,
        total_tasks: tasks.length,
        completed: 0,
        in_progress: 0,
        pending: tasks.length,
        tasks: tasks.map((t, index) => ({
            id: index + 1,
            title: t.title,
            description: t.description,
            status: 'pending',
            priority: t.priority || 'medium',
            estimated_hours: t.estimated_hours || 1,
            created_at: new Date().toISOString().split('T')[0],
            completed_at: null,
            notes: t.notes || ''
        }))
    };
    
    fs.writeFileSync(TASKS_FILE, JSON.stringify(taskData, null, 2), 'utf-8');
    console.log(`✅ 已保存 ${tasks.length} 个任务`);
    return taskData;
}

// 显示当前任务
function showTasks() {
    const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    console.log(`\n📋 当前任务: ${tasks.project}`);
    console.log(`   总计: ${tasks.total_tasks} | 已完成: ${tasks.completed} | 待处理: ${tasks.pending}\n`);
    
    tasks.tasks.slice(0, 10).forEach(t => {
        const icon = t.status === 'completed' ? '✓' : t.status === 'in_progress' ? '▶' : '○';
        console.log(`  ${icon} [${t.id}] ${t.title} [${t.priority}]`);
    });
    
    if (tasks.tasks.length > 10) {
        console.log(`  ... 还有 ${tasks.tasks.length - 10} 个任务`);
    }
}

module.exports = { saveTasks, showTasks };

// 如果直接运行
if (require.main === module) {
    showTasks();
}
