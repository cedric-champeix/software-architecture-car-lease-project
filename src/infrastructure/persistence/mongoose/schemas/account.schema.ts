import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ClientModel } from 'src/infrastructure/persistence/mongoose/schemas/client.schema';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  balance: number;

  @Prop({ type: 'ObjectId', ref: 'ClientModel' })
  client: ClientModel;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.virtual('id').get(function (this: AccountDocument) {
  return this._id.toHexString();
});
