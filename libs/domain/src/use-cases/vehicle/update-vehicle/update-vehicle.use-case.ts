import { UseCase } from '../../../common/use-cases';
import type {
  FuelType,
  MotorizationType,
} from '../../../entities/vehicle/enum';
import { VehicleStatus } from '../../../entities/vehicle/enum';
import type { Vehicle } from '../../../entities/vehicle/vehicle.entity';
import type { VehicleMaintenanceProducer } from '../../../producers/vehicle-maintenance.producer';
import type { VehicleRepository } from '../../../repositories/vehicle.repository';

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
    private readonly vehicleMaintenanceProducer: VehicleMaintenanceProducer,
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

    if (vehicle.status === VehicleStatus.MAINTENANCE) {
      // await this.cancelContractsForVehicleInMaintenanceUseCase.execute(vehicle);
      await this.vehicleMaintenanceProducer.sendVehicleMaintenanceJob(
        vehicle.id,
      );
    }

    return this.vehicleRepository.update({
      id,
      vehicle,
    });
  }
}
