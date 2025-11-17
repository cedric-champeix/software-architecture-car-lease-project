import { Inject, Injectable } from '@nestjs/common';

import { Vehicle, VehicleStatus } from '../../entities/vehicle.entity';
import { VehicleRepository } from '../../repositories/vehicle.repository';
import { ContractService } from '../../services/contract.service';

@Injectable()
export class UpdateVehicleUseCase {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,
    private readonly contractService: ContractService,
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

    if (vehicle.status === VehicleStatus.MAINTENANCE) {
      await this.contractService.cancelContractsForVehicleInMaintenance(
        vehicle,
      );
    }

    return this.vehicleRepository.save(vehicle);
  }
}
