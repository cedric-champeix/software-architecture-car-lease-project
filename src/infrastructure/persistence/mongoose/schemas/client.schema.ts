import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<ClientModel>;

@Schema({ collection: 'clients', timestamps: true })
export class ClientModel {
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
