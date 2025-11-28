import { UseCase } from '@lib/domain/common/use-cases';
import type { Vehicle } from '@lib/domain/entities/vehicle/vehicle.entity';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';

export class FindAllVehiclesUseCase extends UseCase<void, Vehicle[]> {
  constructor(private readonly vehicleRepository: VehicleRepository) {
    super();
  }

  async execute(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll({});
  }
}
