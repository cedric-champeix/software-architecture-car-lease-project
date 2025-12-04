import { Contract, UpdateContract } from '@lib/domain/entities/contract';
import { ContractStatus } from '@lib/domain/entities/contract/enum';
import { VehicleStatus } from '@lib/domain/entities/vehicle/enum';
import { Vehicle } from '@lib/domain/entities/vehicle/vehicle.entity';
import type { ContractRepository } from '@lib/domain/repositories/contract.repository';
import { CONTRACT_FIXTURE } from '@lib/domain/test/fixtures/contract/contract.fixture';
import { VEHICLE_FIXTURE } from '@lib/domain/test/fixtures/vehicle/vehicle.fixture';

import { CancelContractsForVehicleInMaintenanceUseCase } from '.';

describe('CancelContractsForVehicleInMaintenanceUseCase', () => {
  let cancelContractUseCase: CancelContractsForVehicleInMaintenanceUseCase;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
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
      endDate: new Date(new Date().getTime() + 20),
      id: '1',
      startDate: new Date(new Date().getTime() + 10),
      status: ContractStatus.PENDING,
      vehicleId: vehicle.id,
    });

    const contract2 = new Contract({
      ...CONTRACT_FIXTURE,
      endDate: new Date(new Date().getTime() - 10),
      id: '2',
      startDate: new Date(new Date().getTime() - 20),
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        endDate: expect.any(Date),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        startDate: expect.any(Date),
        vehicleId: vehicle.id,
      },
    );

    expect(contractRepository.update).toHaveBeenCalledWith({
      contract: new UpdateContract({
        status: ContractStatus.CANCELLED,
      }),
      id: '1',
    });

    expect(contractRepository.update).not.toHaveBeenCalledWith({
      contract: new UpdateContract({
        status: ContractStatus.CANCELLED,
      }),
      id: '2',
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
