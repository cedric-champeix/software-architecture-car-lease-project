import { CreateVehicle } from '@lib/domain/entities/vehicle';
import { VehicleStatus } from '@lib/domain/entities/vehicle/enum';
import { Vehicle } from '@lib/domain/entities/vehicle/vehicle.entity';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import {
  VEHICLE_FIXTURE,
  VEHICLE_FIXTURE_NO_ID,
} from '@lib/domain/test/fixtures/vehicle/vehicle.fixture';

import type { CreateVehicleUseCaseInput } from '.';
import { CreateVehicleUseCase } from '.';

describe('CreateVehicleUseCase', () => {
  let createVehicleUseCase: CreateVehicleUseCase;
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
    createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
  });

  it('should create a new vehicle', async () => {
    const vehicleData: CreateVehicleUseCaseInput = {
      acquiredDate: VEHICLE_FIXTURE.acquiredDate,
      color: VEHICLE_FIXTURE.color,
      fuelType: VEHICLE_FIXTURE.fuelType,
      licensePlate: VEHICLE_FIXTURE.licensePlate,
      make: VEHICLE_FIXTURE.make,
      model: VEHICLE_FIXTURE.model,
      motorizationType: VEHICLE_FIXTURE.motorizationType,
    };

    const vehicle = new Vehicle({
      ...VEHICLE_FIXTURE,
    });

    (vehicleRepository.create as jest.Mock).mockResolvedValue(vehicle);

    const result = await createVehicleUseCase.execute(vehicleData);

    expect(vehicleRepository.create).toHaveBeenCalledWith({
      vehicle: new CreateVehicle({
        ...VEHICLE_FIXTURE_NO_ID,
        status: VehicleStatus.AVAILABLE,
      }),
    });

    expect(result).toEqual(vehicle);
  });
});
