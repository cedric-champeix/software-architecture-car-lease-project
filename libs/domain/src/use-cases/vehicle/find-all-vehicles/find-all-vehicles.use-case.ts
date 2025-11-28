import { UseCase } from 'src/common/use-cases';
import type { Vehicle } from 'src/entities/vehicle/vehicle.entity';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

export class FindAllVehiclesUseCase extends UseCase<void, Vehicle[]> {
  constructor(private readonly vehicleRepository: VehicleRepository) {
    super();
  }

  async execute(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll({});
  }
}
