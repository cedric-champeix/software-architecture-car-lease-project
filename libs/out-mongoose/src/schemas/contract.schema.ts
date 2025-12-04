import { ContractStatus } from '@lib/domain/entities/contract/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ContractDocument = HydratedDocument<ContractModel>;

@Schema({ collection: 'contracts', timestamps: true })
export class ContractModel {
  @Prop({ ref: 'VehicleModel', type: MongooseSchema.Types.ObjectId })
  vehicleId: string;

  @Prop({ ref: 'ClientModel', type: MongooseSchema.Types.ObjectId })
  clientId: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    default: ContractStatus.PENDING,
    enum: ContractStatus,
    required: true,
    type: String,
  })
  status: ContractStatus;
}

export const ContractSchema = SchemaFactory.createForClass(ContractModel);
