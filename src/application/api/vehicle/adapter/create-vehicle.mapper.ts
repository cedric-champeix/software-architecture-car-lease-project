import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { Vehicle } from 'src/domain/entities/vehicle.entity';

export class CreateVehicleMapper {
  static toEntity(dto: CreateVehicleDto): Vehicle {
    return new Vehicle({
      make: dto.make,
      model: dto.model,
      fuelType: dto.fuelType,
      color: dto.color,
      licensePlate: dto.licensePlate,
      acquiredDate: dto.acquiredDate,
    });
  }
}
