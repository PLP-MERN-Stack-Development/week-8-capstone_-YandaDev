import request from 'supertest';
import app from '../index.js';

describe('Chatbot API', () => {
  it('should return a response for a valid chatbot prompt', async () => {
    const res = await request(app)
      .post('/api/v1/chatbot/ask')
      .send({ prompt: 'How do I write a resume?' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('response');
  });

  it('should return 400 for missing prompt', async () => {
    const res = await request(app)
      .post('/api/v1/chatbot/ask')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
