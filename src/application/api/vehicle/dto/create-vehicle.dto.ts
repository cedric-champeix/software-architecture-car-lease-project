import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FuelType, MotorizationType } from 'src/domain/entities/vehicle.entity';

// TODO: the licensePlate should be unique
export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsEnum(FuelType)
  @IsNotEmpty()
  fuelType: FuelType;

  @IsEnum(MotorizationType)
  @IsNotEmpty()
  motorizationType: MotorizationType;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  acquiredDate: Date;
}
