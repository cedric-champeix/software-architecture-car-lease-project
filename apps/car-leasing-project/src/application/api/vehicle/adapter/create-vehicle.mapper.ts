import { Vehicle } from 'src/domain/entities/vehicle.entity';

import type { CreateVehicleDto } from '../dto/create-vehicle.dto';

export class CreateVehicleMapper {
  static toEntity(dto: CreateVehicleDto): Vehicle {
    return new Vehicle({
      acquiredDate: dto.acquiredDate,
      color: dto.color,
      fuelType: dto.fuelType,
      licensePlate: dto.licensePlate,
      make: dto.make,
      model: dto.model,
    });
  }
}
