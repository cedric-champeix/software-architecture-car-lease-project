import type { Client } from 'src/entities/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

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
