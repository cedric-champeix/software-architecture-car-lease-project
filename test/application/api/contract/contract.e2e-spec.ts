import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContractModel } from 'src/infrastructure/persistence/mongoose/schemas/contract.schema';
import { ClientModel } from 'src/infrastructure/persistence/mongoose/schemas/client.schema';
import { VehicleModel } from 'src/infrastructure/persistence/mongoose/schemas/vehicle.schema';
import { FuelType, VehicleStatus } from 'src/domain/entities/vehicle.entity';

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
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-01-01'),
      driverLicenseNumber: '12345',
      address: '123 Main St',
      email: 'john.doe.contract@example.com',
    });

    const vehicle = await vehicleModel.create({
      make: 'Toyota',
      model: 'Corolla',
      fuelType: FuelType.PETROL,
      vehicleStatus: VehicleStatus.AVAILABLE,
      licensePlate: 'AB-123-CD',
      vin: '123456789',
      year: 2020,
      mileage: 10000,
      dailyRate: 50,
      color: 'Black',
      acquiredDate: new Date(),
    });

    return request(app.getHttpServer())
      .post('/contracts')
      .send({
        clientId: client.id,
        vehicleId: vehicle.id,
        startDate: '2025-11-10',
        endDate: '2025-12-10',
      })
      .expect(201);
  });
});
