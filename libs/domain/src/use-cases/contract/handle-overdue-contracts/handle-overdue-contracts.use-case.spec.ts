import { Contract, ContractStatus } from 'src/entities/contract.entity';
import type { ContractRepository } from 'src/repositories/contract.repository';

import { HandleOverdueContractsUseCase } from '.';

describe('HandleOverdueContractsUseCase', () => {
  let useCase: HandleOverdueContractsUseCase;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
      save: jest.fn(),
    };
    useCase = new HandleOverdueContractsUseCase(contractRepository);
  });

  it('should mark overdue contracts as OVERDUE', async () => {
    const now = new Date();
    const contracts = [
      new Contract({
        endDate: new Date(now.getTime() - 1000),
        id: '1',
        status: ContractStatus.ACTIVE,
        vehicleId: '1',
      }),
      new Contract({
        endDate: new Date(now.getTime() + 1000),
        id: '2',
        status: ContractStatus.ACTIVE,
        vehicleId: '2',
      }),
    ];
    (contractRepository.findAll as jest.Mock).mockResolvedValue(contracts);
    (
      contractRepository.findByVehicleIdAndDateRange as jest.Mock
    ).mockResolvedValue([]);

    await useCase.execute();

    expect(contractRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', status: ContractStatus.OVERDUE }),
    );
    expect(contractRepository.save).not.toHaveBeenCalledWith(
      expect.objectContaining({ id: '2' }),
    );
  });

  it('should cancel next contract if affected by overdue contract', async () => {
    const now = new Date();
    const overdueContract = new Contract({
      endDate: new Date(now.getTime() - 1000),
      id: '1',
      status: ContractStatus.ACTIVE,
      vehicleId: '1',
    });
    const nextContract = new Contract({
      id: '2',
      startDate: new Date(now.getTime() - 500),
      status: ContractStatus.PENDING,
      vehicleId: '1',
    });

    (contractRepository.findAll as jest.Mock).mockResolvedValue([
      overdueContract,
    ]);
    (
      contractRepository.findByVehicleIdAndDateRange as jest.Mock
    ).mockResolvedValue([nextContract]);

    await useCase.execute();

    expect(contractRepository.save).toHaveBeenCalledTimes(2);
    expect(contractRepository.save).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ id: '1', status: ContractStatus.OVERDUE }),
    );
    expect(contractRepository.save).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ id: '2', status: ContractStatus.CANCELED }),
    );
  });
});
