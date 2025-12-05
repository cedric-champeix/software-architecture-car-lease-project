import type { Contract } from '@lib/domain/entities/contract/contract.entity';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';
import type { ContractRepository } from '@lib/domain/repositories/contract.repository';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import {
  ClientExistsValidator,
  NoOverlappingContractValidator,
  VehicleExistsValidator,
  VehicleNotMaintenanceValidator,
} from '@lib/domain/use-cases/contract/validators';

import type { CreateContractUseCaseInput } from './create-contract.use-case';
import { CreateContractUseCase } from './create-contract.use-case';

export class CreateContractUseCaseValidator extends CreateContractUseCase {
  constructor(
    contractRepository: ContractRepository,
    private clientRepository: ClientRepository,
    private vehicleRepository: VehicleRepository,
  ) {
    super(contractRepository);
  }

  async execute(input: CreateContractUseCaseInput): Promise<Contract> {
    const validator = new ClientExistsValidator(this.clientRepository);
    validator
      .setNext(new VehicleExistsValidator(this.vehicleRepository))
      .setNext(new VehicleNotMaintenanceValidator(this.vehicleRepository))
      .setNext(new NoOverlappingContractValidator(this.contractRepository));

    await validator.validate(input);

    return super.execute(input);
  }
}
