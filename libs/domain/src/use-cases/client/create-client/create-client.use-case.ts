import { UseCase } from '@lib/domain/common/use-cases';
import { CreateClient } from '@lib/domain/entities/client';
import type { Client } from '@lib/domain/entities/client/client.entity';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';

export type CreateClientUseCaseInput = {
  address: string;
  birthDate: Date;
  driverLicenseNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export class CreateClientUseCase extends UseCase<
  CreateClientUseCaseInput,
  Client
> {
  constructor(protected readonly repository: ClientRepository) {
    super();
  }

  async execute({
    firstName,
    lastName,
    email,
    birthDate,
    driverLicenseNumber,
    address,
    phoneNumber,
  }: CreateClientUseCaseInput): Promise<Client> {
    const client = new CreateClient({
      address,
      birthDate,
      driverLicenseNumber,
      email,
      firstName,
      lastName,
      phoneNumber,
    });

    return this.repository.create({ client });
  }
}
