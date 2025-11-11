import { Injectable, Inject } from '@nestjs/common';
import { Contract } from '../../entities/contract.entity';
import { ContractRepository } from '../../repositories/contract.repository';

@Injectable()
export class FindContractUseCase {
  constructor(
    @Inject('ContractRepository')
    private readonly contractRepository: ContractRepository,
  ) {}

  async execute(id: string): Promise<Contract | null> {
    return this.contractRepository.findById(id);
  }
}
