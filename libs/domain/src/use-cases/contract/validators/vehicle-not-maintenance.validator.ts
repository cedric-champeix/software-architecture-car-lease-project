import { ValidationHandler } from '@lib/domain/common/validators';
import { VehicleStatus } from '@lib/domain/entities/vehicle/enum';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import type { CreateContractUseCaseInput } from '@lib/domain/use-cases/contract/create-contract';

export class VehicleNotMaintenanceValidator extends ValidationHandler<CreateContractUseCaseInput> {
  constructor(private repository: VehicleRepository) {
    super();
  }

  protected async doValidate(input: CreateContractUseCaseInput): Promise<void> {
    const vehicle = await this.repository.findById({
      id: input.vehicleId,
    });
    if (vehicle && vehicle.status === VehicleStatus.MAINTENANCE) {
      throw new Error('Vehicle is under maintenance and cannot be leased.');
    }
  }
}
