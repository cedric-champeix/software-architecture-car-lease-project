import {
  FuelType,
  MotorizationType,
  VehicleStatus,
} from '@lib/domain/entities/vehicle/enum';
import { ClientModel } from '@lib/out-mongoose/schemas/client.schema';
import { ContractModel } from '@lib/out-mongoose/schemas/contract.schema';
import { VehicleModel } from '@lib/out-mongoose/schemas/vehicle.schema';
import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Model } from 'mongoose';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '../../../../src/app.module';

describe('ContractController (e2e)', () => {
  let app: INestApplication;
  let contractModel: Model<ContractModel>;
  let clientModel: Model<ClientModel>;
  let vehicleModel: Model<VehicleModel>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    contractModel = moduleFixture.get<Model<ContractModel>>(
      getModelToken(ContractModel.name),
    );
    clientModel = moduleFixture.get<Model<ClientModel>>(
      getModelToken(ClientModel.name),
    );
    vehicleModel = moduleFixture.get<Model<VehicleModel>>(
      getModelToken(VehicleModel.name),
    );
  });

  afterEach(async () => {
    await contractModel.deleteMany({});
    await clientModel.deleteMany({});
    await vehicleModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('/contracts (POST)', async () => {
    const client = await clientModel.create({
      address: '123 Main St',
      birthDate: new Date('1990-01-01'),
      driverLicenseNumber: '12345',
      email: 'john.doe.contract@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '123456789',
    });

    const vehicle = await vehicleModel.create({
      acquiredDate: new Date(),
      color: 'Black',
      dailyRate: 50,
      fuelType: FuelType.PETROL,
      licensePlate: 'AB-123-CD',
      make: 'Toyota',
      mileage: 10000,
      model: 'Corolla',
      motorizationType: MotorizationType.INTERNAL_COMBUSTION,
      vehicleStatus: VehicleStatus.AVAILABLE,
      vin: '123456789',
      year: 2020,
    });

    const response = await request(app.getHttpServer() as App)
      .post('/contracts')
      .send({
        clientId: client._id.toString(),
        endDate: '2025-12-10',
        startDate: '2025-11-10',
        vehicleId: vehicle._id.toString(),
      });

    expect(response.status).toBe(201);
  });
});
