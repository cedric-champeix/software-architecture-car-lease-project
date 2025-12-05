import { ValidationHandler } from '@lib/domain/common/validators';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import type { CreateContractUseCaseInput } from '@lib/domain/use-cases/contract/create-contract';

export class VehicleExistsValidator extends ValidationHandler<CreateContractUseCaseInput> {
  constructor(private repository: VehicleRepository) {
    super();
  }

  protected async doValidate(input: CreateContractUseCaseInput): Promise<void> {
    const vehicle = await this.repository.findById({
      id: input.vehicleId,
    });
    if (!vehicle) {
      throw new Error('Vehicle not found.');
    }
  }
}
