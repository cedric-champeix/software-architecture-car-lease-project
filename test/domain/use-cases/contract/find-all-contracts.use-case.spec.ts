import { Contract, ContractStatus } from 'src/domain/entities/contract.entity';
import type { ContractRepository } from 'src/domain/repositories/contract.repository';
import { FindAllContractsUseCase } from 'src/domain/use-cases/contract/find-all-contracts.use-case';

describe('FindAllContractsUseCase', () => {
  let findAllContractsUseCase: FindAllContractsUseCase;
  let contractRepository: ContractRepository;

  beforeEach(() => {
    contractRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
      save: jest.fn(),
    };
    findAllContractsUseCase = new FindAllContractsUseCase(contractRepository);
  });

  it('should return all contracts', async () => {
    const contracts = [
      new Contract({
        clientId: '1',
        endDate: new Date(),
        id: '1',
        startDate: new Date(),
        status: ContractStatus.ACTIVE,
        vehicleId: '1',
      }),
    ];
    (contractRepository.findAll as jest.Mock).mockResolvedValue(contracts);

    const result = await findAllContractsUseCase.execute();

    expect(contractRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(contracts);
  });
});
