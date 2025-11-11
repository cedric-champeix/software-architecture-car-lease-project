import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientModel } from 'src/infrastructure/persistence/mongoose/schemas/client.schema';

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

  it('/clients (POST)', () => {
    return request(app.getHttpServer())
      .post('/clients')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        driverLicenseNumber: '12345',
        address: '123 Main St',
      })
      .expect(201);
  });

  it('/clients (GET)', async () => {
    const client = await clientModel.create({
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-01-01'),
      driverLicenseNumber: '12345',
      address: '123 Main St',
    });

    return request(app.getHttpServer())
      .get('/clients')
      .expect(200)
      .then((res) => {
        expect(res.body[0].id).toEqual(client.id.toString());
      });
  });
});
