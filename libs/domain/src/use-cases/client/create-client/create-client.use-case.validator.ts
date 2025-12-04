import type { Client } from '@lib/domain/entities/client/client.entity';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';
import {
  UniqueClientValidator,
  UniqueDriverLicenseValidator,
} from '@lib/domain/use-cases/client/validators';

import type { CreateClientUseCaseInput } from '.';
import { CreateClientUseCase } from '.';

export class CreateClientUseCaseValidator extends CreateClientUseCase {
  constructor(repository: ClientRepository) {
    super(repository);
  }

  async execute(input: CreateClientUseCaseInput): Promise<Client> {
    const validator = new UniqueClientValidator(this.repository);
    validator.setNext(new UniqueDriverLicenseValidator(this.repository));
    await validator.validate(input);

    return super.execute(input);
  }
}
