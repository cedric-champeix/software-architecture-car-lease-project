import type { Client } from 'src/domain/entities/client.entity';
import type { ClientRepository } from 'src/domain/repositories/client.repository';

export type FindClientUseCaseInput = {
  id: string;
};

export class FindClientUseCase {
  constructor(private readonly repository: ClientRepository) {}

  async execute({ id }: FindClientUseCaseInput): Promise<Client | null> {
    return this.repository.findById({ id });
  }
}
