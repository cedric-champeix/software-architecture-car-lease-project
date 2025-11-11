import type { Client } from 'src/domain/entities/client.entity';

export type FindClientByIdInput = { id: Client['id'] };
export type CreateClientInput = { client: Client };
export type UpdateClientInput = {
  id: Client['id'];
  clientData: Omit<Partial<Client>, 'id'>;
};
export type DeleteClientInput = { id: Client['id'] };

export interface ClientRepository {
  create({ client }: CreateClientInput): Promise<Client>;

  findById(id: string): Promise<Client | null>;

  findAll(): Promise<Client[]>;

  update({ id, clientData }: UpdateClientInput): Promise<Client | null>;

  delete({ id }: DeleteClientInput): Promise<boolean>;
}
