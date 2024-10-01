import request from 'supertest';
import express, { Express } from 'express';
import donorRouter from '../routes/donorRoutes';

const app: Express = express();
app.use(express.json());
app.use('/donors', donorRouter);

describe('Donor API', () => {
  it('should create a new donor', async () => {
    const newDonor = {
      // name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      contact: 3149998999,
      addressLine1: 'Downtown, St. Louis',
      state: 'Missouri',
      city: 'St. Louis',
      zipcode: '63108',
      emailOptIn: false,
    };

    const response = await request(app)
      .post('/donors')
      .send(newDonor)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John Doe');
  });

  it('should get all donors', async () => {
    await request(app)
      .get('/donors')
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
