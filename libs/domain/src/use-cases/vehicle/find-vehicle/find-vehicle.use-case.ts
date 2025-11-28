import { UseCase } from 'src/common/use-cases';
import type { Vehicle } from 'src/entities/vehicle/vehicle.entity';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

export type FindVehicleUseCaseInput = {
  id: string;
};

export class FindVehicleUseCase extends UseCase<
  FindVehicleUseCaseInput,
  Vehicle | null
> {
  constructor(private readonly vehicleRepository: VehicleRepository) {
    super();
  }

  async execute({ id }: FindVehicleUseCaseInput): Promise<Vehicle | null> {
    return this.vehicleRepository.findById({ id });
  }
}
