import { UseCase } from 'src/common/use-cases';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

export type DeleteVehicleUseCaseInput = {
  id: string;
};

export class DeleteVehicleUseCase extends UseCase<
  DeleteVehicleUseCaseInput,
  boolean
> {
  constructor(private readonly vehicleRepository: VehicleRepository) {
    super();
  }

  async execute({ id }: DeleteVehicleUseCaseInput): Promise<boolean> {
    return this.vehicleRepository.deleteById({ id });
  }
}
