import { ValidationHandler } from '@lib/domain/common/validators';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import type { CreateVehicleUseCaseInput } from '@lib/domain/use-cases/vehicle/create-vehicle';

export class UniqueLicensePlateValidator extends ValidationHandler<CreateVehicleUseCaseInput> {
  constructor(private repository: VehicleRepository) {
    super();
  }

  protected async doValidate(input: CreateVehicleUseCaseInput): Promise<void> {
    const existingVehicle = await this.repository.findByLicensePlate({
      licensePlate: input.licensePlate,
    });

    if (existingVehicle) {
      throw new Error(
        `A vehicle with license plate "${input.licensePlate}" already exists`,
      );
    }
  }
}
