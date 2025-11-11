import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { FuelType, VehicleStatus } from 'src/domain/entities/vehicle.entity';
import { VehicleModel } from 'src/infrastructure/persistence/mongoose/schemas/vehicle.schema';

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

  it('/vehicles (POST)', () => {
    return request(app.getHttpServer())
      .post('/vehicles')
      .send({
        make: 'Toyota',
        model: 'Corolla',
        fuelType: FuelType.PETROL,
        color: 'blue',
        licensePlate: 'ABC-123',
        acquiredDate: new Date(),
      })
      .expect(201);
  });

  it('/vehicles (GET)', async () => {
    const vehicle = await vehicleModel.create({
      make: 'Toyota',
      model: 'Corolla',
      fuelType: FuelType.PETROL,
      color: 'blue',
      licensePlate: 'ABC-123',
      acquiredDate: new Date(),
      status: VehicleStatus.AVAILABLE,
    });

    return request(app.getHttpServer())
      .get('/vehicles')
      .expect(200)
      .then((res) => {
        expect(res.body[0].id).toEqual(vehicle._id.toString());
        expect(res.body[0].make).toEqual('Toyota');
      });
  });
});
