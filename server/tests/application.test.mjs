const request = require('supertest');
const app = require('../index.js');

describe('Application API', () => {
  let token;
  let jobId;
  let companyId;

  beforeAll(async () => {
    // Register and login a user to get a token
    await request(app)
      .post('/api/v1/user/signup')
      .field('fullname', 'Applicant User')
      .field('email', 'applicant@example.com')
      .field('password', 'ApplicantPass123')
      .field('role', 'jobseeker')
      .field('phoneNumber', '1234567890');
    const loginRes = await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'applicant@example.com', password: 'ApplicantPass123', role: 'jobseeker' });
    token = loginRes.body.token;

    // Register a company
    const companyRes = await request(app)
      .post('/api/v1/company/register')
      .set('Cookie', loginRes.headers['set-cookie'])
      .send({ name: 'Test Company', description: 'A test company', website: 'http://test.com', location: 'Test City' });
    companyId = companyRes.body.company?._id;

    // Post a job
    const jobRes = await request(app)
      .post('/api/v1/job/post')
      .set('Cookie', loginRes.headers['set-cookie'])
      .send({
        title: 'Test Job',
        description: 'A test job',
        requirements: ['Skill1', 'Skill2'],
        salary: 1000,
        workArrangement: 'Remote',
        experienceLevel: 'Junior',
        location: 'Test City',
        position: 1,
        companyId: companyId
      });
    jobId = jobRes.body.job?._id;
  });

  it('should apply to a job', async () => {
    const res = await request(app)
      .post('/api/v1/application/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({ jobId });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
  });

  it('should not apply to a job without authentication', async () => {
    const res = await request(app)
      .post('/api/v1/application/apply')
      .send({ jobId });
    expect(res.statusCode).toBe(401);
  });

  it('should get all applications for the user', async () => {
    const res = await request(app)
      .get('/api/v1/application/get')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.applications)).toBe(true);
  });
});
