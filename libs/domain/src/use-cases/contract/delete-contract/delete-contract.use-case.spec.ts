import type { ContractRepository } from 'src/repositories/contract.repository';

import { DeleteContractUseCase } from '.';
import type { DeleteContractUseCaseInput } from '.';

describe('DeleteContractUseCase', () => {
  let deleteContractUseCase: DeleteContractUseCase;
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
    deleteContractUseCase = new DeleteContractUseCase(contractRepository);
  });

  it('should delete a contract', async () => {
    const contractId: DeleteContractUseCaseInput = { id: '123' };

    (contractRepository.deleteById as jest.Mock).mockResolvedValue(true);

    const result = await deleteContractUseCase.execute(contractId);

    expect(contractRepository.deleteById).toHaveBeenCalledWith(contractId);

    expect(result).toEqual(true);
  });

  it('should not delete a contract', async () => {
    const contractId: DeleteContractUseCaseInput = { id: '123' };

    (contractRepository.deleteById as jest.Mock).mockResolvedValue(false);

    const result = await deleteContractUseCase.execute(contractId);

    expect(contractRepository.deleteById).toHaveBeenCalledWith(contractId);

    expect(result).toEqual(false);
  });
});
