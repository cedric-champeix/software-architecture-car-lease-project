import { UseCase } from 'src/common/use-cases';
import type { Contract } from 'src/entities/contract/contract.entity';
import type { ContractRepository } from 'src/repositories/contract.repository';

export type FindContractUseCaseInput = {
  id: string;
};

export class FindContractUseCase extends UseCase<
  FindContractUseCaseInput,
  Contract | null
> {
  constructor(private readonly contractRepository: ContractRepository) {
    super();
  }

  async execute({ id }: FindContractUseCaseInput): Promise<Contract | null> {
    return this.contractRepository.findById({ id });
  }
}
