import { UseCase } from '@lib/domain/common/use-cases';
import type { Contract } from '@lib/domain/entities/contract';
import type { ContractRepository } from '@lib/domain/repositories/contract.repository';

export class FindAllContractsUseCase extends UseCase<void, Contract[]> {
  constructor(private readonly contractRepository: ContractRepository) {
    super();
  }

  async execute(): Promise<Contract[]> {
    return this.contractRepository.findAll({});
  }
}
