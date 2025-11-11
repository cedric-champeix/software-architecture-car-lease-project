import { UpdateVehicleUseCase } from 'src/domain/use-cases/vehicle/update-vehicle.use-case';
import { VehicleRepository } from 'src/domain/repositories/vehicle.repository';
import { Vehicle, FuelType, VehicleStatus } from 'src/domain/entities/vehicle.entity';
import { ContractService } from 'src/domain/services/contract.service';

describe('UpdateVehicleUseCase', () => {
  let updateVehicleUseCase: UpdateVehicleUseCase;
  let vehicleRepository: VehicleRepository;
  let contractService: ContractService;

  beforeEach(() => {
    vehicleRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findByLicensePlate: jest.fn(),
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
      model: 'Camry',
      color: 'red',
    };
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
