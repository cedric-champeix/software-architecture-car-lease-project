import type { Client } from 'src/domain/entities/client.entity';
import type { ClientRepository } from 'src/domain/repositories/client.repository';

export class FindAllClientsUseCase {
  constructor(private readonly repository: ClientRepository) {}

  async execute(): Promise<Client[]> {
    return this.repository.findAll();
  }
}
