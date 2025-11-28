import { UseCase } from 'src/common/use-cases';
import type { Client } from 'src/entities/client/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

export class FindAllClientsUseCase extends UseCase<void, Client[]> {
  constructor(private readonly clientRepository: ClientRepository) {
    super();
  }

  async execute(): Promise<Client[]> {
    return this.clientRepository.findAll({});
  }
}
