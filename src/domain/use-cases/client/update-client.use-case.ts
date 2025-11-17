import type { Client } from 'src/domain/entities/client.entity';
import type { ClientRepository } from 'src/domain/repositories/client.repository';

export type UpdateClientUseCaseInput = {
  clientData: Omit<Partial<Client>, 'id'>;
  id: string;
};

export class UpdateClientUseCase {
  constructor(private readonly repository: ClientRepository) {}

  async execute({
    id,
    clientData,
  }: UpdateClientUseCaseInput): Promise<Client | null> {
    return this.repository.update({ clientData, id });
  }
}
