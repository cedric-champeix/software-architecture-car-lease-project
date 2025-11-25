import type { Contract } from 'src/entities/contract.entity';
import type { ContractRepository } from 'src/repositories/contract.repository';

export class FindAllContractsUseCase {
  constructor(private readonly contractRepository: ContractRepository) {}

  async execute(): Promise<Contract[]> {
    return this.contractRepository.findAll();
  }
}
