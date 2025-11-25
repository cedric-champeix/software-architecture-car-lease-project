import type { VehicleRepository } from 'src/repositories/vehicle.repository';

export class DeleteVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(id: string): Promise<void> {
    return this.vehicleRepository.deleteById(id);
  }
}
