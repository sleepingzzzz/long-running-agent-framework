/**
 * QClaw Agent Framework - 智能任务生成器
 * 分析项目需求，自动生成详细的任务列表
 */

const fs = require('fs');
const path = require('path');

// Use environment variable or auto-detect
const FRAMEWORK_DIR = process.env.LRAF_WORKSPACE || 
    path.resolve(__dirname, '..');
const TASKS_FILE = path.join(FRAMEWORK_DIR, 'tasks.json');
const WORK_SPEC_FILE = path.join(FRAMEWORK_DIR, 'WORK_SPEC.md');

function loadTasks() {
    return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
}

function saveTasks(tasks) {
    tasks.total_tasks = tasks.tasks.length;
    tasks.completed = tasks.tasks.filter(t => t.status === 'completed').length;
    tasks.in_progress = tasks.tasks.filter(t => t.status === 'in_progress').length;
    tasks.pending = tasks.tasks.filter(t => t.status === 'pending').length;
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

// 生成任务分析提示词
function generateAnalysisPrompt(projectName, projectDescription, requirements) {
    return `你是资深的软件架构师和项目经理。

请分析以下项目需求，生成详细的开发任务列表。

## 项目信息

项目名称: ${projectName}
项目描述: ${projectDescription}

## 需求描述

${requirements}

## 你的任务

1. 深度分析需求，识别所有功能模块
2. 将开发工作拆分为具体的、可执行的任务
3. 每个任务应该：
   - 具体明确（2小时内能完成）
   - 可独立执行（不依赖未完成的任务）
   - 可验证（有明确的完成标准）
   - 有合理的优先级（high/medium/low）

4. 任务应该覆盖完整的开发流程：
   - 项目初始化和环境配置
   - 数据库设计
   - 后端API开发
   - 前端页面开发
   - 测试和部署

5. 预估每个任务的耗时（小时）

## 输出格式

请输出JSON格式：

\`\`\`json
{
  "project": "项目名称",
  "description": "项目一句话描述",
  "tasks": [
    {
      "id": 1,
      "title": "任务标题（简洁明了）",
      "description": "详细描述：要做什么、怎么做、完成标准",
      "priority": "high|medium|low",
      "estimated_hours": 1.5
    }
  ]
}
\`\`\`

## 要求

- 生成 10-30 个任务（根据项目复杂度）
- 任务要有逻辑顺序（从基础到高级）
- 包含必要的技术决策说明
- 标记需要人工介入的环节（如外部服务配置）

请直接输出JSON，不要有多余的解释。`;
}

// 生成任务优化提示词
function generateOptimizationPrompt(currentTasks, feedback) {
    return `你是资深的软件架构师。

## 当前任务列表

\`\`\`json
${JSON.stringify(currentTasks, null, 2)}
\`\`\`

## 用户反馈

${feedback}

## 你的任务

根据用户反馈，优化任务列表：
1. 添加遗漏的任务
2. 删除不必要的任务
3. 调整任务顺序
4. 修改任务描述使其更清晰
5. 调整优先级和耗时预估

## 输出格式

输出优化后的完整JSON：

\`\`\`json
{
  "project": "...",
  "description": "...",
  "tasks": [...]
}
\`\`\``;
}

// 生成任务拆分提示词（针对大任务）
function generateSplitPrompt(task) {
    return `请将以下任务拆分为更小的子任务：

任务: ${task.title}
描述: ${task.description}
预估耗时: ${task.estimated_hours}小时

这个任务太大了，请拆分为 3-5 个更小的任务，每个任务不超过2小时。

输出JSON格式：
\`\`\`json
{
  "subtasks": [
    {
      "title": "子任务标题",
      "description": "详细描述",
      "priority": "high|medium|low",
      "estimated_hours": 1
    }
  ]
}
\`\`\``;
}

// 显示生成的提示词（供QClaw使用）
function showGeneratePrompt(projectName, projectDescription, requirements) {
    const prompt = generateAnalysisPrompt(projectName, projectDescription, requirements);
    
    console.log('\n' + '='.repeat(70));
    console.log('  AI 任务生成提示词');
    console.log('='.repeat(70));
    console.log('\n请在 QClaw 中使用以下提示词生成任务列表：\n');
    console.log('--- PROMPT START ---');
    console.log(prompt);
    console.log('--- PROMPT END ---\n');
    console.log('使用说明:');
    console.log('1. 复制上面的提示词');
    console.log('2. 在 QClaw 中粘贴并发送');
    console.log('3. AI会返回JSON格式的任务列表');
    console.log('4. 将返回的JSON保存到 tasks.json');
    console.log('='.repeat(70) + '\n');
}

// 从AI响应中提取JSON
function extractJSONFromResponse(response) {
    // 尝试提取 ```json ... ``` 格式
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
    }
    
    // 尝试直接解析整个响应
    try {
        return JSON.parse(response);
    } catch (e) {
        // 尝试提取 { ... } 部分
        const braceMatch = response.match(/(\{[\s\S]*\})/);
        if (braceMatch) {
            return JSON.parse(braceMatch[1]);
        }
    }
    
    throw new Error('无法从响应中提取JSON');
}

// 保存AI生成的任务
function saveGeneratedTasks(generatedData) {
    const tasks = {
        project: generatedData.project,
        description: generatedData.description,
        total_tasks: generatedData.tasks.length,
        completed: 0,
        in_progress: 0,
        pending: generatedData.tasks.length,
        tasks: generatedData.tasks.map((t, index) => ({
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
    
    saveTasks(tasks);
    console.log(`✅ 已保存 ${tasks.total_tasks} 个任务到 tasks.json`);
}

// 主函数
function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (!command || command === 'help') {
        console.log(`
========================================
QClaw Agent Framework - 智能任务生成器
========================================

使用方法:
  node scripts/task-generator.js <命令> [参数]

命令:
  generate "项目名" "描述" "需求"    生成任务分析提示词
  import "AI响应文本"              从AI响应导入任务
  optimize "反馈内容"              生成优化提示词
  split <任务ID>                   拆分指定任务

示例:
  node scripts/task-generator.js generate "电商平台" "B2C电商网站" "需要商品展示、购物车、支付功能"
  
  node scripts/task-generator.js import "{\\"project\\": \\"电商\\", ...}"
  
  node scripts/task-generator.js optimize "缺少支付相关的任务，请添加"
  
  node scripts/task-generator.js split 5

流程:
  1. 运行 generate 获取提示词
  2. 在 QClaw 中粘贴提示词，让AI生成任务
  3. 复制AI的JSON响应
  4. 运行 import "JSON内容" 保存任务
`);
        return;
    }
    
    switch (command) {
        case 'generate':
            if (args.length < 4) {
                console.log('❌ 用法: generate "项目名" "描述" "需求"');
                return;
            }
            showGeneratePrompt(args[1], args[2], args[3]);
            break;
            
        case 'import':
            if (!args[1]) {
                console.log('❌ 请提供AI返回的JSON内容');
                return;
            }
            try {
                const data = extractJSONFromResponse(args[1]);
                saveGeneratedTasks(data);
                console.log('\n任务列表预览:');
                data.tasks.forEach(t => {
                    console.log(`  [${t.priority}] ${t.title} (${t.estimated_hours}h)`);
                });
            } catch (e) {
                console.log('❌ 解析失败:', e.message);
                console.log('请确保提供的是有效的JSON格式');
            }
            break;
            
        case 'optimize':
            if (!args[1]) {
                console.log('❌ 请提供优化反馈');
                return;
            }
            const currentTasks = loadTasks();
            const prompt = generateOptimizationPrompt(currentTasks, args[1]);
            console.log('\n请在 QClaw 中使用以下提示词优化任务：\n');
            console.log(prompt);
            break;
            
        case 'split':
            if (!args[1]) {
                console.log('❌ 请提供任务ID');
                return;
            }
            const tasks = loadTasks();
            const task = tasks.tasks.find(t => t.id === parseInt(args[1]));
            if (!task) {
                console.log(`❌ 未找到任务 ${args[1]}`);
                return;
            }
            const splitPrompt = generateSplitPrompt(task);
            console.log('\n请在 QClaw 中使用以下提示词拆分任务：\n');
            console.log(splitPrompt);
            break;
            
        default:
            console.log(`❌ 未知命令: ${command}`);
            console.log('运行 node scripts/task-generator.js help 查看帮助');
    }
}

main();
