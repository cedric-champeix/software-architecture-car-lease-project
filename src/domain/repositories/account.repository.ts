import { Account } from 'src/domain/entities/account.entity';

export interface AccountRepository {
  create(account: Account): Promise<Account>;

  findById(id: string): Promise<Account | null>;

  findAll(): Promise<Account[]>;

  update(account: Account): Promise<Account | null>;

  delete(id: string): Promise<void>;
}
