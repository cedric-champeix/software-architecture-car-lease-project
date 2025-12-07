import { ValidationHandler } from '@lib/domain/common/validators';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import type { UpdateVehicleUseCaseInput } from '@lib/domain/use-cases/vehicle/update-vehicle';

export class VehicleExistsValidator extends ValidationHandler<UpdateVehicleUseCaseInput> {
  constructor(private repository: VehicleRepository) {
    super();
  }

  protected async doValidate(input: UpdateVehicleUseCaseInput): Promise<void> {
    const vehicle = await this.repository.findById({ id: input.id });

    if (!vehicle) {
      throw new Error('Vehicle not found.');
    }
  }
}
