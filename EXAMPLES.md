# Examples

Real-world usage examples for the Long Running Agent Framework.

## Table of Contents

- [Web Application](#web-application)
- [API Development](#api-development)
- [CLI Tool](#cli-tool)
- [Data Processing Pipeline](#data-processing-pipeline)

---

## Web Application

### Project: E-commerce Platform

**tasks.json**:

```json
{
  "project": "E-commerce Platform",
  "description": "Full-stack e-commerce application",
  "tasks": [
    {
      "id": 1,
      "title": "Project Setup",
      "description": "Initialize Next.js project with TypeScript, configure Tailwind CSS",
      "priority": "high",
      "estimated_hours": 1,
      "depends_on": [],
      "status": "pending"
    },
    {
      "id": 2,
      "title": "Database Schema",
      "description": "Design PostgreSQL schema for users, products, orders",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [1],
      "status": "pending"
    },
    {
      "id": 3,
      "title": "Authentication API",
      "description": "Implement JWT-based auth with login/register endpoints",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [2],
      "status": "pending"
    },
    {
      "id": 4,
      "title": "Product API",
      "description": "CRUD endpoints for products with image upload",
      "priority": "high",
      "estimated_hours": 3,
      "depends_on": [3],
      "status": "pending"
    },
    {
      "id": 5,
      "title": "Shopping Cart",
      "description": "Cart management with add/remove/update quantities",
      "priority": "medium",
      "estimated_hours": 2,
      "depends_on": [4],
      "status": "pending"
    },
    {
      "id": 6,
      "title": "Checkout Flow",
      "description": "Order creation, payment integration (Stripe)",
      "priority": "high",
      "estimated_hours": 4,
      "depends_on": [5],
      "status": "pending"
    },
    {
      "id": 7,
      "title": "Homepage",
      "description": "Landing page with product grid and search",
      "priority": "medium",
      "estimated_hours": 3,
      "depends_on": [1],
      "status": "pending"
    },
    {
      "id": 8,
      "title": "Product Detail Page",
      "description": "Product view with images, reviews, add to cart",
      "priority": "medium",
      "estimated_hours": 2,
      "depends_on": [4, 7],
      "status": "pending"
    }
  ]
}
```

**Execution**:

```bash
# View tasks
node scripts/task-interactive.js list

# Start development
node scripts/task-interactive.js next
```

---

## API Development

### Project: REST API Service

**tasks.json**:

```json
{
  "project": "REST API Service",
  "description": "Data processing API with authentication",
  "tasks": [
    {
      "id": 1,
      "title": "Setup Express Server",
      "description": "Initialize Express.js with middleware (cors, helmet, morgan)",
      "priority": "high",
      "estimated_hours": 1,
      "depends_on": [],
      "status": "pending"
    },
    {
      "id": 2,
      "title": "Database Connection",
      "description": "Configure MongoDB connection with Mongoose",
      "priority": "high",
      "estimated_hours": 1,
      "depends_on": [1],
      "status": "pending"
    },
    {
      "id": 3,
      "title": "API Authentication",
      "description": "JWT middleware and auth routes",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [2],
      "status": "pending"
    },
    {
      "id": 4,
      "title": "Data Models",
      "description": "Define Mongoose schemas for core entities",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [2],
      "status": "pending"
    },
    {
      "id": 5,
      "title": "CRUD Endpoints",
      "description": "Implement GET, POST, PUT, DELETE endpoints",
      "priority": "high",
      "estimated_hours": 3,
      "depends_on": [3, 4],
      "status": "pending"
    },
    {
      "id": 6,
      "title": "Input Validation",
      "description": "Add request validation with Joi or Zod",
      "priority": "medium",
      "estimated_hours": 2,
      "depends_on": [5],
      "status": "pending"
    },
    {
      "id": 7,
      "title": "Error Handling",
      "description": "Global error handler and custom error classes",
      "priority": "medium",
      "estimated_hours": 1,
      "depends_on": [5],
      "status": "pending"
    },
    {
      "id": 8,
      "title": "API Documentation",
      "description": "Setup Swagger/OpenAPI documentation",
      "priority": "low",
      "estimated_hours": 2,
      "depends_on": [5],
      "status": "pending"
    }
  ]
}
```

---

## CLI Tool

### Project: File Organizer CLI

**tasks.json**:

```json
{
  "project": "File Organizer CLI",
  "description": "Command-line tool for organizing files",
  "tasks": [
    {
      "id": 1,
      "title": "CLI Framework",
      "description": "Setup Commander.js with basic commands",
      "priority": "high",
      "estimated_hours": 1,
      "depends_on": [],
      "status": "pending"
    },
    {
      "id": 2,
      "title": "File Scanner",
      "description": "Implement recursive file scanning",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [1],
      "status": "pending"
    },
    {
      "id": 3,
      "title": "Organization Rules",
      "description": "Define rules for file categorization",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [2],
      "status": "pending"
    },
    {
      "id": 4,
      "title": "File Operations",
      "description": "Implement move, copy, delete operations",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [3],
      "status": "pending"
    },
    {
      "id": 5,
      "title": "Configuration",
      "description": "Add config file support (JSON/YAML)",
      "priority": "medium",
      "estimated_hours": 1,
      "depends_on": [1],
      "status": "pending"
    },
    {
      "id": 6,
      "title": "Progress Display",
      "description": "Add progress bars and status output",
      "priority": "low",
      "estimated_hours": 1,
      "depends_on": [4],
      "status": "pending"
    }
  ]
}
```

---

## Data Processing Pipeline

### Project: ETL Pipeline

**tasks.json**:

```json
{
  "project": "ETL Pipeline",
  "description": "Extract, transform, load data pipeline",
  "tasks": [
    {
      "id": 1,
      "title": "Data Source Connectors",
      "description": "Implement connectors for CSV, JSON, API sources",
      "priority": "high",
      "estimated_hours": 3,
      "depends_on": [],
      "status": "pending"
    },
    {
      "id": 2,
      "title": "Data Validation",
      "description": "Schema validation and data quality checks",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [1],
      "status": "pending"
    },
    {
      "id": 3,
      "title": "Transformation Engine",
      "description": "Data cleaning, filtering, and transformation",
      "priority": "high",
      "estimated_hours": 4,
      "depends_on": [2],
      "status": "pending"
    },
    {
      "id": 4,
      "title": "Output Writers",
      "description": "Write to database, file, or API destinations",
      "priority": "high",
      "estimated_hours": 2,
      "depends_on": [3],
      "status": "pending"
    },
    {
      "id": 5,
      "title": "Pipeline Orchestration",
      "description": "Job scheduling and dependency management",
      "priority": "medium",
      "estimated_hours": 3,
      "depends_on": [4],
      "status": "pending"
    },
    {
      "id": 6,
      "title": "Monitoring & Logging",
      "description": "Track pipeline execution and errors",
      "priority": "medium",
      "estimated_hours": 2,
      "depends_on": [5],
      "status": "pending"
    }
  ]
}
```

---

## Interactive Workflow Examples

### Scenario 1: Starting a New Project

**User**: I want to build a task management app

**AI**: 
```
I'll create a task list for a task management app. Here's what I suggest:

1. Project Setup (1h)
2. Database Design (2h)
3. User Authentication (2h)
4. Task CRUD API (3h)
5. Frontend Setup (1h)
6. Task List UI (2h)
7. Task Creation Form (2h)
8. Styling & Polish (2h)

Should I generate these tasks?
```

**User**: Yes, but add a real-time sync feature

**AI**: 
```
Added tasks:
9. WebSocket Setup (2h)
10. Real-time Sync Logic (3h)

Tasks saved to tasks.json. Ready to start?
```

**User**: Execute next task

**AI**: 
```
🚀 Executing Task 1: Project Setup
Creating project structure...
[Sub-agent execution]
✅ Task completed! Git commit: a1b2c3d

Next task: 2. Database Design
Continue?
```

### Scenario 2: Handling Blockers

**User**: Execute next task

**AI**: 
```
⚠️ Task 3 (User Authentication) requires:
- Database configured (Task 2: ✅ completed)
- Supabase project created

Please create a Supabase project and provide the connection string.
```

**User**: [Provides connection string]

**AI**: 
```
✅ Configuration updated. Resuming Task 3...
```

### Scenario 3: Adding Mid-Project Requirements

**User**: We need to add email notifications

**AI**: 
```
I'll add email notification tasks:

11. Email Service Setup (1h) - depends on Task 3
12. Notification Templates (2h) - depends on Task 11
13. Send on Task Assignment (1h) - depends on Task 12

Tasks added. Execute next task or jump to Task 11?
```

---

## Tips for Effective Use

1. **Start Small**: Begin with 5-10 tasks for your first project
2. **Define Dependencies**: Use `depends_on` to ensure logical order
3. **Estimate Realistically**: Break large tasks into 0.5-2 hour chunks
4. **Update Status**: Mark tasks complete immediately after verification
5. **Document Notes**: Add completion notes for future reference
