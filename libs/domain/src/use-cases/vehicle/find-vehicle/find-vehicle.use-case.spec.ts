import {
  FuelType,
  MotorizationType,
  VehicleStatus,
} from 'src/entities/vehicle/enum';
import { Vehicle } from 'src/entities/vehicle/vehicle.entity';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

import { FindVehicleUseCase } from '.';
import { VEHICLE_FIXTURE } from 'src/test/fixtures/vehicle/vehicle.fixture';

describe('FindVehicleUseCase', () => {
  let findVehicleUseCase: FindVehicleUseCase;
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
    findVehicleUseCase = new FindVehicleUseCase(vehicleRepository);
  });

  it('should return a vehicle by id', async () => {
    const vehicleId = { id: VEHICLE_FIXTURE.id };

    const vehicle = VEHICLE_FIXTURE;

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);

    const result = await findVehicleUseCase.execute(vehicleId);

    expect(vehicleRepository.findById).toHaveBeenCalledWith(vehicleId);

    expect(result).toEqual(vehicle);
  });
});
