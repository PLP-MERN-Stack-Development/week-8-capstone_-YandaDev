const request = require('supertest');
const app = require('../index.js');

describe('User API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/user/signup')
      .field('fullname', 'Test User')
      .field('email', 'testuser@example.com')
      .field('password', 'TestPass123')
      .field('role', 'jobseeker')
      .field('phoneNumber', '1234567890');
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
  });

  it('should not register with missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/user/signup')
      .field('fullname', '');
    expect(res.statusCode).toBe(400);
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'testuser@example.com', password: 'TestPass123', role: 'jobseeker' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
