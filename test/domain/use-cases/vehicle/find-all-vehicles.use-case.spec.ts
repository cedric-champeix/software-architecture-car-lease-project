import {
  FuelType,
  Vehicle,
  VehicleStatus,
} from 'src/domain/entities/vehicle.entity';
import type { VehicleRepository } from 'src/domain/repositories/vehicle.repository';
import { FindAllVehiclesUseCase } from 'src/domain/use-cases/vehicle/find-all-vehicles.use-case';

describe('FindAllVehiclesUseCase', () => {
  let findAllVehiclesUseCase: FindAllVehiclesUseCase;
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    vehicleRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      save: jest.fn(),
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
        status: VehicleStatus.AVAILABLE,
      }),
    ];
    (vehicleRepository.findAll as jest.Mock).mockResolvedValue(vehicles);

    const result = await findAllVehiclesUseCase.execute();

    expect(vehicleRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(vehicles);
  });
});
