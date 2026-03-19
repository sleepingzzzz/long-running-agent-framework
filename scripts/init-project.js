/**
 * QClaw Agent Framework - 项目初始化脚本 (Node.js 版本)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Use environment variable or auto-detect
const FRAMEWORK_DIR = process.env.LRAF_WORKSPACE || 
    path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(FRAMEWORK_DIR, 'config.json');

function createProjectStructure(projectName, projectType = 'fullstack') {
    const projectDir = path.join(FRAMEWORK_DIR, 'projects', projectName);
    
    if (fs.existsSync(projectDir)) {
        console.log(`⚠️ 项目目录已存在: ${projectDir}`);
        // 在自动化环境中默认继续
    }
    
    console.log(`\n📁 创建项目: ${projectName}`);
    console.log(`📂 项目路径: ${projectDir}\n`);
    
    // 创建目录结构
    const dirs = [
        'backend/src',
        'backend/tests',
        'frontend/src',
        'frontend/public',
        'frontend/tests',
        'database/migrations',
        'database/seeds',
        'docs',
        'scripts',
    ];
    
    dirs.forEach(d => {
        const dirPath = path.join(projectDir, d);
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`  ✓ 创建目录: ${d}`);
    });
    
    // 创建基础文件
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    const files = {
        'README.md': `# ${projectName}

项目创建时间: ${now}

## 项目结构

\`\`\`
${projectName}/
├── backend/          # 后端代码
├── frontend/         # 前端代码
├── database/         # 数据库相关
├── docs/            # 文档
└── scripts/         # 脚本
\`\`\`

## 开发指南

1. 查看 \`tasks.json\` 了解开发任务
2. 按照 \`WORK_SPEC.md\` 的工作流程开发
3. 每个任务完成后执行 Git Commit

## 技术栈

- 后端: Node.js/Express + PostgreSQL
- 前端: React + TypeScript
- 部署: Docker
`,
        
        '.gitignore': `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Database
*.sqlite
*.sqlite3
`,
        
        'backend/package.json': JSON.stringify({
            name: `${projectName}-backend`,
            version: "1.0.0",
            description: `Backend for ${projectName}`,
            main: "src/index.js",
            scripts: {
                start: "node src/index.js",
                dev: "nodemon src/index.js",
                test: "jest"
            },
            dependencies: {
                express: "^4.18.2",
                cors: "^2.8.5",
                dotenv: "^16.3.1",
                bcryptjs: "^2.4.3",
                jsonwebtoken: "^9.0.2",
                prisma: "^5.0.0",
                "@prisma/client": "^5.0.0"
            },
            devDependencies: {
                nodemon: "^3.0.1",
                jest: "^29.6.2"
            }
        }, null, 2),
        
        'frontend/package.json': JSON.stringify({
            name: `${projectName}-frontend`,
            version: "1.0.0",
            private: true,
            dependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0",
                "react-router-dom": "^6.14.2",
                axios: "^1.4.0"
            },
            scripts: {
                start: "react-scripts start",
                build: "react-scripts build",
                test: "react-scripts test"
            },
            devDependencies: {
                "react-scripts": "5.0.1"
            },
            browserslist: {
                production: [">0.2%", "not dead", "not op_mini all"],
                development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
            }
        }, null, 2),
        
        'backend/src/index.js': `const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TODO: Add routes here

app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});
`,
        
        'frontend/src/App.js': `import React from 'react';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>${projectName}</h1>
                <p>Welcome to your AI-generated project!</p>
            </header>
        </div>
    );
}

export default App;
`,
        
        'frontend/src/App.css': `.App {
    text-align: center;
}

.App-header {
    background-color: #282c34;
    padding: 20px;
    color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
`,
        
        'frontend/public/index.html': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${projectName}</title>
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
</body>
</html>
`,
    };
    
    Object.entries(files).forEach(([filePath, content]) => {
        const fullPath = path.join(projectDir, filePath);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`  ✓ 创建文件: ${filePath}`);
    });
    
    // 初始化 Git
    try {
        execSync('git init', { cwd: projectDir, stdio: 'ignore' });
        console.log(`  ✓ 初始化 Git 仓库`);
    } catch (e) {
        console.log(`  ⚠️ Git 初始化失败 (可能未安装 Git)`);
    }
    
    console.log(`\n✅ 项目 ${projectName} 创建成功！`);
    console.log(`\n下一步:`);
    console.log(`  1. 编辑 ${FRAMEWORK_DIR}\\tasks.json 更新项目路径`);
    console.log(`  2. 运行 run.bat 开始开发`);
    
    return true;
}

function main() {
    console.log('='.repeat(60));
    console.log('  QClaw Agent Framework - 项目初始化');
    console.log('='.repeat(60));
    
    // 加载配置
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    const projectName = config.project_name || 'my-project';
    
    console.log(`\n配置文件中的项目名称: ${projectName}`);
    
    createProjectStructure(projectName);
    
    return 0;
}

main();
