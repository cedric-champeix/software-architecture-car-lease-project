import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Model } from 'mongoose';
import { AppModule } from 'src/app.module';
import type { Vehicle } from 'src/domain/entities/vehicle.entity';
import { FuelType, VehicleStatus } from 'src/domain/entities/vehicle.entity';
import { VehicleModel } from 'src/infrastructure/persistence/mongoose/schemas/vehicle.schema';
import request from 'supertest';
import type { App } from 'supertest/types';

describe('VehicleController (e2e)', () => {
  let app: INestApplication;
  let vehicleModel: Model<VehicleModel>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    vehicleModel = moduleFixture.get<Model<VehicleModel>>(
      getModelToken(VehicleModel.name),
    );
  });

  afterEach(async () => {
    await vehicleModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('/vehicles (POST)', async () => {
    const response = await request(app.getHttpServer() as App)
      .post('/vehicles')
      .send({
        acquiredDate: new Date(),
        color: 'blue',
        fuelType: FuelType.PETROL,
        licensePlate: 'ABC-123',
        make: 'Toyota',
        model: 'Corolla',
      });

    expect(response.status).toBe(201);
  });

  it('/vehicles (GET)', async () => {
    const vehicle = await vehicleModel.create({
      acquiredDate: new Date(),
      color: 'blue',
      fuelType: FuelType.PETROL,
      licensePlate: 'ABC-123',
      make: 'Toyota',
      model: 'Corolla',
      status: VehicleStatus.AVAILABLE,
    });

    const response = await request(app.getHttpServer() as App).get('/vehicles');
    const vehicles = response.body as Vehicle[];

    expect(response.status).toBe(200);

    expect(vehicles[0].id).toBe(vehicle._id.toString());
  });
});
