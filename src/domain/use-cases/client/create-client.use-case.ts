import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'src/domain/entities/client.entity';
import type { ClientRepository } from 'src/domain/repositories/client.repository';

export type CreateClientUseCaseInput = {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  driverLicenseNumber: string;
  address: string;
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
      id: '',
      email,
      firstName,
      lastName,
      birthDate,
      driverLicenseNumber,
      address,
    });
    return this.repository.create({ client });
  }
}
