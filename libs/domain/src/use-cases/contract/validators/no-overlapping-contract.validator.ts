import { ValidationHandler } from '@lib/domain/common/validators';
import type { ContractRepository } from '@lib/domain/repositories/contract.repository';
import type { CreateContractUseCaseInput } from '@lib/domain/use-cases/contract/create-contract';

export class NoOverlappingContractValidator extends ValidationHandler<CreateContractUseCaseInput> {
  constructor(private repository: ContractRepository) {
    super();
  }

  protected async doValidate(input: CreateContractUseCaseInput): Promise<void> {
    const overlappingContracts =
      await this.repository.findByVehicleIdAndDateRange({
        endDate: input.endDate,
        startDate: input.startDate,
        vehicleId: input.vehicleId,
      });

    if (overlappingContracts.length > 0) {
      throw new Error('Vehicle is already leased for the selected period.');
    }
  }
}
