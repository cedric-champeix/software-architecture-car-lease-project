import { ValidationHandler } from 'src/common/validators';
import type { ClientRepository } from 'src/repositories/client.repository';
import type { CreateClientUseCaseInput } from 'src/use-cases/client/create-client';

export class UniqueDriverLicenseValidator extends ValidationHandler<CreateClientUseCaseInput> {
  constructor(private repository: ClientRepository) {
    super();
  }

  protected async doValidate(input: CreateClientUseCaseInput): Promise<void> {
    const allClients = await this.repository.findAll({});

    const duplicateLicense = allClients.find(
      (client) => client.driverLicenseNumber === input.driverLicenseNumber,
    );

    if (duplicateLicense) {
      throw new Error(
        `A client with driver license number "${input.driverLicenseNumber}" already exists`,
      );
    }
  }
}
