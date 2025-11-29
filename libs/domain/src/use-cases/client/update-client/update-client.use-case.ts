import { UseCase } from '@lib/domain/common/use-cases';
import type { UpdateClient } from '@lib/domain/entities/client';
import type { Client } from '@lib/domain/entities/client/client.entity';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';

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
