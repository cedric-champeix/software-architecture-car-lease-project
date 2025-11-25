import type { Vehicle } from 'src/entities/vehicle.entity';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

export class FindVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(id: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findById(id);
  }
}
