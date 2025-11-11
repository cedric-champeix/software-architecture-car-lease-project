import { Injectable, Inject } from '@nestjs/common';
import { VehicleRepository } from '../../repositories/vehicle.repository';

@Injectable()
export class DeleteVehicleUseCase {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.vehicleRepository.deleteById(id);
  }
}
