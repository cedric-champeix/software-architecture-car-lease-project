import { Injectable, Inject } from '@nestjs/common';
import { Contract } from '../../entities/contract.entity';
import { ContractRepository } from '../../repositories/contract.repository';

@Injectable()
export class FindAllContractsUseCase {
  constructor(
    @Inject('ContractRepository')
    private readonly contractRepository: ContractRepository,
  ) {}

  async execute(): Promise<Contract[]> {
    return this.contractRepository.findAll();
  }
}
