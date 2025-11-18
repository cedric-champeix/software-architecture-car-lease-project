import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { VehicleStatus } from 'src/domain/entities/vehicle.entity';

import { CreateVehicleDto } from './create-vehicle.dto';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus;
}
