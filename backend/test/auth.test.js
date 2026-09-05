const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const User = require('../src/models/User');

describe('Auth Endpoints Test Suite', () => {
  before(async () => {
    await connectDB();
  });

  after(async () => {
    await User.deleteMany({ email: /test.*@example\.com/ });
    await disconnectDB();
  });

  it('POST /api/v1/auth/register should create a new user and return JWT', async () => {
    const testEmail = `testuser_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test Engineer',
        email: testEmail,
        password: 'password123',
        role: 'Fullstack Developer',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.strictEqual(res.body.data.user.email, testEmail);
    assert.strictEqual(res.body.data.user.password, undefined);
  });

  it('POST /api/v1/auth/login should authenticate valid user', async () => {
    const testEmail = `login_${Date.now()}@example.com`;
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Login User',
        email: testEmail,
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'password123',
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.strictEqual(res.body.data.user.email, testEmail);
  });

  it('POST /api/v1/auth/login should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('GET /api/v1/auth/me should return authenticated user profile', async () => {
    const testEmail = `me_${Date.now()}@example.com`;
    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Me User',
        email: testEmail,
        password: 'password123',
      });

    const token = registerRes.body.data.token;

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.email, testEmail);
  });

  it('GET /api/v1/auth/me should reject request without token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    assert.strictEqual(res.status, 401);
  });
});
