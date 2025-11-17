import {
  FuelType,
  Vehicle,
  VehicleStatus,
} from 'src/domain/entities/vehicle.entity';
import type { VehicleRepository } from 'src/domain/repositories/vehicle.repository';
import type { ContractService } from 'src/domain/services/contract.service';
import { UpdateVehicleUseCase } from 'src/domain/use-cases/vehicle/update-vehicle.use-case';

describe('UpdateVehicleUseCase', () => {
  let updateVehicleUseCase: UpdateVehicleUseCase;
  let vehicleRepository: VehicleRepository;
  let contractService: ContractService;

  beforeEach(() => {
    vehicleRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      save: jest.fn(),
    };
    contractService = {
      cancelContractsForVehicleInMaintenance: jest.fn(),
      handleOverdueContracts: jest.fn(),
    } as unknown as ContractService;
    updateVehicleUseCase = new UpdateVehicleUseCase(
      vehicleRepository,
      contractService,
    );
  });

  it('should update a vehicle', async () => {
    const vehicleId = '123';
    const vehicleData = {
      color: 'red',
      model: 'Camry',
    };
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
    const updatedVehicle = new Vehicle({ ...vehicle, ...vehicleData });

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);
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
      id: vehicleId,
      status: VehicleStatus.AVAILABLE,
    });

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);
    (vehicleRepository.save as jest.Mock).mockResolvedValue(vehicle);

    await updateVehicleUseCase.execute(vehicleId, vehicleData);

    expect(
      contractService.cancelContractsForVehicleInMaintenance,
    ).toHaveBeenCalledWith(expect.objectContaining(vehicleData));
  });
});
