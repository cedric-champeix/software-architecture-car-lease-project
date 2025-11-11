import { FindAllContractsUseCase } from 'src/domain/use-cases/contract/find-all-contracts.use-case';
import { ContractRepository } from 'src/domain/repositories/contract.repository';
import { Contract, ContractStatus } from 'src/domain/entities/contract.entity';

describe('FindAllContractsUseCase', () => {
  let findAllContractsUseCase: FindAllContractsUseCase;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
    };
    findAllContractsUseCase = new FindAllContractsUseCase(contractRepository);
  });

  it('should return all contracts', async () => {
    const contracts = [
      new Contract({
        id: '1',
        vehicleId: '1',
        clientId: '1',
        startDate: new Date(),
        endDate: new Date(),
        status: ContractStatus.ACTIVE,
      }),
    ];
    (contractRepository.findAll as jest.Mock).mockResolvedValue(contracts);

    const result = await findAllContractsUseCase.execute();

    expect(contractRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(contracts);
  });
});
