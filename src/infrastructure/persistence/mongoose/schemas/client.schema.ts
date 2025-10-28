import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>;

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: [], type: [{ type: 'ObjectId', ref: 'Account' }] })
  accounts: Types.ObjectId[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
