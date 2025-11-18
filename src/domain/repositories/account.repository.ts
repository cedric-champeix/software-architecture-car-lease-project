import type { Account } from 'src/domain/entities/account.entity';

export interface AccountRepository {
  create(account: Account): Promise<Account>;

  delete(id: string): Promise<void>;

  findAll(): Promise<Account[]>;

  findById(id: string): Promise<Account | null>;

  update(account: Account): Promise<Account | null>;
}
