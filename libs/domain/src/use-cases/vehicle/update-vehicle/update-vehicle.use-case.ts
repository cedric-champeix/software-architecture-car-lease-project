import type { Vehicle } from 'src/entities/vehicle.entity';
import { VehicleStatus } from 'src/entities/vehicle.entity';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';
import type { CancelContractsForVehicleInMaintenanceUseCase } from 'src/use-cases/contract/cancel-contracts-for-vehicle-in-maintenance';

export class UpdateVehicleUseCase {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly cancelContractsForVehicleInMaintenanceUseCase: CancelContractsForVehicleInMaintenanceUseCase,
  ) {}

  async execute(
    id: string,
    input: {
      acquiredDate?: Date;
      color?: string;
      fuelType?: any;
      licensePlate?: string;
      make?: string;
      model?: string;
      status?: VehicleStatus;
    },
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error('Vehicle not found.');
    }

    if (input.licensePlate && input.licensePlate !== vehicle.licensePlate) {
      const existingVehicle = await this.vehicleRepository.findByLicensePlate(
        input.licensePlate,
      );
      if (existingVehicle) {
        throw new Error('Vehicle with this license plate already exists.');
      }
    }

    Object.assign(vehicle, input);

    // TODO: move to rabbitmq worker
    if (vehicle.status === VehicleStatus.MAINTENANCE) {
      await this.cancelContractsForVehicleInMaintenanceUseCase.execute(vehicle);
    }

    return this.vehicleRepository.save(vehicle);
  }
}
