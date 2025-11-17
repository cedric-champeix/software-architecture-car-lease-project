import {
  FuelType,
  Vehicle,
  VehicleStatus,
} from 'src/domain/entities/vehicle.entity';
import type { VehicleRepository } from 'src/domain/repositories/vehicle.repository';
import { CreateVehicleUseCase } from 'src/domain/use-cases/vehicle/create-vehicle.use-case';

describe('CreateVehicleUseCase', () => {
  let createVehicleUseCase: CreateVehicleUseCase;
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    vehicleRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      save: jest.fn(),
    };
    createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
  });

  it('should create a new vehicle', async () => {
    const vehicleData = {
      acquiredDate: new Date(),
      color: 'blue',
      fuelType: FuelType.PETROL,
      licensePlate: 'ABC-123',
      make: 'Toyota',
      model: 'Corolla',
    };
    const vehicle = new Vehicle({
      ...vehicleData,
      status: VehicleStatus.AVAILABLE,
    });
    (vehicleRepository.findByLicensePlate as jest.Mock).mockResolvedValue(null);
    (vehicleRepository.save as jest.Mock).mockResolvedValue(vehicle);

    const result = await createVehicleUseCase.execute(vehicleData);

    expect(vehicleRepository.findByLicensePlate).toHaveBeenCalledWith(
      vehicleData.licensePlate,
    );
    expect(vehicleRepository.save).toHaveBeenCalledWith(expect.any(Vehicle));
    expect(result).toEqual(vehicle);
  });

  it('should throw an error if vehicle with this license plate already exists', async () => {
    const vehicleData = {
      acquiredDate: new Date(),
      color: 'blue',
      fuelType: FuelType.PETROL,
      licensePlate: 'ABC-123',
      make: 'Toyota',
      model: 'Corolla',
    };
    (vehicleRepository.findByLicensePlate as jest.Mock).mockResolvedValue(
      new Vehicle(),
    );

    await expect(createVehicleUseCase.execute(vehicleData)).rejects.toThrow(
      'Vehicle with this license plate already exists.',
    );
  });
});
