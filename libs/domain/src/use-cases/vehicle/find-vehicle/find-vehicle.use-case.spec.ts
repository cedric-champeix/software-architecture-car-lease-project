import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import { VEHICLE_FIXTURE } from '@lib/domain/test/fixtures/vehicle/vehicle.fixture';

import { FindVehicleUseCase } from '.';

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
