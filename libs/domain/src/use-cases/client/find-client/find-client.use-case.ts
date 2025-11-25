import type { Client } from 'src/entities/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

export type FindClientUseCaseInput = {
  id: string;
};

export class FindClientUseCase {
  constructor(private readonly repository: ClientRepository) {}

  async execute({ id }: FindClientUseCaseInput): Promise<Client | null> {
    return this.repository.findById(id);
  }
}
