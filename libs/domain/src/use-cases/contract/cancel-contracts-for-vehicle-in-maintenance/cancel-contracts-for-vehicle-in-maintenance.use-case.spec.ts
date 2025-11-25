import { Contract, ContractStatus } from 'src/entities/contract.entity';
import { Vehicle, VehicleStatus } from 'src/entities/vehicle.entity';
import type { ContractRepository } from 'src/repositories/contract.repository';

import { CancelContractsForVehicleInMaintenanceUseCase } from '.';

describe('CancelContractsForVehicleInMaintenanceUseCase', () => {
  let useCase: CancelContractsForVehicleInMaintenanceUseCase;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
      save: jest.fn(),
    };
    useCase = new CancelContractsForVehicleInMaintenanceUseCase(
      contractRepository,
    );
  });

  it('should cancel pending contracts for a vehicle in maintenance', async () => {
    const vehicle = new Vehicle({
      id: '1',
      status: VehicleStatus.MAINTENANCE,
    } as any);
    const contracts = [
      new Contract({ id: '1', status: ContractStatus.PENDING }),
      new Contract({ id: '2', status: ContractStatus.ACTIVE }),
    ];
    (
      contractRepository.findByVehicleIdAndDateRange as jest.Mock
    ).mockResolvedValue(contracts);

    await useCase.execute(vehicle);

    expect(contractRepository.findByVehicleIdAndDateRange).toHaveBeenCalledWith(
      vehicle.id,
      expect.any(Date),
      expect.any(Date),
    );
    expect(contractRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', status: ContractStatus.CANCELED }),
    );
    expect(contractRepository.save).not.toHaveBeenCalledWith(
      expect.objectContaining({ id: '2' }),
    );
  });

  it('should not do anything if vehicle is not in maintenance', async () => {
    const vehicle = new Vehicle({
      id: '1',
      status: VehicleStatus.AVAILABLE,
    } as any);

    await useCase.execute(vehicle);

    expect(
      contractRepository.findByVehicleIdAndDateRange,
    ).not.toHaveBeenCalled();
    expect(contractRepository.save).not.toHaveBeenCalled();
  });
});
