import { Injectable, Inject } from '@nestjs/common';
import { ContractRepository } from '../../repositories/contract.repository';

@Injectable()
export class DeleteContractUseCase {
  constructor(
    @Inject('ContractRepository')
    private readonly contractRepository: ContractRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.contractRepository.deleteById(id);
  }
}
