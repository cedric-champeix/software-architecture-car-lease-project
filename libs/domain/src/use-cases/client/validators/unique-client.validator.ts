import { ValidationHandler } from 'src/common/validators';
import type { ClientRepository } from 'src/repositories/client.repository';
import type { CreateClientUseCaseInput } from 'src/use-cases/client/create-client';

export class UniqueClientValidator extends ValidationHandler<CreateClientUseCaseInput> {
  constructor(private repository: ClientRepository) {
    super();
  }

  protected async doValidate(input: CreateClientUseCaseInput): Promise<void> {
    const allClients = await this.repository.findAll({});

    const duplicateClient = allClients.find(
      (client) =>
        client.firstName === input.firstName &&
        client.lastName === input.lastName &&
        client.birthDate.getDate() === input.birthDate.getDate(),
    );

    if (duplicateClient) {
      throw new Error(
        `A client with the same first name, last name, and birth date already exists`,
      );
    }
  }
}
