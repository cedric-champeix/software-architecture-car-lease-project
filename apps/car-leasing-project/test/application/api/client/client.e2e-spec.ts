import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Model } from 'mongoose';
import { AppModule } from 'src/app.module';
import { ClientModel } from 'src/infrastructure/persistence/mongoose/schemas/client.schema';
import request from 'supertest';
import type { App } from 'supertest/types';

import type { Client } from '/domain/entities/client.entity';

describe('ClientController (e2e)', () => {
  let app: INestApplication;
  let clientModel: Model<ClientModel>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    clientModel = moduleFixture.get<Model<ClientModel>>(
      getModelToken(ClientModel.name),
    );
  });

  afterEach(async () => {
    await clientModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('/clients (POST)', async () => {
    const response = await request(app.getHttpServer() as App)
      .post('/clients')
      .send({
        address: '123 Main St',
        birthDate: '1990-01-01',
        driverLicenseNumber: '54321-post',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

    expect(response.status).toBe(201);
  });

  it('/clients (GET)', async () => {
    const client = await clientModel.create({
      address: '123 Main St',
      birthDate: new Date('1990-01-01'),
      driverLicenseNumber: '12345-get',
      firstName: 'John',
      lastName: 'Doe',
    });

    const response = await request(app.getHttpServer() as App).get('/clients');

    const clients = response.body as Client[];

    expect(response.status).toBe(200);

    expect(clients[0].id).toBe(client._id.toString());
  });
});
