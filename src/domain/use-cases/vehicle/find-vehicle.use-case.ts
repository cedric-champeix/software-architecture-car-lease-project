import { Injectable, Inject } from '@nestjs/common';
import { Vehicle } from '../../entities/vehicle.entity';
import { VehicleRepository } from '../../repositories/vehicle.repository';

@Injectable()
export class FindVehicleUseCase {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(id: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findById(id);
  }
}
