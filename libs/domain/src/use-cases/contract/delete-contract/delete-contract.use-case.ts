import { UseCase } from '@lib/domain/common/use-cases';
import type { ContractRepository } from '@lib/domain/repositories/contract.repository';

export type DeleteContractUseCaseInput = {
  id: string;
};

export class DeleteContractUseCase extends UseCase<
  DeleteContractUseCaseInput,
  boolean
> {
  constructor(private readonly contractRepository: ContractRepository) {
    super();
  }

  async execute({ id }: DeleteContractUseCaseInput): Promise<boolean> {
    return this.contractRepository.deleteById({ id });
  }
}
