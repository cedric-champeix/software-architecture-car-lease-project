import type { Vehicle } from 'src/entities/vehicle.entity';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

export class FindAllVehiclesUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll();
  }
}
