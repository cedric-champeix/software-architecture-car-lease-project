import { UseCase } from 'src/common/use-cases';
import type { Contract } from 'src/entities/contract';
import type { ContractStatus } from 'src/entities/contract/enum';
import type { ContractRepository } from 'src/repositories/contract.repository';

export type UpdateContractUseCaseInput = {
  id: string;
  input: {
    endDate?: Date;
    startDate?: Date;
    status?: ContractStatus;
  };
};

export class UpdateContractUseCase extends UseCase<
  UpdateContractUseCaseInput,
  Contract
> {
  constructor(private readonly contractRepository: ContractRepository) {
    super();
  }

  async execute({ id, input }: UpdateContractUseCaseInput): Promise<Contract> {
    const contract = await this.contractRepository.findById({ id });

    if (!contract) {
      throw new Error('Contract not found.');
    }

    Object.assign(contract, input);

    return this.contractRepository.update({ contract, id });
  }
}
