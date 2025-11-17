import { Contract, ContractStatus } from 'src/domain/entities/contract.entity';
import type { ContractRepository } from 'src/domain/repositories/contract.repository';
import { FindContractUseCase } from 'src/domain/use-cases/contract/find-contract.use-case';

describe('FindContractUseCase', () => {
  let findContractUseCase: FindContractUseCase;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
      save: jest.fn(),
    };
    findContractUseCase = new FindContractUseCase(contractRepository);
  });

  it('should return a contract by id', async () => {
    const contractId = '123';
    const contract = new Contract({
      clientId: '1',
      endDate: new Date(),
      id: contractId,
      startDate: new Date(),
      status: ContractStatus.ACTIVE,
      vehicleId: '1',
    });
    (contractRepository.findById as jest.Mock).mockResolvedValue(contract);

    const result = await findContractUseCase.execute(contractId);

    expect(contractRepository.findById).toHaveBeenCalledWith(contractId);
    expect(result).toEqual(contract);
  });
});
