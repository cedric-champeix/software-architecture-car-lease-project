import { Inject, Injectable } from '@nestjs/common';
import { Contract } from 'src/entities/contract.entity';
import { ContractRepository } from 'src/repositories/contract.repository';

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
