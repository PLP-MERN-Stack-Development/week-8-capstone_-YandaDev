const request = require('supertest');
const app = require('../index.js');

describe('Job API', () => {
  it('should not create a job without authentication', async () => {
    const res = await request(app)
      .post('/api/v1/job/post')
      .send({ title: 'Test Job' });
    expect(res.statusCode).toBe(401);
  });

  // Add more tests for authenticated job creation, fetching, etc.
});
