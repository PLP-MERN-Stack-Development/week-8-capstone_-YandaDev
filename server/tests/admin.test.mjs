const request = require('supertest');
const app = require('../index.js');

describe('Admin API', () => {
  let adminToken;

  beforeAll(async () => {
    // Register and login an admin user
    await request(app)
      .post('/api/v1/user/signup')
      .field('fullname', 'Admin User')
      .field('email', 'admin@example.com')
      .field('password', 'AdminPass123')
      .field('role', 'admin')
      .field('phoneNumber', '1234567890');
    const loginRes = await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'admin@example.com', password: 'AdminPass123', role: 'admin' });
    adminToken = loginRes.body.token;
  });

  it('should get all jobs as admin', async () => {
    const res = await request(app)
      .get('/api/v1/job/getadminjobs')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.jobs)).toBe(true);
  });

  // Add more admin-specific tests as needed
});
