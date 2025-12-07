import { UseCase } from '@lib/domain/common/use-cases';
import type { Contract } from '@lib/domain/entities/contract/contract.entity';
import { CreateContract } from '@lib/domain/entities/contract/create-contract.entity';
import { ContractStatus } from '@lib/domain/entities/contract/enum';
import type { ContractRepository } from '@lib/domain/repositories/contract.repository';

export type CreateContractUseCaseInput = {
  clientId: string;
  endDate: Date;
  startDate: Date;
  vehicleId: string;
};

export class CreateContractUseCase extends UseCase<
  CreateContractUseCaseInput,
  Contract
> {
  constructor(protected readonly contractRepository: ContractRepository) {
    super();
  }

  async execute(input: CreateContractUseCaseInput): Promise<Contract> {
    const contract = new CreateContract({
      ...input,
      status: ContractStatus.PENDING,
    });

    return this.contractRepository.create({ contract });
  }
}
