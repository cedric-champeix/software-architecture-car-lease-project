import { Injectable, Inject } from '@nestjs/common';
import { Vehicle } from '../../entities/vehicle.entity';
import { VehicleRepository } from '../../repositories/vehicle.repository';

@Injectable()
export class FindAllVehiclesUseCase {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll();
  }
}
