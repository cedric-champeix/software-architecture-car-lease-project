import {
  FuelType,
  MotorizationType,
  VehicleStatus,
} from '@lib/domain/entities/vehicle/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VehicleDocument = HydratedDocument<VehicleModel>;

@Schema({ collection: 'vehicles', timestamps: true })
export class VehicleModel {
  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ enum: FuelType, required: true, type: String })
  fuelType: FuelType;

  @Prop({ enum: MotorizationType, required: true, type: String })
  motorizationType: MotorizationType;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true, unique: true })
  licensePlate: string;

  @Prop({ required: true })
  acquiredDate: Date;

  @Prop({
    default: VehicleStatus.AVAILABLE,
    enum: VehicleStatus,
    required: true,
    type: String,
  })
  status: VehicleStatus;
}

export const VehicleSchema = SchemaFactory.createForClass(VehicleModel);
