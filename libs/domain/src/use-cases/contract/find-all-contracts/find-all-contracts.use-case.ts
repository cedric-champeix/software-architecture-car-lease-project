import { UseCase } from 'src/common/use-cases';
import type { Contract } from 'src/entities/contract';
import type { ContractRepository } from 'src/repositories/contract.repository';

export class FindAllContractsUseCase extends UseCase<void, Contract[]> {
  constructor(private readonly contractRepository: ContractRepository) {
    super();
  }

  async execute(): Promise<Contract[]> {
    return this.contractRepository.findAll({});
  }
}
