import { UseCase } from '@lib/domain/common/use-cases';
import type { Client } from '@lib/domain/entities/client/client.entity';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';

export class FindAllClientsUseCase extends UseCase<void, Client[]> {
  constructor(private readonly clientRepository: ClientRepository) {
    super();
  }

  async execute(): Promise<Client[]> {
    return this.clientRepository.findAll({});
  }
}
