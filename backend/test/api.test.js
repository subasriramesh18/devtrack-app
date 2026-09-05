const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const Task = require('../src/models/Task');

describe('Users, Projects & Tasks REST API Test Suite (MongoDB & Mongoose)', () => {
  let seededUsers = [];
  let seededProjects = [];
  let seededTasks = [];

  before(async () => {
    await connectDB();
  });

  after(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    // Seed test users
    seededUsers = await User.insertMany([
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@devtrack.io',
        handle: 'arivera',
        role: 'Principal Architect',
        company: 'DevTrack Labs',
      },
      {
        name: 'Sarah Chen',
        email: 'sarah.chen@devtrack.io',
        handle: 'schen',
        role: 'Staff Frontend Engineer',
        company: 'DevTrack Labs',
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@devtrack.io',
        handle: 'erostova',
        role: 'Lead DevOps & Cloud Engineer',
        company: 'DevTrack Labs',
      },
      {
        name: 'Marcus Brody',
        email: 'marcus.brody@devtrack.io',
        handle: 'mbrody',
        role: 'Senior Backend Engineer',
        company: 'DevTrack Labs',
      },
    ]);

    // Seed test projects
    seededProjects = await Project.insertMany([
      {
        name: 'Core Engine API',
        description: 'High-throughput microservice backend handling real-time telemetry.',
        category: 'Backend',
        color: '#6366f1',
        status: 'on_track',
        owner: seededUsers[0]._id,
        techStack: ['Node.js', 'Express', 'Redis', 'PostgreSQL'],
      },
      {
        name: 'DevTrack UI System',
        description: 'Modern component library and design system.',
        category: 'Frontend',
        color: '#06b6d4',
        status: 'on_track',
        owner: seededUsers[1]._id,
        techStack: ['React', 'Next.js', 'Tailwind CSS'],
      },
      {
        name: 'Telemetry Pipeline',
        description: 'Streaming worker for processing webhook payloads.',
        category: 'DevOps',
        color: '#10b981',
        status: 'at_risk',
        owner: seededUsers[2]._id,
        techStack: ['Go', 'Kafka', 'Kubernetes'],
      },
    ]);

    // Seed test tasks
    seededTasks = await Task.insertMany([
      {
        title: 'Implement OAuth 2.0 and JWT token rotation',
        description: 'Set up stateless auth tokens with refresh cycle.',
        status: 'in-progress',
        priority: 'urgent',
        project: seededProjects[0]._id,
        assignee: seededUsers[0]._id,
        dueDate: '2025-03-05',
        tags: ['Auth', 'Security', 'Backend'],
        estimatedHours: 12,
        loggedHours: 8,
      },
      {
        title: 'Build Dark Mode glassmorphic tokens in Tailwind',
        description: 'Refactor color tokens to support dynamic HSL tint shifting.',
        status: 'done',
        priority: 'high',
        project: seededProjects[1]._id,
        assignee: seededUsers[1]._id,
        dueDate: '2025-02-28',
        tags: ['UI', 'CSS', 'Design'],
        estimatedHours: 6,
        loggedHours: 6,
      },
      {
        title: 'Set up Prometheus scraping for GitHub Webhook latency',
        description: 'Create metrics middleware recording response times.',
        status: 'todo',
        priority: 'medium',
        project: seededProjects[2]._id,
        assignee: seededUsers[2]._id,
        dueDate: '2025-03-10',
        tags: ['Metrics', 'DevOps'],
        estimatedHours: 8,
        loggedHours: 0,
      },
    ]);
  });

  // ==========================================
  // SYSTEM & HEALTH ENDPOINTS
  // ==========================================
  describe('System Endpoints', () => {
    it('GET / should return API overview information', async () => {
      const res = await request(app).get('/');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.name, 'Users, Projects & Tasks API');
    });

    it('GET /health should return 200 healthy status', async () => {
      const res = await request(app).get('/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, 'healthy');
      assert.ok(res.body.uptime);
    });

    it('GET /non-existent-route should return 404 Not Found error', async () => {
      const res = await request(app).get('/api/v1/invalid-route-path');
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('Endpoint not found'));
    });
  });

  // ==========================================
  // USER MANAGEMENT ENDPOINTS
  // ==========================================
  describe('User Management Endpoints (/api/v1/users)', () => {
    it('GET /api/v1/users should list all users', async () => {
      const res = await request(app).get('/api/v1/users');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
      assert.strictEqual(res.body.data.length, 4);
    });

    it('GET /api/v1/users?search=alex should filter users by name regex', async () => {
      const res = await request(app).get('/api/v1/users?search=alex');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.length, 1);
      assert.strictEqual(res.body.data[0].name, 'Alex Rivera');
    });

    it('GET /api/v1/users/:id should return single user by ID', async () => {
      const userId = seededUsers[0]._id.toString();
      const res = await request(app).get(`/api/v1/users/${userId}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.id, userId);
      assert.strictEqual(res.body.data.name, 'Alex Rivera');
    });

    it('GET /api/v1/users/:id should return 404 for non-existent user ObjectId', async () => {
      const nonExistentId = '65d123456789012345678901';
      const res = await request(app).get(`/api/v1/users/${nonExistentId}`);
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.body.success, false);
    });

    it('POST /api/v1/users should create a new user (201)', async () => {
      const payload = {
        name: 'Jordan Lee',
        email: 'jordan.lee@devtrack.io',
        role: 'Fullstack Developer',
        company: 'DevTrack Labs',
      };
      const res = await request(app).post('/api/v1/users').send(payload);
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.name, 'Jordan Lee');
      assert.strictEqual(res.body.data.email, 'jordan.lee@devtrack.io');
      assert.ok(res.body.data.id);
    });

    it('POST /api/v1/users should return 400 Bad Request on invalid email format', async () => {
      const payload = {
        name: 'Invalid User',
        email: 'not-an-email',
      };
      const res = await request(app).post('/api/v1/users').send(payload);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.errors);
    });

    it('POST /api/v1/users should return 409 Conflict if email already exists', async () => {
      const payload = {
        name: 'Alex Duplicate',
        email: 'alex.rivera@devtrack.io',
      };
      const res = await request(app).post('/api/v1/users').send(payload);
      assert.strictEqual(res.status, 409);
      assert.strictEqual(res.body.success, false);
    });

    it('PUT /api/v1/users/:id should update user details (200)', async () => {
      const userId = seededUsers[0]._id.toString();
      const payload = {
        role: 'Chief Technology Officer',
        location: 'San Francisco & Remote',
      };
      const res = await request(app).put(`/api/v1/users/${userId}`).send(payload);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.role, 'Chief Technology Officer');
      assert.strictEqual(res.body.data.location, 'San Francisco & Remote');
    });

    it('DELETE /api/v1/users/:id should remove user and unassign references (200)', async () => {
      const userId = seededUsers[3]._id.toString();
      const res = await request(app).delete(`/api/v1/users/${userId}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);

      const checkRes = await request(app).get(`/api/v1/users/${userId}`);
      assert.strictEqual(checkRes.status, 404);
    });
  });

  // ==========================================
  // PROJECT ENDPOINTS
  // ==========================================
  describe('Project Management Endpoints (/api/v1/projects)', () => {
    it('GET /api/v1/projects should list all projects with task calculations and populated owner', async () => {
      const res = await request(app).get('/api/v1/projects');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data));
      assert.strictEqual(res.body.data.length, 3);
      assert.ok(res.body.data[0].totalTasks !== undefined);
      assert.ok(res.body.data[0].progress !== undefined);
      assert.ok(res.body.data[0].owner !== undefined);
    });

    it('GET /api/v1/projects/:id should return single project with populated owner', async () => {
      const projId = seededProjects[0]._id.toString();
      const res = await request(app).get(`/api/v1/projects/${projId}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.id, projId);
      assert.strictEqual(res.body.data.name, 'Core Engine API');
      assert.strictEqual(res.body.data.owner.name, 'Alex Rivera');
    });

    it('GET /api/v1/projects/:id/tasks should list tasks belonging to project', async () => {
      const projId = seededProjects[0]._id.toString();
      const res = await request(app).get(`/api/v1/projects/${projId}/tasks`);
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data));
      assert.strictEqual(res.body.data.length, 1);
      assert.strictEqual(res.body.data[0].title, 'Implement OAuth 2.0 and JWT token rotation');
    });

    it('POST /api/v1/projects should create project referencing owner (201)', async () => {
      const payload = {
        name: 'AI Code Reviewer Bot',
        description: 'Automated PR analysis engine using LLM semantic embeddings',
        category: 'AI / ML',
        color: '#8b5cf6',
        status: 'on_track',
        owner: seededUsers[0]._id.toString(),
        techStack: ['Python', 'FastAPI', 'PyTorch', 'Docker'],
      };
      const res = await request(app).post('/api/v1/projects').send(payload);
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.data.name, 'AI Code Reviewer Bot');
      assert.strictEqual(res.body.data.category, 'AI / ML');
      assert.strictEqual(res.body.data.owner.name, 'Alex Rivera');
    });

    it('POST /api/v1/projects should return 400 on invalid category', async () => {
      const payload = {
        name: 'Invalid Project',
        category: 'InvalidCategory',
      };
      const res = await request(app).post('/api/v1/projects').send(payload);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
    });

    it('PUT /api/v1/projects/:id should update project', async () => {
      const projId = seededProjects[0]._id.toString();
      const res = await request(app)
        .put(`/api/v1/projects/${projId}`)
        .send({ status: 'completed' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.status, 'completed');
    });

    it('DELETE /api/v1/projects/:id should delete project and cascade tasks', async () => {
      const projId = seededProjects[2]._id.toString();
      const res = await request(app).delete(`/api/v1/projects/${projId}`);
      assert.strictEqual(res.status, 200);

      // Verify tasks for project 3 were cascade-deleted
      const tasksRes = await request(app).get(`/api/v1/tasks?projectId=${projId}`);
      assert.strictEqual(tasksRes.body.data.length, 0);
    });
  });

  // ==========================================
  // TASK ENDPOINTS & STATUS MANAGEMENT
  // ==========================================
  describe('Task Management Endpoints (/api/v1/tasks)', () => {
    it('GET /api/v1/tasks should list all tasks', async () => {
      const res = await request(app).get('/api/v1/tasks');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data));
      assert.strictEqual(res.body.data.length, 3);
    });

    it('GET /api/v1/tasks?status=in-progress should filter by status', async () => {
      const res = await request(app).get('/api/v1/tasks?status=in-progress');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.length, 1);
      assert.strictEqual(res.body.data[0].status, 'in-progress');
    });

    it('POST /api/v1/tasks should create a task with relational links (201)', async () => {
      const payload = {
        title: 'Implement GraphQL Subscriptions',
        description: 'Real-time WebSocket subscriptions for dashboard live metrics',
        status: 'todo',
        priority: 'high',
        projectId: seededProjects[0]._id.toString(),
        assigneeId: seededUsers[3]._id.toString(),
        estimatedHours: 10,
        tags: ['GraphQL', 'WebSockets', 'Backend'],
      };
      const res = await request(app).post('/api/v1/tasks').send(payload);
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.data.title, 'Implement GraphQL Subscriptions');
      assert.strictEqual(res.body.data.status, 'todo');
      assert.strictEqual(res.body.data.assignee.name, 'Marcus Brody');
      assert.strictEqual(res.body.data.project.name, 'Core Engine API');
    });

    it('POST /api/v1/tasks should return 400 if projectId is non-existent', async () => {
      const payload = {
        title: 'Orphan Task',
        projectId: '65d123456789012345678901',
      };
      const res = await request(app).post('/api/v1/tasks').send(payload);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
    });

    it('PATCH /api/v1/tasks/:id/status should update task status to "in-progress" (200)', async () => {
      const taskId = seededTasks[2]._id.toString();
      const res = await request(app)
        .patch(`/api/v1/tasks/${taskId}/status`)
        .send({ status: 'in-progress' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.status, 'in-progress');
    });

    it('PATCH /api/v1/tasks/:id/status should update task status to "done" (200)', async () => {
      const taskId = seededTasks[0]._id.toString();
      const res = await request(app)
        .patch(`/api/v1/tasks/${taskId}/status`)
        .send({ status: 'done' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.status, 'done');
    });

    it('PATCH /api/v1/tasks/:id/status should return 400 on invalid status', async () => {
      const taskId = seededTasks[0]._id.toString();
      const res = await request(app)
        .patch(`/api/v1/tasks/${taskId}/status`)
        .send({ status: 'invalid_status_value' });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.errors);
    });

    it('PUT /api/v1/tasks/:id should update task details', async () => {
      const taskId = seededTasks[0]._id.toString();
      const payload = {
        loggedHours: 12,
        commitSha: 'c3f4e5d',
      };
      const res = await request(app).put(`/api/v1/tasks/${taskId}`).send(payload);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.loggedHours, 12);
      assert.strictEqual(res.body.data.commitSha, 'c3f4e5d');
    });

    it('DELETE /api/v1/tasks/:id should remove task (200)', async () => {
      const taskId = seededTasks[2]._id.toString();
      const res = await request(app).delete(`/api/v1/tasks/${taskId}`);
      assert.strictEqual(res.status, 200);

      const checkRes = await request(app).get(`/api/v1/tasks/${taskId}`);
      assert.strictEqual(checkRes.status, 404);
    });
  });
});
