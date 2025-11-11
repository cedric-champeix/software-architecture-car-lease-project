import { FindAllVehiclesUseCase } from 'src/domain/use-cases/vehicle/find-all-vehicles.use-case';
import { VehicleRepository } from 'src/domain/repositories/vehicle.repository';
import { Vehicle, FuelType, VehicleStatus } from 'src/domain/entities/vehicle.entity';

describe('FindAllVehiclesUseCase', () => {
  let findAllVehiclesUseCase: FindAllVehiclesUseCase;
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    vehicleRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findByLicensePlate: jest.fn(),
    };
    findAllVehiclesUseCase = new FindAllVehiclesUseCase(vehicleRepository);
  });

  it('should return all vehicles', async () => {
    const vehicles = [
      new Vehicle({
        id: '1',
        make: 'Toyota',
        model: 'Corolla',
        fuelType: FuelType.PETROL,
        color: 'blue',
        licensePlate: 'ABC-123',
        acquiredDate: new Date(),
        status: VehicleStatus.AVAILABLE,
      }),
    ];
    (vehicleRepository.findAll as jest.Mock).mockResolvedValue(vehicles);

    const result = await findAllVehiclesUseCase.execute();

    expect(vehicleRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(vehicles);
  });
});
