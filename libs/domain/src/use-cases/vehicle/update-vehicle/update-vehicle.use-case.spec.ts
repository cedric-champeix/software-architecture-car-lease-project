import {
  FuelType,
  MotorizationType,
  Vehicle,
  VehicleStatus,
} from 'src/entities/vehicle.entity';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';
import type { CancelContractsForVehicleInMaintenanceUseCase } from 'src/use-cases/contract/cancel-contracts-for-vehicle-in-maintenance';
import { UpdateVehicleUseCase } from 'src/use-cases/vehicle/update-vehicle';

const vehicleMock: Vehicle = new Vehicle({
  acquiredDate: new Date('2020-01-01'),
  color: 'Blue',
  fuelType: FuelType.PETROL,
  id: 'vehicle-1',
  licensePlate: 'ABC-1234',
  make: 'Toyota',
  model: 'Corolla',
  motorizationType: MotorizationType.INTERNAL_COMBUSTION,
  status: VehicleStatus.AVAILABLE,
});

describe('UpdateVehicleUseCase', () => {
  let updateVehicleUseCase: UpdateVehicleUseCase;
  let vehicleRepository: VehicleRepository;
  let cancelContractsForVehicleInMaintenanceUseCase: CancelContractsForVehicleInMaintenanceUseCase;

  beforeEach(() => {
    vehicleRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      save: jest.fn(),
    };
    cancelContractsForVehicleInMaintenanceUseCase = {
      execute: jest.fn(),
    } as unknown as CancelContractsForVehicleInMaintenanceUseCase;
    updateVehicleUseCase = new UpdateVehicleUseCase(
      vehicleRepository,
      cancelContractsForVehicleInMaintenanceUseCase,
    );
  });

  it('should update a vehicle', async () => {
    const vehicleId = '123';
    const vehicleData = {
      color: 'red',
      model: 'Camry',
    };
    const updatedVehicle = new Vehicle({ ...vehicleMock, ...vehicleData });

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicleMock);
    (vehicleRepository.save as jest.Mock).mockResolvedValue(updatedVehicle);

    const result = await updateVehicleUseCase.execute(vehicleId, vehicleData);

    expect(vehicleRepository.findById).toHaveBeenCalledWith(vehicleId);
    expect(vehicleRepository.save).toHaveBeenCalledWith(
      expect.objectContaining(vehicleData),
    );
    expect(result).toEqual(updatedVehicle);
  });

  it('should cancel contracts if vehicle status is maintenance', async () => {
    const vehicleId = '123';
    const vehicleData = {
      status: VehicleStatus.MAINTENANCE,
    };
    const vehicle = new Vehicle({
      ...vehicleMock,
      id: vehicleId,
      status: VehicleStatus.AVAILABLE,
    });

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);
    (vehicleRepository.save as jest.Mock).mockResolvedValue(vehicle);

    await updateVehicleUseCase.execute(vehicleId, vehicleData);

    expect(
      cancelContractsForVehicleInMaintenanceUseCase.execute,
    ).toHaveBeenCalledWith(expect.objectContaining(vehicleData));
  });
});
