# Prueba-Brandon

A **Task Management REST API** built with **Node.js + TypeScript**, demonstrating senior-level engineering practices including clean architecture, SOLID principles, layered separation of concerns, input validation, structured error handling, and unit-tested business logic.

## 🏗️ Architecture

The project follows a **Clean Architecture / Layered Architecture** pattern:

```
src/
├── models/          # Domain entities and DTOs
├── repositories/    # Data access layer (ITaskRepository + InMemory implementation)
├── services/        # Business logic layer (TaskService)
├── controllers/     # HTTP presentation layer (TaskController)
├── middlewares/     # Cross-cutting concerns (error handling)
├── routes/          # Route definitions (dependency wiring)
├── types/           # Shared type definitions and custom error classes
├── app.ts           # Express application factory
└── index.ts         # Entry point
```

### Design Principles Demonstrated

- **SOLID**: Single Responsibility, Open/Closed via interfaces, Liskov substitution, Dependency Inversion (service depends on `ITaskRepository` interface)
- **Dependency Injection**: `TaskService` receives its repository through the constructor
- **Repository Pattern**: Data access is abstracted behind `ITaskRepository`, enabling easy swapping (e.g., PostgreSQL, MongoDB)
- **Factory Pattern**: `createApp()` separates app configuration from server startup, making the app easily testable
- **Structured Error Handling**: `HttpError` hierarchy (`ValidationError`, `NotFoundError`, `ConflictError`) with centralised middleware

## 📋 API Reference

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/tasks` | List tasks (paginated, filterable) |
| GET | `/api/v1/tasks/:id` | Get a task by ID |
| POST | `/api/v1/tasks` | Create a task |
| PUT | `/api/v1/tasks/:id` | Update a task |
| DELETE | `/api/v1/tasks/:id` | Delete a task |

### Query Parameters for `GET /api/v1/tasks`

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page, 1–100 (default: 10) |
| `status` | string | Filter by status: `pending`, `in_progress`, `completed`, `cancelled` |
| `priority` | string | Filter by priority: `low`, `medium`, `high` |
| `search` | string | Search by title or description |

### Task Object

```json
{
  "id": "uuid",
  "title": "string (max 200 chars)",
  "description": "string",
  "status": "pending | in_progress | completed | cancelled",
  "priority": "low | medium | high",
  "dueDate": "ISO 8601 date (optional)",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime"
}
```

### Request Examples

**Create a task:**
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement authentication",
    "description": "Add JWT-based auth to the API",
    "priority": "high",
    "dueDate": "2099-12-31"
  }'
```

**Update task status:**
```bash
curl -X PUT http://localhost:3000/api/v1/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Filter and paginate:**
```bash
curl "http://localhost:3000/api/v1/tasks?status=pending&priority=high&page=1&limit=5"
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | INTERNAL_SERVER_ERROR",
    "message": "Human-readable error message"
  }
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 8

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |

## 🧪 Testing

```bash
# Run all tests with coverage
npm test

# Watch mode
npm run test:watch
```

### Test Coverage

Tests cover:
- **Repository layer**: CRUD, filtering, pagination, edge cases
- **Service layer**: Business rules, input validation, error propagation

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   93.25 |    88.73 |   90.47 |   94.18 |
  Task.ts           |     100 |      100 |     100 |     100 |
  TaskRepository.ts |   93.75 |    84.61 |   88.88 |   96.55 |
  TaskService.ts    |   91.66 |    90.24 |     100 |   91.66 |
  errors.ts         |   91.66 |      100 |      75 |   91.66 |
--------------------|---------|----------|---------|---------|
```

## 🔧 Linting

```bash
npm run lint
npm run lint:fix
```

## 📁 Project Structure

```
Prueba-Brandon/
├── src/
│   ├── controllers/TaskController.ts   # HTTP layer
│   ├── services/TaskService.ts         # Business logic
│   ├── repositories/TaskRepository.ts  # Data access
│   ├── models/Task.ts                  # Domain types
│   ├── middlewares/errorHandler.ts     # Error middleware
│   ├── routes/taskRoutes.ts            # Route wiring
│   ├── types/errors.ts                 # Custom error classes
│   ├── app.ts                          # App factory
│   └── index.ts                        # Server entry point
├── tests/
│   └── unit/
│       ├── TaskRepository.test.ts
│       └── TaskService.test.ts
├── tsconfig.json
├── tsconfig.test.json
├── eslint.config.mjs
└── package.json
```
