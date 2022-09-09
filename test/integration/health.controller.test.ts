import { NestFastifyApplication } from '@nestjs/platform-fastify';
import appMock, { closeMongoConnection } from '../fixtures/app.mock';

let app: NestFastifyApplication;

describe('HealthController', () => {
  beforeAll(async () => {
    jest.resetAllMocks();
    app = await appMock();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    jest.resetModules();
    closeMongoConnection();
    app.close();
  });

  it('Passes the HealthCheck when MongoDB is up', async () => {
    const response = await app.inject().get('/health');
    expect(response.statusCode).toEqual(200);
  });
});
