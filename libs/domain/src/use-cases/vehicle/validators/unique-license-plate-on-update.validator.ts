import { ValidationHandler } from '@lib/domain/common/validators';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import type { UpdateVehicleUseCaseInput } from '@lib/domain/use-cases/vehicle/update-vehicle';

export class UniqueLicensePlateOnUpdateValidator extends ValidationHandler<UpdateVehicleUseCaseInput> {
  constructor(private repository: VehicleRepository) {
    super();
  }

  protected async doValidate(input: UpdateVehicleUseCaseInput): Promise<void> {
    // Only validate if license plate is being updated
    if (!input.input.licensePlate) {
      return;
    }

    // Get the current vehicle to compare license plates
    const currentVehicle = await this.repository.findById({ id: input.id });

    if (!currentVehicle) {
      // Vehicle existence is validated by another validator
      return;
    }

    // Only check for duplicates if the license plate is actually changing
    if (input.input.licensePlate === currentVehicle.licensePlate) {
      return;
    }

    const existingVehicle = await this.repository.findByLicensePlate({
      licensePlate: input.input.licensePlate,
    });

    if (existingVehicle) {
      throw new Error(
        `A vehicle with license plate "${input.input.licensePlate}" already exists`,
      );
    }
  }
}
