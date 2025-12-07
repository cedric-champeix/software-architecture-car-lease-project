import type { Vehicle } from '@lib/domain/entities/vehicle/vehicle.entity';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import { UniqueLicensePlateValidator } from '@lib/domain/use-cases/vehicle/validators';

import type { CreateVehicleUseCaseInput } from '.';
import { CreateVehicleUseCase } from '.';

export class CreateVehicleUseCaseValidator extends CreateVehicleUseCase {
  constructor(repository: VehicleRepository) {
    super(repository);
  }

  async execute(input: CreateVehicleUseCaseInput): Promise<Vehicle> {
    const validator = new UniqueLicensePlateValidator(this.vehicleRepository);
    await validator.validate(input);

    return super.execute(input);
  }
}
