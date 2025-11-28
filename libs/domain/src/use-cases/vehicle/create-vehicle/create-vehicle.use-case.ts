import { UseCase } from 'src/common/use-cases';
import { CreateVehicle } from 'src/entities/vehicle';
import type { FuelType, MotorizationType } from 'src/entities/vehicle/enum';
import { VehicleStatus } from 'src/entities/vehicle/enum';
import type { Vehicle } from 'src/entities/vehicle/vehicle.entity';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

export type CreateVehicleUseCaseInput = {
  acquiredDate: Date;
  color: string;
  fuelType: FuelType;
  licensePlate: string;
  make: string;
  model: string;
  motorizationType: MotorizationType;
};

export class CreateVehicleUseCase extends UseCase<
  CreateVehicleUseCaseInput,
  Vehicle
> {
  constructor(private readonly vehicleRepository: VehicleRepository) {
    super();
  }

  async execute(input: CreateVehicleUseCaseInput): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findByLicensePlate({
      licensePlate: input.licensePlate,
    });

    if (existingVehicle) {
      throw new Error('Vehicle with this license plate already exists.');
    }

    const vehicle = new CreateVehicle({
      ...input,
      status: VehicleStatus.AVAILABLE,
    });

    return this.vehicleRepository.create({ vehicle });
  }
}
