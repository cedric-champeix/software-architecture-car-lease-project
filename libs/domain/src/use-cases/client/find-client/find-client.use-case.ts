import { UseCase } from 'src/common/use-cases';
import type { Client } from 'src/entities/client/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

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
