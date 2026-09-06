# Users, Projects & Tasks API

A robust, production-ready **Node.js + Express REST API** built for managing **Users**, **Projects**, and **Sprint Tasks** with status management, Zod input validation, centralized error handling, and in-memory data store.

---

## ⚡ Quick Start (Run Locally)

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create or check the `.env` file in `/backend`:
```ini
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 4. Run development server (with hot reload via Nodemon)
```bash
npm run dev
```

### 5. Run automated test suite
```bash
npm test
```

Server will start listening on **`http://localhost:5000`**.

---

## 🌐 Base URL & Endpoints Overview

- **Base URL**: `http://localhost:5000/api/v1` (or `http://localhost:5000/api`)
- **Health Check**: `http://localhost:5000/health`
- **Root Overview**: `http://localhost:5000/`

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health check and uptime status | `200 OK` |
| `GET` | `/` | API overview and index of available endpoints | `200 OK` |
| **Users** | | | |
| `GET` | `/api/v1/users` | List all users (supports `?search=` and `?role=`) | `200 OK` |
| `GET` | `/api/v1/users/:id` | Get single user by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/v1/users` | Create a new user | `201 Created` / `400 Bad Request` / `409 Conflict` |
| `PUT` | `/api/v1/users/:id` | Update user details | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/v1/users/:id` | Delete user | `200 OK` / `404 Not Found` |
| **Projects** | | | |
| `GET` | `/api/v1/projects` | List all projects (supports `?category=`, `?status=`, `?search=`) | `200 OK` |
| `GET` | `/api/v1/projects/:id` | Get project by ID with hydrated lead info & task progress | `200 OK` / `404 Not Found` |
| `GET` | `/api/v1/projects/:id/tasks` | Get all tasks belonging to a specific project | `200 OK` / `404 Not Found` |
| `POST` | `/api/v1/projects` | Create a new project | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/v1/projects/:id` | Update project details | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/v1/projects/:id` | Delete project and cascade-delete its tasks | `200 OK` / `404 Not Found` |
| **Tasks** | | | |
| `GET` | `/api/v1/tasks` | List all sprint tasks (supports `?projectId=`, `?assigneeId=`, `?status=`, `?priority=`, `?search=`) | `200 OK` |
| `GET` | `/api/v1/tasks/:id` | Get single sprint task by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/v1/tasks` | Create a new task | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/v1/tasks/:id` | Update task details | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `PATCH` | `/api/v1/tasks/:id/status` | Update task status (`todo`, `in-progress`, `done`) | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/v1/tasks/:id` | Delete task | `200 OK` / `404 Not Found` |
| **AI Assistant** | | | |
| `POST` | `/api/v1/ai/generate-tasks` | Generate 4-6 AI suggested sprint tasks from project goal/description using Google Gemini | `200 OK` / `400 Bad Request` / `429 Too Many Requests` / `500 Server Error` |

---

## 📋 Data Models & Status Enums

### 1. Task Status
Supported status values:
- `todo`
- `in-progress` (also accepts `in_progress`)
- `done`

### 2. Task Priority
- `low`, `medium`, `high`, `urgent`

### 3. Project Categories
- `Frontend`, `Backend`, `Fullstack`, `DevOps`, `Mobile`, `AI / ML`

### 4. Project Health Status
- `on_track`, `at_risk`, `delayed`, `completed`

---

## 🛠️ API Reference & Request / Response Examples

### 1. User Management Endpoints

#### `GET /api/v1/users`
Retrieve a list of all registered users.
- **Query Parameters (Optional)**:
  - `search` (string): Filter by name, email, handle, or role.
  - `role` (string): Filter by exact role.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "usr-1",
      "name": "Alex Rivera",
      "email": "alex.rivera@devtrack.io",
      "handle": "arivera",
      "role": "Principal Architect",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "company": "DevTrack Labs",
      "location": "San Francisco, CA",
      "bio": "Distributed systems architect & TypeScript enthusiast.",
      "createdAt": "2025-01-10T08:00:00.000Z",
      "updatedAt": "2025-02-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

---

#### `GET /api/v1/users/:id`
Retrieve single user details by ID.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "usr-1",
    "name": "Alex Rivera",
    "email": "alex.rivera@devtrack.io",
    "handle": "arivera",
    "role": "Principal Architect",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "company": "DevTrack Labs",
    "location": "San Francisco, CA",
    "bio": "Distributed systems architect & TypeScript enthusiast.",
    "createdAt": "2025-01-10T08:00:00.000Z",
    "updatedAt": "2025-02-15T10:30:00.000Z"
  }
}
```

**Response `404 Not Found`**:
```json
{
  "success": false,
  "status": "fail",
  "message": "User with ID 'usr-999' not found"
}
```

---

#### `POST /api/v1/users`
Create a new user.

**Request Body**:
```json
{
  "name": "Maya Lin",
  "email": "maya.lin@devtrack.io",
  "handle": "mlin",
  "role": "Senior Cloud Engineer",
  "company": "DevTrack Labs",
  "location": "New York, NY",
  "bio": "Specializing in Kubernetes operators and low-latency network mesh."
}
```

**Response `201 Created`**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "usr-8a21f9bc",
    "name": "Maya Lin",
    "email": "maya.lin@devtrack.io",
    "handle": "mlin",
    "role": "Senior Cloud Engineer",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "company": "DevTrack Labs",
    "location": "New York, NY",
    "bio": "Specializing in Kubernetes operators and low-latency network mesh.",
    "createdAt": "2025-03-01T12:00:00.000Z",
    "updatedAt": "2025-03-01T12:00:00.000Z"
  }
}
```

**Response `400 Bad Request (Validation Error)`**:
```json
{
  "success": false,
  "status": "fail",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address format",
      "code": "invalid_string"
    }
  ]
}
```

**Response `409 Conflict`**:
```json
{
  "success": false,
  "status": "fail",
  "message": "A user with email 'maya.lin@devtrack.io' already exists"
}
```

---

#### `PUT /api/v1/users/:id`
Update an existing user's information.

**Request Body**:
```json
{
  "role": "Staff Cloud Architect",
  "location": "Remote / New York"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "usr-1",
    "name": "Alex Rivera",
    "email": "alex.rivera@devtrack.io",
    "role": "Staff Cloud Architect",
    "location": "Remote / New York",
    "updatedAt": "2025-03-01T12:15:00.000Z"
  }
}
```

---

#### `DELETE /api/v1/users/:id`
Delete a user by ID.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": "usr-1"
  }
}
```

---

### 2. Project Endpoints

#### `GET /api/v1/projects`
List all engineering projects with dynamic progress and task totals.
- **Query Parameters (Optional)**:
  - `category` (string): `Frontend`, `Backend`, `Fullstack`, `DevOps`, `Mobile`, `AI / ML`
  - `status` (string): `on_track`, `at_risk`, `delayed`, `completed`
  - `search` (string): Search query across project name, description, and tech stack tags.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "id": "proj-1",
      "name": "Core Engine API",
      "description": "High-throughput microservice backend handling real-time developer telemetry and Git sync.",
      "category": "Backend",
      "color": "#6366f1",
      "status": "on_track",
      "progress": 75,
      "totalTasks": 4,
      "completedTasks": 3,
      "leadId": "usr-1",
      "lead": {
        "id": "usr-1",
        "name": "Alex Rivera",
        "role": "Principal Architect"
      },
      "repoUrl": "https://github.com/devtrack/core-engine-api",
      "techStack": ["Node.js", "Express", "Redis", "PostgreSQL", "Docker"],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-02-28T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

---

#### `GET /api/v1/projects/:id`
Retrieve single project by ID with hydrated lead details and task stats.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Project retrieved successfully",
  "data": {
    "id": "proj-1",
    "name": "Core Engine API",
    "category": "Backend",
    "progress": 75,
    "totalTasks": 4,
    "completedTasks": 3,
    "lead": {
      "id": "usr-1",
      "name": "Alex Rivera",
      "email": "alex.rivera@devtrack.io"
    }
  }
}
```

---

#### `GET /api/v1/projects/:id/tasks`
Retrieve all tasks assigned to a specific project.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Tasks for project 'Core Engine API' retrieved successfully",
  "data": [
    {
      "id": "tsk-1",
      "title": "Implement OAuth 2.0 and JWT token rotation",
      "status": "in-progress",
      "priority": "urgent",
      "projectId": "proj-1",
      "assigneeId": "usr-1"
    }
  ],
  "meta": {
    "projectId": "proj-1",
    "totalTasks": 1
  }
}
```

---

#### `POST /api/v1/projects`
Create a new project.

**Request Body**:
```json
{
  "name": "Mobile Companion App",
  "description": "Cross-platform mobile application for developer telemetry and alert push notifications.",
  "category": "Mobile",
  "color": "#ec4899",
  "status": "on_track",
  "leadId": "usr-2",
  "repoUrl": "https://github.com/devtrack/mobile-companion",
  "techStack": ["React Native", "Expo", "TypeScript", "Redux Toolkit"]
}
```

**Response `201 Created`**:
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "proj-9c417f2a",
    "name": "Mobile Companion App",
    "category": "Mobile",
    "color": "#ec4899",
    "status": "on_track",
    "progress": 0,
    "totalTasks": 0,
    "completedTasks": 0,
    "leadId": "usr-2",
    "lead": {
      "id": "usr-2",
      "name": "Sarah Chen"
    },
    "techStack": ["React Native", "Expo", "TypeScript", "Redux Toolkit"],
    "createdAt": "2025-03-01T12:30:00.000Z",
    "updatedAt": "2025-03-01T12:30:00.000Z"
  }
}
```

---

#### `PUT /api/v1/projects/:id`
Update an existing project.

**Request Body**:
```json
{
  "status": "completed",
  "color": "#10b981"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": "proj-1",
    "name": "Core Engine API",
    "status": "completed",
    "color": "#10b981",
    "updatedAt": "2025-03-01T12:45:00.000Z"
  }
}
```

---

#### `DELETE /api/v1/projects/:id`
Delete a project and cascade-delete all associated tasks.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Project and associated tasks deleted successfully",
  "data": {
    "id": "proj-1"
  }
}
```

---

### 3. Task Management & Status Endpoints

#### `GET /api/v1/tasks`
List sprint tasks with optional multi-attribute filtering.
- **Query Parameters (Optional)**:
  - `projectId` (string): Filter by project ID.
  - `assigneeId` (string): Filter by assigned user ID.
  - `status` (string): Filter by status (`todo`, `in-progress`, `done`).
  - `priority` (string): Filter by priority (`low`, `medium`, `high`, `urgent`).
  - `search` (string): Search text across title, description, and tags.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "tsk-1",
      "title": "Implement OAuth 2.0 and JWT token rotation",
      "description": "Set up stateless auth tokens with refresh cycle and redis-backed revocation blocklist.",
      "status": "in-progress",
      "priority": "urgent",
      "projectId": "proj-1",
      "assigneeId": "usr-1",
      "dueDate": "2025-03-05",
      "tags": ["Auth", "Security", "Backend"],
      "estimatedHours": 12,
      "loggedHours": 8,
      "branchName": "feature/jwt-rotation",
      "commitSha": "a8f3b2c",
      "assignee": {
        "id": "usr-1",
        "name": "Alex Rivera",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "role": "Principal Architect"
      },
      "project": {
        "id": "proj-1",
        "name": "Core Engine API",
        "color": "#6366f1",
        "category": "Backend"
      },
      "createdAt": "2025-02-20T09:00:00.000Z",
      "updatedAt": "2025-02-27T11:30:00.000Z"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

---

#### `GET /api/v1/tasks/:id`
Retrieve single task by ID.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "id": "tsk-1",
    "title": "Implement OAuth 2.0 and JWT token rotation",
    "status": "in-progress",
    "priority": "urgent",
    "projectId": "proj-1",
    "assignee": {
      "id": "usr-1",
      "name": "Alex Rivera"
    }
  }
}
```

---

#### `POST /api/v1/tasks`
Create a new sprint task.

**Request Body**:
```json
{
  "title": "Add OpenTelemetry tracing exporter",
  "description": "Instrument Express middleware with Jaeger and OpenTelemetry distributed tracing spans.",
  "status": "todo",
  "priority": "high",
  "projectId": "proj-1",
  "assigneeId": "usr-3",
  "dueDate": "2025-03-15",
  "tags": ["Telemetry", "Observability", "Tracing"],
  "estimatedHours": 8,
  "branchName": "feature/otel-exporter"
}
```

**Response `201 Created`**:
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "tsk-e17f39b2",
    "title": "Add OpenTelemetry tracing exporter",
    "description": "Instrument Express middleware with Jaeger and OpenTelemetry distributed tracing spans.",
    "status": "todo",
    "priority": "high",
    "projectId": "proj-1",
    "assigneeId": "usr-3",
    "dueDate": "2025-03-15",
    "tags": ["Telemetry", "Observability", "Tracing"],
    "estimatedHours": 8,
    "loggedHours": 0,
    "branchName": "feature/otel-exporter",
    "commitSha": "",
    "assignee": {
      "id": "usr-3",
      "name": "Elena Rostova",
      "role": "Lead DevOps & Cloud Engineer"
    },
    "project": {
      "id": "proj-1",
      "name": "Core Engine API",
      "color": "#6366f1",
      "category": "Backend"
    },
    "createdAt": "2025-03-01T13:00:00.000Z",
    "updatedAt": "2025-03-01T13:00:00.000Z"
  }
}
```

---

#### `PATCH /api/v1/tasks/:id/status`
Dedicated endpoint to advance or update task status (`todo` / `in-progress` / `done`).

**Request Body**:
```json
{
  "status": "done"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Task status successfully updated to 'done'",
  "data": {
    "id": "tsk-1",
    "title": "Implement OAuth 2.0 and JWT token rotation",
    "status": "done",
    "updatedAt": "2025-03-01T13:10:00.000Z"
  }
}
```

**Invalid Status Response `400 Bad Request`**:
```json
{
  "success": false,
  "status": "fail",
  "message": "Validation failed",
  "errors": [
    {
      "field": "status",
      "message": "Status must be one of: 'todo', 'in-progress', or 'done'",
      "code": "invalid_enum_value"
    }
  ]
}
```

---

#### `PUT /api/v1/tasks/:id`
Update task attributes.

**Request Body**:
```json
{
  "loggedHours": 10,
  "commitSha": "f4b8c91",
  "priority": "urgent"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "tsk-1",
    "loggedHours": 10,
    "commitSha": "f4b8c91",
    "priority": "urgent",
    "updatedAt": "2025-03-01T13:15:00.000Z"
  }
}
```

---

#### `DELETE /api/v1/tasks/:id`
Delete a task.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": "tsk-1"
  }
}
```

---

## 🛡️ Error Handling Architecture

The API implements centralized error handling returning a consistent, structured JSON contract:

### Standard Error Format:
```json
{
  "success": false,
  "status": "fail",
  "message": "Human-readable description of error",
  "errors": [
    {
      "field": "fieldName",
      "message": "Detailed description of validation constraint violation",
      "code": "error_code"
    }
  ],
  "stack": "Error stack trace (only included when NODE_ENV !== 'production')"
}
```

### HTTP Status Code Usage:
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `204 No Content`: Successful deletion or action with no content returned.
- `400 Bad Request`: Validation failure or bad input parameters.
- `404 Not Found`: Target resource / endpoint does not exist.
- `409 Conflict`: Duplicate unique key (e.g. user email collision).
- `500 Internal Server Error`: Unexpected server or runtime errors.

---

## 💡 Example cURL Requests

### Create a User:
```bash
curl -X POST http://localhost:5000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Devin Torres", "email": "devin.torres@devtrack.io", "role": "Systems Engineer"}'
```

### Create a Task:
```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Set up CI/CD pipeline", "projectId": "proj-1", "priority": "high", "status": "todo"}'
```

### Update Task Status:
```bash
curl -X PATCH http://localhost:5000/api/v1/tasks/tsk-1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```

---

## 🤖 AI-Assisted Task Generation

### `POST /api/v1/ai/generate-tasks`

Leverages the **Google Gemini API** to analyze a project goal or feature description and generate **4 to 6 structured, actionable sprint tasks** for engineering teams.

#### Prerequisites
Set `GEMINI_API_KEY` in `backend/.env`:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
```
Get a free API key at: https://aistudio.google.com/apikey

#### Request Body
| Field | Type | Required | Description |
|:--- |:--- |:--- |:--- |
| `goal` | `string` (3–1000 chars) | Yes* | Project goal or feature description |
| `prompt` | `string` (3–1000 chars) | Yes* | Alternative field alias for `goal` |
| `description` | `string` (3–1000 chars) | Yes* | Alternative field alias for `goal` |
| `topic` | `string` (3–1000 chars) | Yes* | Alternative field alias for `goal` |
| `projectName` | `string` | No | Optional project context to improve suggestion quality |

> **\* At least one of `goal`, `prompt`, `description`, or `topic` must be provided.**

#### Success Response — `200 OK`
```json
{
  "success": true,
  "message": "Suggested tasks generated successfully",
  "data": [
    {
      "title": "Implement JWT Token Issuance & Refresh Endpoint",
      "description": "Set up /auth/token and /auth/refresh routes using jsonwebtoken. Implement RS256 signing, access token expiry of 15m, and refresh token rotation stored in Redis with 7d TTL.",
      "priority": "high",
      "estimatedHours": 6,
      "tags": ["Backend", "Auth", "Security"]
    },
    {
      "title": "Configure Google OAuth2 Provider Integration",
      "description": "Integrate passport-google-oauth20 strategy. Handle callback URL registration in Google Cloud Console, map OAuth profile to internal User model, and return JWT on success.",
      "priority": "high",
      "estimatedHours": 5,
      "tags": ["Backend", "OAuth", "Auth"]
    }
  ],
  "meta": {
    "count": 5,
    "goal": "Build a user authentication system with JWT and Google OAuth"
  }
}
```

#### Task Object Schema
| Field | Type | Values |
|:--- |:--- |:--- |
| `title` | `string` | Concise, action-oriented engineering task title |
| `description` | `string` | Technical summary with acceptance criteria |
| `priority` | `string` | `"urgent"` \| `"high"` \| `"medium"` \| `"low"` |
| `estimatedHours` | `number` | Realistic hours estimate (2–16h typical range) |
| `tags` | `string[]` | 1–3 relevant technical tags |

#### Error Responses
| Status | Scenario | Response Message |
|:--- |:--- |:--- |
| `400 Bad Request` | Missing or too-short `goal` | `"Please provide a project goal or description"` |
| `400 Bad Request` | Missing API key in `.env` | `"Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env"` |
| `401 Unauthorized` | API key invalid or expired | `"Google Gemini API Key is invalid or expired."` |
| `429 Too Many Requests` | Rate limit or quota exceeded | `"Google Gemini rate limit or quota exceeded. Please try again in a few moments."` |
| `500 Internal Server Error` | Gemini failure / unparseable response | `"Failed to generate tasks using Google Gemini: <reason>"` |

#### Example cURL
```bash
curl -X POST http://localhost:5000/api/v1/ai/generate-tasks \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Build a user authentication system with JWT and Google OAuth",
    "projectName": "DevTrack Core API"
  }'
```

#### Model Strategy
The endpoint tries these Gemini models in order (with automatic fallback):
1. `gemini-1.5-flash` (primary — fastest & most cost-efficient)
2. `gemini-2.0-flash` (fallback)
3. `gemini-1.5-pro` (fallback — most capable)
4. `gemini-pro` (legacy fallback)

---

## 🔮 Future Roadmap (Database Migration Ready)
The `src/store/dataStore.js` repository pattern uses async/await abstractions. Migrating to **Prisma / PostgreSQL / MongoDB** in subsequent milestones will simply involve swapping the in-memory array operations inside `dataStore.js` with ORM database queries without modifying any controllers or routing layers!
