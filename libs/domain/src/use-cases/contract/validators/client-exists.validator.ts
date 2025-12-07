import { ValidationHandler } from '@lib/domain/common/validators';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';
import type { CreateContractUseCaseInput } from '@lib/domain/use-cases/contract/create-contract';

export class ClientExistsValidator extends ValidationHandler<CreateContractUseCaseInput> {
  constructor(private repository: ClientRepository) {
    super();
  }

  protected async doValidate(input: CreateContractUseCaseInput): Promise<void> {
    const client = await this.repository.findById({ id: input.clientId });
    if (!client) {
      throw new Error('Client not found.');
    }
  }
}
