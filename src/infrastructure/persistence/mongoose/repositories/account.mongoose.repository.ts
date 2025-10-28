import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/domain/entities/account.entity';
import { AccountRepository } from 'src/domain/repositories/account.repository';
import { AccountDocument } from 'src/infrastructure/persistence/mongoose/schemas/account.schema';

export class MongoAccountRepository implements AccountRepository {
  constructor(
    @InjectModel('Account') private readonly model: Model<AccountDocument>,
  ) {}

  async create(account: Account): Promise<Account> {
    const created = await this.model.create(account);
    return new Account({
      id: created._id.toString(),
      name: created.name,
      type: created.type,
      balance: created.balance,
    });
  }

  async findById(id: string): Promise<Account | null> {
    const doc = await this.model.findById(id);
    return doc
      ? new Account({
          id: doc._id.toString(),
          name: doc.name,
          type: doc.type,
          balance: doc.balance,
        })
      : null;
  }

  async findAll(): Promise<Account[]> {
    const docs = await this.model.find();
    return docs.map(
      (d) =>
        new Account({
          id: d._id.toString(),
          name: d.name,
          type: d.type,
          balance: d.balance,
        }),
    );
  }

  async update(account: Account): Promise<Account | null> {
    const updated = await this.model.findByIdAndUpdate(account.id, account, {
      new: true,
    });
    if (!updated) return null;
    return new Account({
      id: updated._id.toString(),
      name: updated.name,
      type: updated.type,
      balance: updated.balance,
    });
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
