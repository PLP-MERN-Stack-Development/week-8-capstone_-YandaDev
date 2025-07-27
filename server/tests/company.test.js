import request from 'supertest';
import app from '../index.js';

describe('Company API', () => {
  it('should not register a company without authentication', async () => {
    const res = await request(app)
      .post('/api/v1/company/register')
      .send({ name: 'Test Company' });
    expect(res.statusCode).toBe(401);
  });

  // Add more tests for authenticated company registration, update, etc.
});
