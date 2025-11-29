import { Contract, UpdateContract } from '@lib/domain/entities/contract';
import { ContractStatus } from '@lib/domain/entities/contract/enum';
import type { ContractRepository } from '@lib/domain/repositories/contract.repository';
import { CONTRACT_FIXTURE } from '@lib/domain/test/fixtures/contract/contract.fixture';

import { HandleOverdueContractsUseCase } from '.';

describe('HandleOverdueContractsUseCase', () => {
  let useCase: HandleOverdueContractsUseCase;
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
    useCase = new HandleOverdueContractsUseCase(contractRepository);
  });

  it('should mark overdue contracts as OVERDUE', async () => {
    const now = new Date();

    const contractId1 = '1';
    const contractId2 = '2';

    const contract1 = new Contract({
      ...CONTRACT_FIXTURE,
      endDate: new Date(now.getTime() - 1000),
      id: contractId1,
      startDate: new Date(now.getTime() - 1000),
    });
    const contract2 = new Contract({
      ...CONTRACT_FIXTURE,
      endDate: new Date(now.getTime() + 1000),
      id: contractId2,
      startDate: new Date(now.getTime() + 1000),
    });

    const contracts = [contract1, contract2];

    (contractRepository.findAll as jest.Mock).mockResolvedValue(contracts);

    (
      contractRepository.findByVehicleIdAndDateRange as jest.Mock
    ).mockResolvedValue([]);

    await useCase.execute();

    expect(contractRepository.update).toHaveBeenCalledWith({
      contract: new UpdateContract({ status: ContractStatus.OVERDUE }),
      id: contractId1,
    });

    expect(contractRepository.update).not.toHaveBeenCalledWith({
      contract: new UpdateContract({ status: ContractStatus.OVERDUE }),
      id: contractId2,
    });
  });

  it('should cancel next contract if affected by overdue contract', async () => {
    const now = new Date();

    const overdueContract = new Contract({
      ...CONTRACT_FIXTURE,
      endDate: new Date(now.getTime() - 1000),
      startDate: new Date(now.getTime() - 2000),
    });

    const nextContract = new Contract({
      ...CONTRACT_FIXTURE,
      endDate: new Date(now.getTime() + 1000),
      id: 'SomeId',
      startDate: new Date(now.getTime()),
    });

    (contractRepository.findAll as jest.Mock).mockResolvedValue([
      overdueContract,
    ]);

    (
      contractRepository.findByVehicleIdAndDateRange as jest.Mock
    ).mockResolvedValue([nextContract]);

    await useCase.execute();

    expect(contractRepository.update).toHaveBeenCalledTimes(2);

    expect(contractRepository.update).toHaveBeenCalledWith({
      contract: new UpdateContract({ status: ContractStatus.OVERDUE }),
      id: overdueContract.id,
    });

    expect(contractRepository.update).toHaveBeenCalledWith({
      contract: new UpdateContract({ status: ContractStatus.CANCELLED }),
      id: nextContract.id,
    });
  });
});
