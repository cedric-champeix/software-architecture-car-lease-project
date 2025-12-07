import { FuelType, MotorizationType } from '@lib/domain/entities/vehicle/enum';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import { VEHICLE_FIXTURE } from '@lib/domain/test/fixtures/vehicle/vehicle.fixture';

import type { CreateVehicleUseCaseInput } from '.';
import { CreateVehicleUseCaseValidator } from '.';

describe('CreateVehicleUseCaseValidator', () => {
  let createVehicleUseCaseValidator: CreateVehicleUseCaseValidator;
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    vehicleRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      update: jest.fn(),
    };
    createVehicleUseCaseValidator = new CreateVehicleUseCaseValidator(
      vehicleRepository,
    );
  });

  it('should throw an error if vehicle with this license plate already exists', async () => {
    const vehicleData: CreateVehicleUseCaseInput = {
      acquiredDate: new Date(),
      color: 'blue',
      fuelType: FuelType.PETROL,
      licensePlate: VEHICLE_FIXTURE.licensePlate,
      make: 'Toyota',
      model: 'Corolla',
      motorizationType: MotorizationType.INTERNAL_COMBUSTION,
    };

    (vehicleRepository.findByLicensePlate as jest.Mock).mockResolvedValue(
      VEHICLE_FIXTURE,
    );

    await expect(
      createVehicleUseCaseValidator.execute(vehicleData),
    ).rejects.toThrow(
      `A vehicle with license plate "${vehicleData.licensePlate}" already exists`,
    );
  });
});
