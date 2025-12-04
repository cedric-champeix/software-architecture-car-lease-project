import type {
  Client,
  CreateClient,
  UpdateClient,
} from '@lib/domain/entities/client';

export type CreateClientInput = { client: CreateClient };

export type FindClientByIdInput = { id: Client['id'] };

export type FindAllClientsInput = Record<string, never>;

export type UpdateClientInput = {
  clientData: UpdateClient;
  id: Client['id'];
};

export type DeleteClientInput = { id: Client['id'] };

export abstract class ClientRepository {
  abstract findById({ id }: FindClientByIdInput): Promise<Client | null>;

  abstract findAll(input: FindAllClientsInput): Promise<Client[]>;

  abstract create({ client }: CreateClientInput): Promise<Client>;

  abstract update({
    id,
    clientData,
  }: UpdateClientInput): Promise<Client | null>;

  abstract deleteById({ id }: DeleteClientInput): Promise<boolean>;
}
