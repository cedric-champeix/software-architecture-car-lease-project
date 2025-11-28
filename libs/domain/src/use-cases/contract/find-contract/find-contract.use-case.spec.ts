import { Contract } from 'src/entities/contract';
import { ContractStatus } from 'src/entities/contract/enum';
import type { ContractRepository } from 'src/repositories/contract.repository';

import { FindContractUseCase } from '.';

describe('FindContractUseCase', () => {
  let findContractUseCase: FindContractUseCase;
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

    const result = await findContractUseCase.execute({ id: contractId });

    expect(contractRepository.findById).toHaveBeenCalledWith({
      id: contractId,
    });
    expect(result).toEqual(contract);
  });
});
