import type { Vehicle } from '@lib/domain/entities/vehicle/vehicle.entity';

import type { CreateVehicleDto } from '../dto/create-vehicle.dto';

export class CreateVehicleMapper {
  static toEntity(dto: CreateVehicleDto): Omit<Vehicle, 'id' | 'status'> {
    return {
      acquiredDate: dto.acquiredDate,
      color: dto.color,
      fuelType: dto.fuelType,
      licensePlate: dto.licensePlate,
      make: dto.make,
      model: dto.model,
      motorizationType: dto.motorizationType,
    };
  }
}
