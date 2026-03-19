# 示例

长效运行智能体框架的真实使用示例。

## 目录

- [Web 应用](#web-应用)
- [API 开发](#api-开发)
- [CLI 工具](#cli-工具)
- [数据处理管道](#数据处理管道)

---

## Web 应用

### 项目: 电商平台

**tasks.json**:

```json
{
  "project": "电商平台",
  "description": "全栈电商应用",
  "tasks": [
    {
      "id": 1,
      "title": "项目初始化",
      "description": "初始化 React + Node.js 项目",
      "priority": "high",
      "estimated_hours": 1,
      "depends_on": [],
      "status": "pending"
    },
    {
      "id": 2,
      "title": "数据库设计",
      "description": "设计用户和商品表",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [1],
      "status": "pending"
    },
    {
      "id": 3,
      "title": "用户认证",
      "description": "实现登录和注册",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [2],
      "status": "pending"
    },
    {
      "id": 4,
      "title": "商品 API",
      "description": "带图片上传的商品 CRUD",
      "priority": "high",
      "estimated_hours": 3,
      "depends_on": [3],
      "status": "pending"
    },
    {
      "id": 5,
      "title": "购物车",
      "description": "购物车管理",
      "priority": "medium",
      "estimated_hours": 2,
      "depends_on": [4],
      "status": "pending"
    },
    {
      "id": 6,
      "title": "结账流程",
      "description": "订单创建、支付集成 (Stripe)",
      "priority": "high",
      "estimated_hours": 4,
      "depends_on": [5],
      "status": "pending"
    },
    {
      "id": 7,
      "title": "首页",
      "description": "带商品网格和搜索的落地页",
      "priority": "medium",
      "estimated_hours": 3,
      "depends_on": [1],
      "status": "pending"
    },
    {
      "id": 8,
      "title": "商品详情页",
      "description": "商品视图、评论、加入购物车",
      "priority": "medium",
      "estimated_hours": 2,
      "depends_on": [4, 7],
      "status": "pending"
    }
  ]
}
```

**执行**:

```bash
# 查看任务
node scripts/task-interactive.js list

# 开始开发
node scripts/task-interactive.js next
```

---

## API 开发

### 项目: REST API 服务

**tasks.json**:

```json
{
  "project": "REST API 服务",
  "description": "带认证的数据处理 API",
  "tasks": [
    {
      "id": 1,
      "title": "Express 服务器",
      "description": "初始化 Express.js 和中间件",
      "priority": "high",
      "estimated_hours": 1,
      "depends_on": [],
      "status": "pending"
    },
    {
      "id": 2,
      "title": "数据库连接",
      "description": "配置 MongoDB 和 Mongoose",
      "priority": "high",
      "estimated_hours": 1,
      "depends_on": [1],
      "status": "pending"
    },
    {
      "id": 3,
      "title": "API 认证",
      "description": "JWT 中间件和认证路由",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [2],
      "status": "pending"
    },
    {
      "id": 4,
      "title": "数据模型",
      "description": "定义核心实体的 Mongoose 模型",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [2],
      "status": "pending"
    },
    {
      "id": 5,
      "title": "CRUD 端点",
      "description": "实现 GET、POST、PUT、DELETE",
      "priority": "high",
      "estimated_hours": 3,
      "depends_on": [3, 4],
      "status": "pending"
    },
    {
      "id": 6,
      "title": "输入验证",
      "description": "使用 Joi 或 Zod 添加验证",
      "priority": "medium",
      "estimated_hours": 2,
      "depends_on": [5],
      "status": "pending"
    },
    {
      "id": 7,
      "title": "错误处理",
      "description": "全局错误处理和自定义错误类",
      "priority": "medium",
      "estimated_hours": 1,
      "depends_on": [5],
      "status": "pending"
    },
    {
      "id": 8,
      "title": "API 文档",
      "description": "Swagger/OpenAPI 文档",
      "priority": "low",
      "estimated_hours": 2,
      "depends_on": [5],
      "status": "pending"
    }
  ]
}
```

---

## CLI 工具

### 项目: 文件整理器 CLI

**tasks.json**:

```json
{
  "project": "文件整理器 CLI",
  "description": "整理文件的命令行工具",
  "tasks": [
    {
      "id": 1,
      "title": "CLI 框架",
      "description": "使用 Commander.js 设置基本命令",
      "priority": "high",
      "estimated_hours": 1,
      "depends_on": [],
      "status": "pending"
    },
    {
      "id": 2,
      "title": "文件扫描器",
      "description": "实现递归文件扫描",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [1],
      "status": "pending"
    },
    {
      "id": 3,
      "title": "整理规则",
      "description": "定义文件分类规则",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [2],
      "status": "pending"
    },
    {
      "id": 4,
      "title": "文件操作",
      "description": "实现移动、复制、删除操作",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [3],
      "status": "pending"
    },
    {
      "id": 5,
      "title": "配置",
      "description": "添加配置文件支持 (JSON/YAML)",
      "priority": "medium",
      "estimated_hours": 1,
      "depends_on": [1],
      "status": "pending"
    },
    {
      "id": 6,
      "title": "进度显示",
      "description": "添加进度条和状态输出",
      "priority": "low",
      "estimated_hours": 1,
      "depends_on": [4],
      "status": "pending"
    }
  ]
}
```

---

## 数据处理管道

### 项目: ETL 管道

**tasks.json**:

```json
{
  "project": "ETL 管道",
  "description": "提取、转换、加载数据管道",
  "tasks": [
    {
      "id": 1,
      "title": "数据源连接器",
      "description": "实现 CSV、JSON、API 连接器",
      "priority": "high",
      "estimated_hours": 3,
      "depends_on": [],
      "status": "pending"
    },
    {
      "id": 2,
      "title": "数据验证",
      "description": "Schema 验证和数据质量检查",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [1],
      "status": "pending"
    },
    {
      "id": 3,
      "title": "转换引擎",
      "description": "数据清洗、过滤和转换",
      "priority": "high",
      "estimated_hours": 4,
      "depends_on": [2],
      "status": "pending"
    },
    {
      "id": 4,
      "title": "输出写入器",
      "description": "写入数据库、文件或 API",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [3],
      "status": "pending"
    },
    {
      "id": 5,
      "title": "管道编排",
      "description": "作业调度和依赖管理",
      "priority": "medium",
      "estimated_hours": 3,
      "depends_on": [4],
      "status": "pending"
    },
    {
      "id": 6,
      "title": "监控和日志",
      "description": "跟踪管道执行和错误",
      "priority": "medium",
      "estimated_hours": 2,
      "depends_on": [5],
      "status": "pending"
    }
  ]
}
```

---

## 交互式工作流示例

### 场景 1: 开始新项目

**你**: 我想构建一个任务管理应用

**AI**: 
```
我将为任务管理应用创建任务列表。建议如下：

1. 项目初始化 (1小时)
2. 数据库设计 (2小时)
3. 用户认证 (2小时)
4. 任务 CRUD API (3小时)
5. 前端设置 (1小时)
6. 任务列表界面 (2小时)
7. 任务创建表单 (2小时)
8. 样式和优化 (2小时)

是否生成这些任务？
```

**你**: 是的，但添加实时同步功能

**AI**: 
```
添加任务：
9. WebSocket 设置 (2小时)
10. 实时同步逻辑 (3小时)

任务已保存到 tasks.json。开始吗？
```

**你**: 执行下一个任务

**AI**: 
```
🚀 执行任务 1: 项目初始化
创建项目结构中...
[子代理执行]
✅ 任务完成！提交: a1b2c3d

下一个任务: 2. 数据库设计
继续? [Y/n]: 
```

### 场景 2: 处理阻塞

**你**: 执行下一个任务

**AI**: 
```
⚠️ 任务 3 (用户认证) 需要：
- 数据库配置 (任务 2: ✅ 完成)
- Supabase 项目创建

请创建 Supabase 项目并提供连接字符串。
```

**你**: [提供连接字符串]

**AI**: 
```
✅ 配置已更新。继续任务 3...
```

### 场景 3: 项目中添加新需求

**你**: 我们需要添加邮件通知

**AI**: 
```
我将添加邮件通知任务：

11. 邮件服务设置 (1小时) - 依赖任务 3
12. 通知模板 (2小时) - 依赖任务 11
13. 任务分配时发送 (1小时) - 依赖任务 12

任务已添加。执行下一个任务或跳转到任务 11？
```

---

## 有效使用技巧

1. **从小开始**: 第一个项目 5-10 个任务
2. **定义依赖**: 使用 `depends_on` 确保逻辑顺序
3. **现实估计**: 将大任务拆分为 0.5-2 小时块
4. **更新状态**: 验证后立即标记任务完成
5. **记录备注**: 添加完成备注供将来参考
