import { UseCase } from '@lib/domain/common/use-cases';
import type { Client } from '@lib/domain/entities/client/client.entity';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';

export type FindClientUseCaseInput = {
  id: string;
};

export class FindClientUseCase extends UseCase<
  FindClientUseCaseInput,
  Client | null
> {
  constructor(private readonly repository: ClientRepository) {
    super();
  }

  async execute({ id }: FindClientUseCaseInput): Promise<Client | null> {
    return this.repository.findById({ id });
  }
}
