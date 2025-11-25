import type { Client } from 'src/entities/client.entity';

export type FindClientByIdInput = { id: Client['id'] };
export type CreateClientInput = { client: Client };
export type UpdateClientInput = {
  clientData: Omit<Partial<Client>, 'id'>;
  id: Client['id'];
};
export type DeleteClientInput = { id: Client['id'] };

export interface ClientRepository {
  create({ client }: CreateClientInput): Promise<Client>;

  delete({ id }: DeleteClientInput): Promise<boolean>;

  findAll(): Promise<Client[]>;

  findById(id: string): Promise<Client | null>;

  update({ id, clientData }: UpdateClientInput): Promise<Client | null>;
}
