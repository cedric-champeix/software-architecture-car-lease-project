import { Vehicle, VehicleStatus } from 'src/entities/vehicle.entity';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

export class CreateVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

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
