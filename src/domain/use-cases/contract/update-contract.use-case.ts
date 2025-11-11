import { Injectable, Inject } from '@nestjs/common';
import { Contract, ContractStatus } from '../../entities/contract.entity';
import { ContractRepository } from '../../repositories/contract.repository';

@Injectable()
export class UpdateContractUseCase {
  constructor(
    @Inject('ContractRepository')
    private readonly contractRepository: ContractRepository,
  ) {}

  async execute(
    id: string,
    input: {
      startDate?: Date;
      endDate?: Date;
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
