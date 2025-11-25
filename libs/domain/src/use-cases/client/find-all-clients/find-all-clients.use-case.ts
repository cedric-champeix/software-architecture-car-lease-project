import type { Client } from 'src/entities/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

export class FindAllClientsUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }
}
