const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const Project = require('../src/models/Project');
const Task = require('../src/models/Task');
const User = require('../src/models/User');

describe('AI Assisted Task Generation Suite', () => {
  let testProject;
  let testUser;

  before(async () => {
    await connectDB();

    testUser = await User.create({
      name: 'AI Test Engineer',
      email: `aitest_${Date.now()}@example.com`,
      role: 'Fullstack Developer',
    });

    testProject = await Project.create({
      name: `AI Test Project ${Date.now()}`,
      description: 'Project for testing AI generated tasks',
      category: 'Backend',
      status: 'on_track',
      lead: testUser._id,
    });
  });

  after(async () => {
    if (testProject?._id) {
      await Task.deleteMany({ project: testProject._id });
      await Project.deleteOne({ _id: testProject._id });
    }
    if (testUser?._id) {
      await User.deleteOne({ _id: testUser._id });
    }
    await disconnectDB();
  });

  it('POST /api/v1/ai/generate-tasks should return 400 if goal/prompt is missing or empty', async () => {
    const res = await request(app)
      .post('/api/v1/ai/generate-tasks')
      .send({});

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('POST /api/v1/ai/generate-tasks should return 400 if goal is too short (< 3 characters)', async () => {
    const res = await request(app)
      .post('/api/v1/ai/generate-tasks')
      .send({ goal: 'ab' });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('POST /api/v1/ai/generate-tasks should generate 4-6 structured tasks for a project goal', async () => {
    const res = await request(app)
      .post('/api/v1/ai/generate-tasks')
      .send({
        goal: 'Build a user authentication system with JWT and Google OAuth',
        projectName: testProject.name,
      });

    // Check status
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data), 'data should be an array of suggested tasks');
    assert.ok(res.body.data.length >= 4 && res.body.data.length <= 6, `Expected 4-6 tasks, got ${res.body.data.length}`);

    const firstTask = res.body.data[0];
    assert.ok(firstTask.title && typeof firstTask.title === 'string');
    assert.ok(firstTask.description && typeof firstTask.description === 'string');
    assert.ok(['low', 'medium', 'high', 'urgent'].includes(firstTask.priority));
    assert.ok(typeof firstTask.estimatedHours === 'number' && firstTask.estimatedHours > 0);
    assert.ok(Array.isArray(firstTask.tags));
  });

  it('should allow creating a real MongoDB task from an AI suggestion', async () => {
    // 1. Generate tasks
    const aiRes = await request(app)
      .post('/api/v1/ai/generate-tasks')
      .send({
        goal: 'Implement Stripe checkout subscription workflow',
      });

    assert.strictEqual(aiRes.status, 200);
    const suggestedTask = aiRes.body.data[0];

    // 2. Create the task in MongoDB
    const createRes = await request(app)
      .post('/api/v1/tasks')
      .send({
        title: suggestedTask.title,
        description: suggestedTask.description,
        priority: suggestedTask.priority,
        estimatedHours: suggestedTask.estimatedHours,
        tags: suggestedTask.tags,
        projectId: testProject._id.toString(),
        assigneeId: testUser._id.toString(),
        status: 'todo',
      });

    assert.strictEqual(createRes.status, 201);
    assert.strictEqual(createRes.body.success, true);
    assert.strictEqual(createRes.body.data.title, suggestedTask.title);
    assert.strictEqual(createRes.body.data.projectId, testProject._id.toString());

    // 3. Verify task exists in MongoDB
    const foundTask = await Task.findById(createRes.body.data.id);
    assert.ok(foundTask);
    assert.strictEqual(foundTask.title, suggestedTask.title);
  });
});
