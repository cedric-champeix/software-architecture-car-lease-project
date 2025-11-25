import type { ContractRepository } from 'src/repositories/contract.repository';

export class DeleteContractUseCase {
  constructor(private readonly contractRepository: ContractRepository) {}

  async execute(id: string): Promise<void> {
    return this.contractRepository.deleteById(id);
  }
}
