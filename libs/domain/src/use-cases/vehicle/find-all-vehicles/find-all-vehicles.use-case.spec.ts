import {
  FuelType,
  MotorizationType,
  VehicleStatus,
} from '@lib/domain/entities/vehicle/enum';
import { Vehicle } from '@lib/domain/entities/vehicle/vehicle.entity';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';

import { FindAllVehiclesUseCase } from '.';

describe('FindAllVehiclesUseCase', () => {
  let findAllVehiclesUseCase: FindAllVehiclesUseCase;
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
    findAllVehiclesUseCase = new FindAllVehiclesUseCase(vehicleRepository);
  });

  it('should return all vehicles', async () => {
    const vehicles = [
      new Vehicle({
        acquiredDate: new Date(),
        color: 'blue',
        fuelType: FuelType.PETROL,
        id: '1',
        licensePlate: 'ABC-123',
        make: 'Toyota',
        model: 'Corolla',
        motorizationType: MotorizationType.INTERNAL_COMBUSTION,
        status: VehicleStatus.AVAILABLE,
      }),
    ];
    (vehicleRepository.findAll as jest.Mock).mockResolvedValue(vehicles);

    const result = await findAllVehiclesUseCase.execute();

    expect(vehicleRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(vehicles);
  });
});
