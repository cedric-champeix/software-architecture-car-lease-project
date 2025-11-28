import type { Client } from 'src/entities/client/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';
import {
  UniqueClientValidator,
  UniqueDriverLicenseValidator,
} from 'src/use-cases/client/validators';

import type { CreateClientUseCaseInput } from '.';
import { CreateClientUseCase } from '.';

export class CreateClientUseCaseValidator extends CreateClientUseCase {
  constructor(repository: ClientRepository) {
    super(repository);
  }

  async execute(input: CreateClientUseCaseInput): Promise<Client> {
    await new UniqueClientValidator(this.repository)
      .setNext(new UniqueDriverLicenseValidator(this.repository))
      .validate(input);

    return super.execute(input);
  }
}
