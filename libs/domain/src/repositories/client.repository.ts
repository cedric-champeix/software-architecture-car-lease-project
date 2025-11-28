import type { Client, CreateClient, UpdateClient } from 'src/entities/client';

type CreateClientInput = { client: CreateClient };

type FindClientByIdInput = { id: Client['id'] };

type FindAllClientsInput = {};

type UpdateClientInput = {
  clientData: UpdateClient;
  id: Client['id'];
};

type DeleteClientByIdInput = { id: Client['id'] };

export abstract class ClientRepository {
  abstract findById({ id }: FindClientByIdInput): Promise<Client | null>;

  abstract findAll({}): Promise<Client[]>;

  abstract create({ client }: CreateClientInput): Promise<Client>;

  abstract update({
    id,
    clientData,
  }: UpdateClientInput): Promise<Client | null>;

  abstract deleteById({ id }: DeleteClientByIdInput): Promise<boolean>;
}
