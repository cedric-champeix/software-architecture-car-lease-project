import { Injectable, Inject } from '@nestjs/common';
import { Vehicle, VehicleStatus } from '../../entities/vehicle.entity';
import { VehicleRepository } from '../../repositories/vehicle.repository';

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(input: {
    make: string;
    model: string;
    fuelType: any;
    color: string;
    licensePlate: string;
    acquiredDate: Date;
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
