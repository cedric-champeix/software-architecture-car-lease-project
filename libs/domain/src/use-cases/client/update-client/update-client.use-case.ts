import { UseCase } from 'src/common/use-cases';
import type { UpdateClient } from 'src/entities/client';
import type { Client } from 'src/entities/client/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

export type UpdateClientUseCaseInput = {
  clientData: UpdateClient;
  id: string;
};

export class UpdateClientUseCase extends UseCase<
  UpdateClientUseCaseInput,
  Client | null
> {
  constructor(private readonly repository: ClientRepository) {
    super();
  }

  async execute({
    id,
    clientData,
  }: UpdateClientUseCaseInput): Promise<Client | null> {
    return this.repository.update({ clientData, id });
  }
}
