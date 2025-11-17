import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { ClientModel } from 'src/infrastructure/persistence/mongoose/schemas/client.schema';

export type AccountDocument = HydratedDocument<AccountModel>;

@Schema({ collection: 'accounts', timestamps: true })
export class AccountModel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  balance: number;

  @Prop({ ref: ClientModel.name, type: 'ObjectId' })
  client: ClientModel;
}

export const AccountSchema = SchemaFactory.createForClass(AccountModel);
