/**
 * QClaw Agent Framework - 状态查看工具 (Node.js 版本)
 * 快速查看框架运行状态和任务进度
 */

const fs = require('fs');
const path = require('path');

const FRAMEWORK_DIR = 'E:\\code\\qclaw-agent-framework';
const TASKS_FILE = path.join(FRAMEWORK_DIR, 'tasks.json');
const PROGRESS_FILE = path.join(FRAMEWORK_DIR, 'progress.txt');
const CONFIG_FILE = path.join(FRAMEWORK_DIR, 'config.json');

function printHeader(text) {
    console.log('\n' + '='.repeat(60));
    console.log('  ' + text);
    console.log('='.repeat(60));
}

function printStatus() {
    printHeader('QClaw Agent Framework 状态');
    
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    
    console.log(`框架版本: ${config.version}`);
    console.log(`项目名称: ${config.project_name}`);
    console.log(`项目描述: ${config.project_description}`);
    console.log(`工作目录: ${config.paths.workspace}`);
}

function printTasks() {
    printHeader('任务进度');
    
    const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    
    const total = tasks.total_tasks;
    const completed = tasks.completed;
    const pending = tasks.pending;
    const inProgress = tasks.in_progress;
    
    const progressPct = total > 0 ? (completed / total * 100).toFixed(1) : 0;
    
    console.log(`总任务数: ${total}`);
    console.log(`已完成:   ${completed} (${progressPct}%)`);
    console.log(`进行中:   ${inProgress}`);
    console.log(`待处理:   ${pending}`);
    
    // 进度条
    const barWidth = 40;
    const filled = Math.floor(barWidth * completed / total);
    const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);
    console.log(`\n进度: [${bar}] ${progressPct}%`);
    
    // 显示最近完成的任务
    if (completed > 0) {
        console.log('\n最近完成的任务:');
        const completedTasks = tasks.tasks.filter(t => t.status === 'completed')
            .sort((a, b) => (b.completed_at || '').localeCompare(a.completed_at || ''));
        completedTasks.slice(0, 3).forEach(task => {
            console.log(`  ✓ [${task.id}] ${task.title}`);
        });
    }
    
    // 显示进行中的任务
    if (inProgress > 0) {
        console.log('\n进行中的任务:');
        tasks.tasks.filter(t => t.status === 'in_progress').forEach(task => {
            console.log(`  ▶ [${task.id}] ${task.title}`);
        });
    }
    
    // 显示下一个待处理任务
    if (pending > 0) {
        console.log('\n下一个待处理任务:');
        const nextTask = tasks.tasks.find(t => t.status === 'pending');
        if (nextTask) {
            console.log(`  ○ [${nextTask.id}] ${nextTask.title}`);
            console.log(`    ${nextTask.description.substring(0, 60)}...`);
        }
    }
}

function printProgress() {
    printHeader('最近工作日志');
    
    if (!fs.existsSync(PROGRESS_FILE)) {
        console.log('暂无工作日志');
        return;
    }
    
    const content = fs.readFileSync(PROGRESS_FILE, 'utf-8');
    const lines = content.trim().split('\n');
    
    // 找到最近的日志条目
    const entries = [];
    let currentEntry = [];
    
    lines.forEach(line => {
        if (line.trim() === '---') {
            if (currentEntry.length > 0) {
                entries.push(currentEntry.join('\n'));
                currentEntry = [];
            }
        } else {
            currentEntry.push(line);
        }
    });
    
    if (currentEntry.length > 0) {
        entries.push(currentEntry.join('\n'));
    }
    
    // 显示最近3条
    if (entries.length > 0) {
        entries.slice(-3).forEach(entry => {
            console.log(entry);
            console.log('-'.repeat(40));
        });
    } else {
        console.log('暂无工作日志');
    }
}

function printNextAction() {
    printHeader('建议操作');
    
    const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    const pending = tasks.pending;
    const inProgress = tasks.in_progress;
    
    if (inProgress > 0) {
        console.log('当前有任务正在进行中，请等待完成或检查状态');
        console.log('\n操作命令:');
        console.log('  1. 查看详细日志: type progress.txt');
        console.log('  2. 强制标记完成: 编辑 tasks.json 修改状态');
    } else if (pending > 0) {
        console.log('有待处理任务，可以开始执行');
        console.log('\n操作命令:');
        console.log('  1. 执行单个任务: node scripts/agent-loop.js');
        console.log('  2. 启动定时任务: 配置 QClaw Cron (见 INFINITE_RUN.md)');
        console.log('  3. 手动触发: 在 QClaw 中发送 "执行下一个开发任务"');
    } else {
        console.log('🎉 所有任务已完成！');
    }
}

function main() {
    printStatus();
    printTasks();
    printProgress();
    printNextAction();
    
    console.log('\n' + '='.repeat(60));
    console.log("使用 'node scripts/status.js' 随时查看状态");
    console.log('='.repeat(60) + '\n');
}

main();
