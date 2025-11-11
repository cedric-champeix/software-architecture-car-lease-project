import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FuelType, VehicleStatus } from 'src/domain/entities/vehicle.entity';

@Schema({ timestamps: true, collection: 'vehicles' })
export class VehicleModel {
  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true, type: String, enum: FuelType })
  fuelType: FuelType;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true, unique: true })
  licensePlate: string;

  @Prop({ required: true })
  acquiredDate: Date;

  @Prop({
    required: true,
    type: String,
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
  })
  status: VehicleStatus;
}

export const VehicleSchema = SchemaFactory.createForClass(VehicleModel);
