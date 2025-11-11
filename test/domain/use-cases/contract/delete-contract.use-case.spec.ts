import { DeleteContractUseCase } from 'src/domain/use-cases/contract/delete-contract.use-case';
import { ContractRepository } from 'src/domain/repositories/contract.repository';

describe('DeleteContractUseCase', () => {
  let deleteContractUseCase: DeleteContractUseCase;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
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
