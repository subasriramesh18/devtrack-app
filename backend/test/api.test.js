const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const dataStore = require('../src/store/dataStore');

describe('Users, Projects & Tasks REST API Test Suite', () => {
  beforeEach(() => {
    // Reset store before each test to guarantee test isolation
    dataStore.reset();
  });

  // ==========================================
  // HEALTH & ROOT ENDPOINTS
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
  // USER ENDPOINTS
  // ==========================================
  describe('User Management Endpoints (/api/v1/users)', () => {
    it('GET /api/v1/users should list all users', async () => {
      const res = await request(app).get('/api/v1/users');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
      assert.strictEqual(res.body.data.length >= 4, true);
    });

    it('GET /api/v1/users?search=alex should filter users', async () => {
      const res = await request(app).get('/api/v1/users?search=alex');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.length, 1);
      assert.strictEqual(res.body.data[0].name, 'Alex Rivera');
    });

    it('GET /api/v1/users/:id should return single user by ID', async () => {
      const res = await request(app).get('/api/v1/users/usr-1');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.id, 'usr-1');
      assert.strictEqual(res.body.data.name, 'Alex Rivera');
    });

    it('GET /api/v1/users/:id should return 404 for non-existent user', async () => {
      const res = await request(app).get('/api/v1/users/usr-999');
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

    it('POST /api/v1/users should return 400 Bad Request on invalid email', async () => {
      const payload = {
        name: 'Invalid Email User',
        email: 'not-an-email',
      };
      const res = await request(app).post('/api/v1/users').send(payload);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.errors);
      assert.strictEqual(res.body.errors[0].field, 'email');
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
      const payload = {
        role: 'Chief Technology Officer',
        location: 'San Francisco & Remote',
      };
      const res = await request(app).put('/api/v1/users/usr-1').send(payload);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.role, 'Chief Technology Officer');
      assert.strictEqual(res.body.data.location, 'San Francisco & Remote');
    });

    it('DELETE /api/v1/users/:id should remove user (200)', async () => {
      const res = await request(app).delete('/api/v1/users/usr-4');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);

      // Verify user is gone
      const verifyRes = await request(app).get('/api/v1/users/usr-4');
      assert.strictEqual(verifyRes.status, 404);
    });
  });

  // ==========================================
  // PROJECT ENDPOINTS
  // ==========================================
  describe('Project Management Endpoints (/api/v1/projects)', () => {
    it('GET /api/v1/projects should list all projects with task calculations', async () => {
      const res = await request(app).get('/api/v1/projects');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data));
      assert.strictEqual(res.body.data.length >= 3, true);
      assert.ok(res.body.data[0].totalTasks !== undefined);
      assert.ok(res.body.data[0].lead !== undefined);
    });

    it('GET /api/v1/projects/:id should return single project with hydrated lead', async () => {
      const res = await request(app).get('/api/v1/projects/proj-1');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.id, 'proj-1');
      assert.strictEqual(res.body.data.name, 'Core Engine API');
      assert.strictEqual(res.body.data.lead.name, 'Alex Rivera');
    });

    it('GET /api/v1/projects/:id/tasks should list tasks belonging to project', async () => {
      const res = await request(app).get('/api/v1/projects/proj-1/tasks');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data));
      assert.ok(res.body.data.every((t) => t.projectId === 'proj-1'));
    });

    it('POST /api/v1/projects should create project (201)', async () => {
      const payload = {
        name: 'AI Code Reviewer Bot',
        description: 'Automated PR analysis engine using LLM semantic embeddings',
        category: 'AI / ML',
        color: '#8b5cf6',
        status: 'on_track',
        leadId: 'usr-1',
        techStack: ['Python', 'FastAPI', 'PyTorch', 'Docker'],
      };
      const res = await request(app).post('/api/v1/projects').send(payload);
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.data.name, 'AI Code Reviewer Bot');
      assert.strictEqual(res.body.data.category, 'AI / ML');
      assert.strictEqual(res.body.data.lead.id, 'usr-1');
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
      const res = await request(app)
        .put('/api/v1/projects/proj-1')
        .send({ status: 'completed' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.status, 'completed');
    });

    it('DELETE /api/v1/projects/:id should delete project and cascade tasks', async () => {
      const res = await request(app).delete('/api/v1/projects/proj-3');
      assert.strictEqual(res.status, 200);

      // Verify tasks for project 3 were deleted
      const tasksRes = await request(app).get('/api/v1/tasks?projectId=proj-3');
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
      assert.strictEqual(res.body.data.length >= 5, true);
    });

    it('GET /api/v1/tasks?status=in-progress should filter by status', async () => {
      const res = await request(app).get('/api/v1/tasks?status=in-progress');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.data.length > 0);
      assert.ok(res.body.data.every((t) => t.status === 'in-progress'));
    });

    it('POST /api/v1/tasks should create a task (201)', async () => {
      const payload = {
        title: 'Implement GraphQL Subscriptions',
        description: 'Real-time WebSocket subscriptions for dashboard live metrics',
        status: 'todo',
        priority: 'high',
        projectId: 'proj-1',
        assigneeId: 'usr-4',
        estimatedHours: 10,
        tags: ['GraphQL', 'WebSockets', 'Backend'],
      };
      const res = await request(app).post('/api/v1/tasks').send(payload);
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.data.title, 'Implement GraphQL Subscriptions');
      assert.strictEqual(res.body.data.status, 'todo');
      assert.strictEqual(res.body.data.assignee.id, 'usr-4');
      assert.strictEqual(res.body.data.project.id, 'proj-1');
    });

    it('POST /api/v1/tasks should return 400 if projectId is non-existent', async () => {
      const payload = {
        title: 'Orphan Task',
        projectId: 'non-existent-proj-id',
      };
      const res = await request(app).post('/api/v1/tasks').send(payload);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
    });

    it('PATCH /api/v1/tasks/:id/status should update task status to "in-progress" (200)', async () => {
      const res = await request(app)
        .patch('/api/v1/tasks/tsk-3/status')
        .send({ status: 'in-progress' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.status, 'in-progress');
    });

    it('PATCH /api/v1/tasks/:id/status should update task status to "done" (200)', async () => {
      const res = await request(app)
        .patch('/api/v1/tasks/tsk-1/status')
        .send({ status: 'done' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.status, 'done');
    });

    it('PATCH /api/v1/tasks/:id/status should return 400 on invalid status', async () => {
      const res = await request(app)
        .patch('/api/v1/tasks/tsk-1/status')
        .send({ status: 'invalid_status_value' });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.errors);
    });

    it('PUT /api/v1/tasks/:id should update task details', async () => {
      const payload = {
        loggedHours: 12,
        commitSha: 'c3f4e5d',
      };
      const res = await request(app).put('/api/v1/tasks/tsk-1').send(payload);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.loggedHours, 12);
      assert.strictEqual(res.body.data.commitSha, 'c3f4e5d');
    });

    it('DELETE /api/v1/tasks/:id should remove task (200)', async () => {
      const res = await request(app).delete('/api/v1/tasks/tsk-5');
      assert.strictEqual(res.status, 200);

      const checkRes = await request(app).get('/api/v1/tasks/tsk-5');
      assert.strictEqual(checkRes.status, 404);
    });
  });
});
