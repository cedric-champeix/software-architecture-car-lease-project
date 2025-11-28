import { Contract, UpdateContract } from 'src/entities/contract';
import { ContractStatus } from 'src/entities/contract/enum';
import { Vehicle } from 'src/entities/vehicle/vehicle.entity';
import {
  FuelType,
  MotorizationType,
  VehicleStatus,
} from 'src/entities/vehicle/enum';
import type { ContractRepository } from 'src/repositories/contract.repository';

import { CancelContractsForVehicleInMaintenanceUseCase } from '.';
import { VEHICLE_FIXTURE } from 'src/test/fixtures/vehicle/vehicle.fixture';
import { CONTRACT_FIXTURE } from 'src/test/fixtures/contract/contract.fixture';

describe('CancelContractsForVehicleInMaintenanceUseCase', () => {
  let cancelContractUseCase: CancelContractsForVehicleInMaintenanceUseCase;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    cancelContractUseCase = new CancelContractsForVehicleInMaintenanceUseCase(
      contractRepository,
    );
  });

  it('should cancel pending contracts for a vehicle in maintenance', async () => {
    const vehicle = new Vehicle({
      ...VEHICLE_FIXTURE,
      status: VehicleStatus.MAINTENANCE,
    });

    const contract1 = new Contract({
      ...CONTRACT_FIXTURE,
      id: '1',
      startDate: new Date(new Date().getTime() + 10),
      endDate: new Date(new Date().getTime() + 20),
      status: ContractStatus.PENDING,
      vehicleId: vehicle.id,
    });

    const contract2 = new Contract({
      ...CONTRACT_FIXTURE,
      id: '2',
      startDate: new Date(new Date().getTime() - 20),
      endDate: new Date(new Date().getTime() - 10),
      status: ContractStatus.ACTIVE,
      vehicleId: vehicle.id,
    });

    const contracts = [contract1, contract2];

    (
      contractRepository.findByVehicleIdAndDateRange as jest.Mock
    ).mockResolvedValue(contracts);

    await cancelContractUseCase.execute(vehicle);

    expect(contractRepository.findByVehicleIdAndDateRange).toHaveBeenCalledWith(
      {
        vehicleId: vehicle.id,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      },
    );

    expect(contractRepository.update).toHaveBeenCalledWith({
      id: '1',
      contract: new UpdateContract({
        status: ContractStatus.CANCELLED,
      }),
    });

    expect(contractRepository.update).not.toHaveBeenCalledWith({
      id: '2',
      contract: new UpdateContract({
        status: ContractStatus.CANCELLED,
      }),
    });
  });

  it('should not do anything if vehicle is not in maintenance', async () => {
    const vehicle = new Vehicle({
      ...VEHICLE_FIXTURE,
      status: VehicleStatus.AVAILABLE,
    });

    await cancelContractUseCase.execute(vehicle);

    expect(
      contractRepository.findByVehicleIdAndDateRange,
    ).not.toHaveBeenCalled();

    expect(contractRepository.update).not.toHaveBeenCalled();
  });
});
