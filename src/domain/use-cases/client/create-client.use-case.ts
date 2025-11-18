import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'src/domain/entities/client.entity';
import type { ClientRepository } from 'src/domain/repositories/client.repository';

export type CreateClientUseCaseInput = {
  address: string;
  birthDate: Date;
  driverLicenseNumber: string;
  email: string;
  firstName: string;
  lastName: string;
};

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject('ClientRepository') private readonly repository: ClientRepository,
  ) {}

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
