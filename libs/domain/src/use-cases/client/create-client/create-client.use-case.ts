import { Client } from 'src/entities/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

export type CreateClientUseCaseInput = {
  address: string;
  birthDate: Date;
  driverLicenseNumber: string;
  email: string;
  firstName: string;
  lastName: string;
};

export class CreateClientUseCase {
  constructor(private readonly repository: ClientRepository) {}

  async execute({
    firstName,
    lastName,
    email,
    birthDate,
    driverLicenseNumber,
    address,
  }: CreateClientUseCaseInput): Promise<Client> {
    const client = new Client({
      address,
      birthDate,
      driverLicenseNumber,
      email,
      firstName,
      id: '',
      lastName,
    });
    return this.repository.create({ client });
  }
}
