import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'clients' })
export class ClientModel extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true, unique: true })
  driverLicenseNumber: string;

  @Prop({ required: true })
  address: string;
}

export const ClientSchema = SchemaFactory.createForClass(ClientModel);
