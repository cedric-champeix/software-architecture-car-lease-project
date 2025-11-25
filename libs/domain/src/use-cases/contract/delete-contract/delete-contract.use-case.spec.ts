import type { ContractRepository } from 'src/repositories/contract.repository';

import { DeleteContractUseCase } from '.';

describe('DeleteContractUseCase', () => {
  let deleteContractUseCase: DeleteContractUseCase;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
      save: jest.fn(),
    };
    deleteContractUseCase = new DeleteContractUseCase(contractRepository);
  });

  it('should delete a contract', async () => {
    const contractId = '123';
    (contractRepository.deleteById as jest.Mock).mockResolvedValue(undefined);

    await deleteContractUseCase.execute(contractId);

    expect(contractRepository.deleteById).toHaveBeenCalledWith(contractId);
  });
});
