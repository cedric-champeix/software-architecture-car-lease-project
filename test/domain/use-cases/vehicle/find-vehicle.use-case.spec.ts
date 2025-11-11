import { FindVehicleUseCase } from 'src/domain/use-cases/vehicle/find-vehicle.use-case';
import { VehicleRepository } from 'src/domain/repositories/vehicle.repository';
import { Vehicle, FuelType, VehicleStatus } from 'src/domain/entities/vehicle.entity';

describe('FindVehicleUseCase', () => {
  let findVehicleUseCase: FindVehicleUseCase;
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    vehicleRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findByLicensePlate: jest.fn(),
    };
    findVehicleUseCase = new FindVehicleUseCase(vehicleRepository);
  });

  it('should return a vehicle by id', async () => {
    const vehicleId = '123';
    const vehicle = new Vehicle({
      id: vehicleId,
      make: 'Toyota',
      model: 'Corolla',
      fuelType: FuelType.PETROL,
      color: 'blue',
      licensePlate: 'ABC-123',
      acquiredDate: new Date(),
      status: VehicleStatus.AVAILABLE,
    });
    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);

    const result = await findVehicleUseCase.execute(vehicleId);

    expect(vehicleRepository.findById).toHaveBeenCalledWith(vehicleId);
    expect(result).toEqual(vehicle);
  });
});
