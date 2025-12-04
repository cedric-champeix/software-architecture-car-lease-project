import { VehicleStatus } from '@lib/domain/entities/vehicle/enum';
import { Vehicle } from '@lib/domain/entities/vehicle/vehicle.entity';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import { VEHICLE_FIXTURE } from '@lib/domain/test/fixtures/vehicle/vehicle.fixture';
import type { CancelContractsForVehicleInMaintenanceUseCase } from '@lib/domain/use-cases/contract/cancel-contracts-for-vehicle-in-maintenance';
import { UpdateVehicleUseCase } from '@lib/domain/use-cases/vehicle/update-vehicle';

describe('UpdateVehicleUseCase', () => {
  let updateVehicleUseCase: UpdateVehicleUseCase;
  let vehicleRepository: VehicleRepository;
  let cancelContractsForVehicleInMaintenanceUseCase: CancelContractsForVehicleInMaintenanceUseCase;

  beforeEach(() => {
    vehicleRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      update: jest.fn(),
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
    const vehicleId = { id: '123' };

    const vehicleData = {
      color: 'red',
      model: 'Camry',
    };

    const updatedVehicle = new Vehicle({ ...VEHICLE_FIXTURE, ...vehicleData });

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(
      VEHICLE_FIXTURE,
    );
    (vehicleRepository.update as jest.Mock).mockResolvedValue(updatedVehicle);

    const result = await updateVehicleUseCase.execute({
      id: vehicleId.id,
      input: vehicleData,
    });

    expect(vehicleRepository.findById).toHaveBeenCalledWith(vehicleId);

    expect(vehicleRepository.update).toHaveBeenCalledWith({
      id: vehicleId.id,
      vehicle: { ...VEHICLE_FIXTURE, ...vehicleData },
    });

    expect(result).toEqual(updatedVehicle);
  });

  it('should cancel contracts if vehicle status is maintenance', async () => {
    const vehicleId = { id: '123' };
    const vehicleData = {
      status: VehicleStatus.MAINTENANCE,
    };
    const vehicle = new Vehicle({
      ...VEHICLE_FIXTURE,
      id: vehicleId.id,
      status: VehicleStatus.AVAILABLE,
    });

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);
    (vehicleRepository.update as jest.Mock).mockResolvedValue(vehicle);

    await updateVehicleUseCase.execute({
      id: vehicleId.id,
      input: vehicleData,
    });

    expect(
      cancelContractsForVehicleInMaintenanceUseCase.execute,
    ).toHaveBeenCalledWith(vehicle);
  });
});
