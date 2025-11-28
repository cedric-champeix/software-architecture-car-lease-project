import { Contract } from 'src/entities/contract';
import { ContractStatus } from 'src/entities/contract/enum';
import type { ContractRepository } from 'src/repositories/contract.repository';

import { CONTRACT_FIXTURE } from 'src/test/fixtures/contract/contract.fixture';
import { UpdateContractUseCase } from '.';

describe('UpdateContractUseCase', () => {
  let updateContractUseCase: UpdateContractUseCase;
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
    updateContractUseCase = new UpdateContractUseCase(contractRepository);
  });

  it('should update a contract', async () => {
    const contractId = { id: '123' };

    const contractData = {
      status: ContractStatus.CANCELLED,
    };

    const contract = new Contract(CONTRACT_FIXTURE);

    const updatedContract = new Contract({ ...contract, ...contractData });

    (contractRepository.findById as jest.Mock).mockResolvedValue(contract);
    (contractRepository.update as jest.Mock).mockResolvedValue(updatedContract);

    const result = await updateContractUseCase.execute({
      input: contractData,
      id: contractId.id,
    });

    expect(contractRepository.findById).toHaveBeenCalledWith(contractId);

    expect(contractRepository.update).toHaveBeenCalledWith({
      id: contractId.id,
      contract: {
        ...contract,
        ...contractData,
      },
    });

    expect(result).toEqual(updatedContract);
  });

  it('should throw an error if contract not found', async () => {
    const contractId = { id: '123' };
    const contractData = {
      status: ContractStatus.CANCELLED,
    };
    (contractRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      updateContractUseCase.execute({ id: contractId.id, input: contractData }),
    ).rejects.toThrow('Contract not found.');
  });
});
