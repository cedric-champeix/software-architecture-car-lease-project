import { Contract, UpdateContract } from 'src/entities/contract';
import { ContractStatus } from 'src/entities/contract/enum';
import type { ContractRepository } from 'src/repositories/contract.repository';

import { HandleOverdueContractsUseCase } from '.';
import { CONTRACT_FIXTURE } from 'src/test/fixtures/contract/contract.fixture';

describe('HandleOverdueContractsUseCase', () => {
  let useCase: HandleOverdueContractsUseCase;
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
    useCase = new HandleOverdueContractsUseCase(contractRepository);
  });

  it('should mark overdue contracts as OVERDUE', async () => {
    const now = new Date();

    const contractId1 = '1';
    const contractId2 = '2';

    const contract1 = new Contract({
      ...CONTRACT_FIXTURE,
      id: contractId1,
      startDate: new Date(now.getTime() - 1000),
      endDate: new Date(now.getTime() - 1000),
    });
    const contract2 = new Contract({
      ...CONTRACT_FIXTURE,
      id: contractId2,
      startDate: new Date(now.getTime() + 1000),
      endDate: new Date(now.getTime() + 1000),
    });

    const contracts = [contract1, contract2];

    (contractRepository.findAll as jest.Mock).mockResolvedValue(contracts);

    (
      contractRepository.findByVehicleIdAndDateRange as jest.Mock
    ).mockResolvedValue([]);

    await useCase.execute();

    expect(contractRepository.update).toHaveBeenCalledWith({
      id: contractId1,
      contract: new UpdateContract({ status: ContractStatus.OVERDUE }),
    });

    expect(contractRepository.update).not.toHaveBeenCalledWith({
      id: contractId2,
      contract: new UpdateContract({ status: ContractStatus.OVERDUE }),
    });
  });

  it('should cancel next contract if affected by overdue contract', async () => {
    const now = new Date();

    const overdueContract = new Contract({
      ...CONTRACT_FIXTURE,
      startDate: new Date(now.getTime() - 2000),
      endDate: new Date(now.getTime() - 1000),
    });

    const nextContract = new Contract({
      ...CONTRACT_FIXTURE,
      id: 'SomeId',
      startDate: new Date(now.getTime()),
      endDate: new Date(now.getTime() + 1000),
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
      id: overdueContract.id,
      contract: new UpdateContract({ status: ContractStatus.OVERDUE }),
    });

    expect(contractRepository.update).toHaveBeenCalledWith({
      id: nextContract.id,
      contract: new UpdateContract({ status: ContractStatus.CANCELLED }),
    });
  });
});
