# Task Management Dashboard — Full-Stack HJX Application

A production-ready task management system with Kanban board, task details,
team assignments, due dates, labels, filters, and real-time collaboration.

## Components

| File | Purpose |
|------|---------|
| `app.hjx` | Root app with routing and state |
| `kanban-board.hjx` | Drag-and-drop Kanban board |
| `task-detail.hjx` | Task detail modal/panel |
| `task-form.hjx` | Create/edit task form |
| `team-panel.hjx` | Team members and assignments |
| `analytics.hjx` | Project analytics and charts |
| `components/TaskCard.hjx` | Individual task card |
| `components/LabelBadge.hjx` | Color-coded label |
| `components/Avatar.hjx` | User avatar |
| `components/DueDatePicker.hjx` | Date picker |

## API Contract

```bash
# Tasks
GET    /api/tasks?status=in_progress&assignee=alice
POST   /api/tasks                  { title, description, status, labels, dueDate, assignee }
PUT    /api/tasks/:id              { ...updates }
DELETE /api/tasks/:id
PUT    /api/tasks/:id/status       { status }

# Board
GET    /api/board                   { columns: [{ id, title, tasks: [] }] }
PUT    /api/board/move              { taskId, fromColumn, toColumn, position }

# Team
GET    /api/team
POST   /api/team/invite             { email, role }
```
