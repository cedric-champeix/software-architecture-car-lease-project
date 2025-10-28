import { Client } from 'src/domain/entities/client.entity';
import type { ClientRepository } from 'src/domain/repositories/client.repository';

export type CreateClientUseCaseInput = {
  firstName: string;
  lastName: string;
  email: string;
};

export class CreateClientUseCase {
  constructor(private readonly repository: ClientRepository) {}

  async execute({
    firstName,
    lastName,
    email,
  }: CreateClientUseCaseInput): Promise<Client> {
    const client = new Client({
      id: '',
      email,
      firstName,
      lastName,
    });
    return this.repository.create({ client });
  }
}
