import { UseCase } from '@lib/domain/common/use-cases';
import type {
  FuelType,
  MotorizationType,
} from '@lib/domain/entities/vehicle/enum';
import { VehicleStatus } from '@lib/domain/entities/vehicle/enum';
import type { Vehicle } from '@lib/domain/entities/vehicle/vehicle.entity';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import type { CancelContractsForVehicleInMaintenanceUseCase } from '@lib/domain/use-cases/contract/cancel-contracts-for-vehicle-in-maintenance';

export type UpdateVehicleUseCaseInput = {
  id: string;
  input: {
    acquiredDate?: Date;
    color?: string;
    fuelType?: FuelType;
    licensePlate?: string;
    make?: string;
    model?: string;
    motorizationType?: MotorizationType;
    status?: VehicleStatus;
  };
};

export class UpdateVehicleUseCase extends UseCase<
  UpdateVehicleUseCaseInput,
  Vehicle
> {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly cancelContractsForVehicleInMaintenanceUseCase: CancelContractsForVehicleInMaintenanceUseCase,
  ) {
    super();
  }

  async execute({ id, input }: UpdateVehicleUseCaseInput): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById({ id });

    if (!vehicle) {
      throw new Error('Vehicle not found.');
    }

    if (input.licensePlate && input.licensePlate !== vehicle.licensePlate) {
      const existingVehicle = await this.vehicleRepository.findByLicensePlate({
        licensePlate: input.licensePlate,
      });
      if (existingVehicle) {
        throw new Error('Vehicle with this license plate already exists.');
      }
    }

    Object.assign(vehicle, input);

    // TODO: move to rabbitmq worker
    if (vehicle.status === VehicleStatus.MAINTENANCE) {
      await this.cancelContractsForVehicleInMaintenanceUseCase.execute(vehicle);
    }

    return this.vehicleRepository.update({
      id,
      vehicle,
    });
  }
}
