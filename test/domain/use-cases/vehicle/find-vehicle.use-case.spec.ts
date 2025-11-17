import {
  FuelType,
  Vehicle,
  VehicleStatus,
} from 'src/domain/entities/vehicle.entity';
import type { VehicleRepository } from 'src/domain/repositories/vehicle.repository';
import { FindVehicleUseCase } from 'src/domain/use-cases/vehicle/find-vehicle.use-case';

describe('FindVehicleUseCase', () => {
  let findVehicleUseCase: FindVehicleUseCase;
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    vehicleRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      save: jest.fn(),
    };
    findVehicleUseCase = new FindVehicleUseCase(vehicleRepository);
  });

  it('should return a vehicle by id', async () => {
    const vehicleId = '123';
    const vehicle = new Vehicle({
      acquiredDate: new Date(),
      color: 'blue',
      fuelType: FuelType.PETROL,
      id: vehicleId,
      licensePlate: 'ABC-123',
      make: 'Toyota',
      model: 'Corolla',
      status: VehicleStatus.AVAILABLE,
    });
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);

    const result = await findVehicleUseCase.execute(vehicleId);

    expect(vehicleRepository.findById).toHaveBeenCalledWith(vehicleId);
    expect(result).toEqual(vehicle);
  });
});
