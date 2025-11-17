import { Inject, Injectable } from '@nestjs/common';

import { Vehicle, VehicleStatus } from '../../entities/vehicle.entity';
import { VehicleRepository } from '../../repositories/vehicle.repository';

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(input: {
    acquiredDate: Date;
    color: string;
    fuelType: any;
    licensePlate: string;
    make: string;
    model: string;
  }): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findByLicensePlate(
      input.licensePlate,
    );
    if (existingVehicle) {
      throw new Error('Vehicle with this license plate already exists.');
    }

    const vehicle = new Vehicle({
      ...input,
      status: VehicleStatus.AVAILABLE,
    });

    return this.vehicleRepository.save(vehicle);
  }
}
