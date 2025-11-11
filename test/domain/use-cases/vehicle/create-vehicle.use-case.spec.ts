import { CreateVehicleUseCase } from 'src/domain/use-cases/vehicle/create-vehicle.use-case';
import { VehicleRepository } from 'src/domain/repositories/vehicle.repository';
import { Vehicle, FuelType, VehicleStatus } from 'src/domain/entities/vehicle.entity';

describe('CreateVehicleUseCase', () => {
  let createVehicleUseCase: CreateVehicleUseCase;
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    vehicleRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findByLicensePlate: jest.fn(),
    };
    createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
  });

  it('should create a new vehicle', async () => {
    const vehicleData = {
      make: 'Toyota',
      model: 'Corolla',
      fuelType: FuelType.PETROL,
      color: 'blue',
      licensePlate: 'ABC-123',
      acquiredDate: new Date(),
    };
    const vehicle = new Vehicle({ ...vehicleData, status: VehicleStatus.AVAILABLE });
    (vehicleRepository.findByLicensePlate as jest.Mock).mockResolvedValue(null);
    (vehicleRepository.save as jest.Mock).mockResolvedValue(vehicle);

    const result = await createVehicleUseCase.execute(vehicleData);

    expect(vehicleRepository.findByLicensePlate).toHaveBeenCalledWith(vehicleData.licensePlate);
    expect(vehicleRepository.save).toHaveBeenCalledWith(expect.any(Vehicle));
    expect(result).toEqual(vehicle);
  });

  it('should throw an error if vehicle with this license plate already exists', async () => {
    const vehicleData = {
      make: 'Toyota',
      model: 'Corolla',
      fuelType: FuelType.PETROL,
      color: 'blue',
      licensePlate: 'ABC-123',
      acquiredDate: new Date(),
    };
    (vehicleRepository.findByLicensePlate as jest.Mock).mockResolvedValue(new Vehicle());

    await expect(createVehicleUseCase.execute(vehicleData)).rejects.toThrow(
      'Vehicle with this license plate already exists.',
    );
  });
});
