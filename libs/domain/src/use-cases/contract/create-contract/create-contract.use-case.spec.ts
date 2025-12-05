import { Contract, CreateContract } from '@lib/domain/entities/contract';
import { ContractStatus } from '@lib/domain/entities/contract/enum';
import type { ContractRepository } from '@lib/domain/repositories/contract.repository';
import { CONTRACT_FIXTURE } from '@lib/domain/test/fixtures/contract/contract.fixture';

import { CreateContractUseCase } from './create-contract.use-case';

describe('CreateContractUseCase', () => {
  let createContractUseCase: CreateContractUseCase;
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
    createContractUseCase = new CreateContractUseCase(contractRepository);
  });

  it('should create a new contract', async () => {
    const contractData = {
      clientId: 'client-1',
      endDate: new Date('2020-01-01'),
      startDate: new Date('2020-01-01'),
      vehicleId: 'vehicle-1',
    };

    const contract = new Contract({
      ...CONTRACT_FIXTURE,
      ...contractData,
      status: ContractStatus.PENDING,
    });

    (contractRepository.create as jest.Mock).mockResolvedValue(contract);

    const result = await createContractUseCase.execute(contractData);

    expect(contractRepository.create).toHaveBeenCalledWith({
      contract: new CreateContract({
        ...contractData,
        status: ContractStatus.PENDING,
      }),
    });

    expect(result).toEqual(contract);
  });
});
