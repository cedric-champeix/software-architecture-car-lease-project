import type { Contract, ContractStatus } from 'src/entities/contract.entity';
import type { ContractRepository } from 'src/repositories/contract.repository';

export class UpdateContractUseCase {
  constructor(private readonly contractRepository: ContractRepository) {}

  async execute(
    id: string,
    input: {
      endDate?: Date;
      startDate?: Date;
      status?: ContractStatus;
    },
  ): Promise<Contract> {
    const contract = await this.contractRepository.findById(id);

    if (!contract) {
      throw new Error('Contract not found.');
    }

    Object.assign(contract, input);

    return this.contractRepository.save(contract);
  }
}
