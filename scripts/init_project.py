#!/usr/bin/env python3
"""
项目初始化脚本
创建新项目的基础目录结构和文件
"""

import json
import os
from pathlib import Path
from datetime import datetime

# Use environment variable or auto-detect
import os
FRAMEWORK_DIR = Path(os.environ.get("LRAF_WORKSPACE", "E:/code/long-running-agent-framework"))
CONFIG_FILE = FRAMEWORK_DIR / "config.json"


def create_project_structure(project_name: str, project_type: str = "fullstack"):
    """创建项目目录结构"""
    
    project_dir = FRAMEWORK_DIR / "projects" / project_name
    
    if project_dir.exists():
        print(f"⚠️ 项目目录已存在: {project_dir}")
        response = input("是否覆盖? (y/N): ")
        if response.lower() != 'y':
            print("取消操作")
            return False
    
    print(f"\n📁 创建项目: {project_name}")
    print(f"📂 项目路径: {project_dir}\n")
    
    # 创建目录结构
    dirs = [
        "backend/src",
        "backend/tests",
        "frontend/src",
        "frontend/public",
        "frontend/tests",
        "database/migrations",
        "database/seeds",
        "docs",
        "scripts",
    ]
    
    for d in dirs:
        (project_dir / d).mkdir(parents=True, exist_ok=True)
        print(f"  ✓ 创建目录: {d}")
    
    # 创建基础文件
    files = {
        "README.md": f"""# {project_name}

项目创建时间: {datetime.now().strftime("%Y-%m-%d %H:%M")}

## 项目结构

```
{project_name}/
├── backend/          # 后端代码
├── frontend/         # 前端代码
├── database/         # 数据库相关
├── docs/            # 文档
└── scripts/         # 脚本
```

## 开发指南

1. 查看 `tasks.json` 了解开发任务
2. 按照 `WORK_SPEC.md` 的工作流程开发
3. 每个任务完成后执行 Git Commit

## 技术栈

- 后端: Node.js/Express + PostgreSQL
- 前端: React + TypeScript
- 部署: Docker
""",
        
        ".gitignore": """# Dependencies
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
""",
        
        "backend/package.json": json.dumps({
            "name": f"{project_name}-backend",
            "version": "1.0.0",
            "description": f"Backend for {project_name}",
            "main": "src/index.js",
            "scripts": {
                "start": "node src/index.js",
                "dev": "nodemon src/index.js",
                "test": "jest"
            },
            "dependencies": {
                "express": "^4.18.2",
                "cors": "^2.8.5",
                "dotenv": "^16.3.1",
                "bcryptjs": "^2.4.3",
                "jsonwebtoken": "^9.0.2",
                "prisma": "^5.0.0",
                "@prisma/client": "^5.0.0"
            },
            "devDependencies": {
                "nodemon": "^3.0.1",
                "jest": "^29.6.2"
            }
        }, indent=2),
        
        "frontend/package.json": json.dumps({
            "name": f"{project_name}-frontend",
            "version": "1.0.0",
            "private": True,
            "dependencies": {
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "react-router-dom": "^6.14.2",
                "axios": "^1.4.0"
            },
            "scripts": {
                "start": "react-scripts start",
                "build": "react-scripts build",
                "test": "react-scripts test"
            },
            "devDependencies": {
                "react-scripts": "5.0.1"
            },
            "browserslist": {
                "production": [
                    ">0.2%",
                    "not dead",
                    "not op_mini all"
                ],
                "development": [
                    "last 1 chrome version",
                    "last 1 firefox version",
                    "last 1 safari version"
                ]
            }
        }, indent=2),
    }
    
    for file_path, content in files.items():
        full_path = project_dir / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  ✓ 创建文件: {file_path}")
    
    # 初始化 Git
    os.system(f'cd "{project_dir}" && git init')
    print(f"  ✓ 初始化 Git 仓库")
    
    print(f"\n✅ 项目 {project_name} 创建成功！")
    print(f"\n下一步:")
    print(f"  1. 编辑 {FRAMEWORK_DIR}/tasks.json 更新项目路径")
    print(f"  2. 运行 run.bat 开始开发")
    
    return True


def main():
    """主函数"""
    print("=" * 60)
    print("  QClaw Agent Framework - 项目初始化")
    print("=" * 60)
    
    # 加载配置
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        config = json.load(f)
    
    project_name = config.get("project_name", "my-project")
    
    print(f"\n配置文件中的项目名称: {project_name}")
    response = input(f"使用此名称创建项目? (Y/n): ")
    
    if response.lower() == 'n':
        project_name = input("请输入新的项目名称: ").strip()
    
    if not project_name:
        print("错误: 项目名称不能为空")
        return 1
    
    create_project_structure(project_name)
    
    return 0


if __name__ == "__main__":
    exit(main())
