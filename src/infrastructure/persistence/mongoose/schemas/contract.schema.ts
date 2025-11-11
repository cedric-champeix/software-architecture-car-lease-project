import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ContractStatus } from 'src/domain/entities/contract.entity';

@Schema({ timestamps: true, collection: 'contracts' })
export class ContractModel extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'VehicleModel' })
  vehicleId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ClientModel' })
  clientId: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    required: true,
    type: String,
    enum: ContractStatus,
    default: ContractStatus.PENDING,
  })
  status: ContractStatus;
}

export const ContractSchema = SchemaFactory.createForClass(ContractModel);
