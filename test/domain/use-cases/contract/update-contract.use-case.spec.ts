import { UpdateContractUseCase } from 'src/domain/use-cases/contract/update-contract.use-case';
import { ContractRepository } from 'src/domain/repositories/contract.repository';
import { Contract, ContractStatus } from 'src/domain/entities/contract.entity';

describe('UpdateContractUseCase', () => {
  let updateContractUseCase: UpdateContractUseCase;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
    };
    updateContractUseCase = new UpdateContractUseCase(contractRepository);
  });

  it('should update a contract', async () => {
    const contractId = '123';
    const contractData = {
      status: ContractStatus.CANCELED,
    };
    const contract = new Contract({
      id: contractId,
      status: ContractStatus.PENDING,
    });
    const updatedContract = new Contract({ ...contract, ...contractData });

    (contractRepository.findById as jest.Mock).mockResolvedValue(contract);
    (contractRepository.save as jest.Mock).mockResolvedValue(updatedContract);

    const result = await updateContractUseCase.execute(contractId, contractData);

    expect(contractRepository.findById).toHaveBeenCalledWith(contractId);
    expect(contractRepository.save).toHaveBeenCalledWith(
      expect.objectContaining(contractData),
    );
    expect(result).toEqual(updatedContract);
  });

  it('should throw an error if contract not found', async () => {
    const contractId = '123';
    const contractData = {
      status: ContractStatus.CANCELED,
    };
    (contractRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      updateContractUseCase.execute(contractId, contractData),
    ).rejects.toThrow('Contract not found.');
  });
});
