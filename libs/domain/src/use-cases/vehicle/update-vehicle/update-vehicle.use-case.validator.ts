import type { Vehicle } from '@lib/domain/entities/vehicle/vehicle.entity';
import type { VehicleMaintenanceProducer } from '@lib/domain/producers/vehicle-maintenance.producer';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import {
  UniqueLicensePlateOnUpdateValidator,
  VehicleExistsValidator,
} from '@lib/domain/use-cases/vehicle/validators';

import type { UpdateVehicleUseCaseInput } from '.';
import { UpdateVehicleUseCase } from '.';

export class UpdateVehicleUseCaseValidator extends UpdateVehicleUseCase {
  constructor(
    repository: VehicleRepository,
    vehicleMaintenanceProducer: VehicleMaintenanceProducer,
  ) {
    super(repository, vehicleMaintenanceProducer);
  }

  async execute(input: UpdateVehicleUseCaseInput): Promise<Vehicle> {
    const vehicleExistsValidator = new VehicleExistsValidator(
      this.vehicleRepository,
    );
    vehicleExistsValidator.setNext(
      new UniqueLicensePlateOnUpdateValidator(this.vehicleRepository),
    );
    await vehicleExistsValidator.validate(input);

    return super.execute(input);
  }
}
