import { FindContractUseCase } from 'src/domain/use-cases/contract/find-contract.use-case';
import { ContractRepository } from 'src/domain/repositories/contract.repository';
import { Contract, ContractStatus } from 'src/domain/entities/contract.entity';

describe('FindContractUseCase', () => {
  let findContractUseCase: FindContractUseCase;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
    };
    findContractUseCase = new FindContractUseCase(contractRepository);
  });

  it('should return a contract by id', async () => {
    const contractId = '123';
    const contract = new Contract({
      id: contractId,
      vehicleId: '1',
      clientId: '1',
      startDate: new Date(),
      endDate: new Date(),
      status: ContractStatus.ACTIVE,
    });
    (contractRepository.findById as jest.Mock).mockResolvedValue(contract);

    const result = await findContractUseCase.execute(contractId);

    expect(contractRepository.findById).toHaveBeenCalledWith(contractId);
    expect(result).toEqual(contract);
  });
});
